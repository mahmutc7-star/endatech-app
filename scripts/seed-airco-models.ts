import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface RawRecord {
  Merk: string;
  Productlijn?: string;
  Systeemtype?: string;
  Unittype?: string;
  Serie?: string;
  "Kleur / variant"?: string;
  Modelcode?: string;
  "Nominaal koelen (kW)"?: number;
  "Nominaal verwarmen (kW)"?: number;
  "Capaciteitsklasse (BTU/h)"?: string;
  "Poorten / aansluitingen"?: string;
  Fase?: string;
  Opmerking?: string;
}

function mapBrand(merk: string): string {
  if (merk === "Mitsubishi Heavy Industries") return "Mitsubishi Heavy";
  return merk;
}

function mapType(r: RawRecord): string {
  const u = r.Unittype || "";
  if (u.includes("Wand")) return "Wand";
  if (u === "Console" || u === "Console / Vloer-Plafond") return "Console";
  if (u.includes("Cassette") || u === "1-zijdige cassette") return "Cassette";
  if (u === "Kanaal") return "Kanaal";
  if (u.includes("Vloer/Plafond") || u === "Vloer-Plafond") return "Vloer/Plafond";
  if (u === "Vloer") return "Vloer";
  if (u === "Buitenunit") return "Buitenunit";
  if (u === "Dakairco") return "Dakairco";
  if (u === "Kolom") return "Kolom";
  return r.Systeemtype || "Overig";
}

function buildDesc(r: RawRecord): string {
  const p: string[] = [];
  if (r.Productlijn) p.push(r.Productlijn);
  if (r.Serie && r.Serie !== r.Productlijn) p.push(`Serie: ${r.Serie}`);
  if (r.Systeemtype) p.push(r.Systeemtype);
  if (r["Kleur / variant"]) p.push(`Kleur: ${r["Kleur / variant"]}`);
  if (r.Fase) p.push(r.Fase);
  if (r["Capaciteitsklasse (BTU/h)"] && !r["Capaciteitsklasse (BTU/h)"].includes("Dakairco"))
    p.push(`${r["Capaciteitsklasse (BTU/h)"]} BTU/h`);
  if (r["Poorten / aansluitingen"]) p.push(`${r["Poorten / aansluitingen"]} poorten`);
  if (r.Opmerking) p.push(r.Opmerking);
  return p.join(" | ");
}

async function main() {
  // Try loading from file
  const jsonPath = path.join(__dirname, "..", "airco_database_claude.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    console.error("Place airco_database_claude.json in the project root.");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const records: RawRecord[] = raw.records;
  console.log(`Loaded ${records.length} records`);

  const valid = records.filter((r) => r.Modelcode && r.Modelcode.trim() !== "");
  console.log(`${valid.length} with Modelcode`);

  const seen = new Map<string, number>();
  let ok = 0, skip = 0, err = 0;

  for (const r of valid) {
    const brand = mapBrand(r.Merk);
    let model = r.Modelcode!;
    const color = r["Kleur / variant"];
    const key = `${brand}::${model}`;
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);

    if (count > 0 && color) model = `${model} (${color})`;
    else if (count > 0) model = `${model} (#${count + 1})`;

    try {
      await prisma.aircoModel.upsert({
        where: { brand_model: { brand, model } },
        create: {
          brand, model,
          type: mapType(r),
          coolingCapacity: r["Nominaal koelen (kW)"] ? `${r["Nominaal koelen (kW)"]} kW` : null,
          heatingCapacity: r["Nominaal verwarmen (kW)"] ? `${r["Nominaal verwarmen (kW)"]} kW` : null,
          description: buildDesc(r),
          active: true,
        },
        update: {
          type: mapType(r),
          coolingCapacity: r["Nominaal koelen (kW)"] ? `${r["Nominaal koelen (kW)"]} kW` : null,
          heatingCapacity: r["Nominaal verwarmen (kW)"] ? `${r["Nominaal verwarmen (kW)"]} kW` : null,
          description: buildDesc(r),
        },
      });
      ok++;
      if (ok % 20 === 0) process.stdout.write(".");
    } catch (e: unknown) {
      console.error(`\nError ${brand} ${model}: ${e instanceof Error ? e.message : e}`);
      err++;
    }
  }

  console.log(`\n\nDone: ${ok} created/updated, ${skip} skipped, ${err} errors`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
