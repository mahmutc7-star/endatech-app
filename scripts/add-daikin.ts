import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const daikins = [
  { model: "Ururu Sarara", type: "Wand", desc: "Wand Split | Ururu Sarara | Topmodel A+++ | 2.5-7.1 kW bereik" },
  { model: "Emura", type: "Wand", desc: "Wand Split | Emura | Design serie | 2.5-7.1 kW bereik" },
  { model: "Stylish FTXA-AW", type: "Wand", desc: "Wand Split | Stylish | Kleur: wit | 2.5-7.1 kW bereik" },
  { model: "Stylish FTXA-BS", type: "Wand", desc: "Wand Split | Stylish | Kleur: zilver | 2.5-7.1 kW bereik" },
  { model: "Stylish FTXA-BB", type: "Wand", desc: "Wand Split | Stylish | Kleur: zwart | 2.5-7.1 kW bereik" },
  { model: "Stylish FTXA-BT", type: "Wand", desc: "Wand Split | Stylish | Kleur: zwart hout | 2.5-7.1 kW bereik" },
  { model: "Perfera", type: "Wand", desc: "Wand Split | Perfera | Met sensor | 2.5-7.1 kW bereik" },
  { model: "Perfera Vloer", type: "Vloer", desc: "Vloermodel | Perfera vloer | 2.5-7.1 kW bereik" },
  { model: "Comfora", type: "Wand", desc: "Wand Split | Comfora | Budget serie | 2.5-7.1 kW bereik" },
];

async function main() {
  let ok = 0;
  for (const d of daikins) {
    await prisma.aircoModel.upsert({
      where: { brand_model: { brand: "Daikin", model: d.model } },
      create: { brand: "Daikin", model: d.model, type: d.type, description: d.desc, active: true },
      update: { type: d.type, description: d.desc },
    });
    ok++;
    console.log(`  + Daikin ${d.model}`);
  }
  console.log(`\nDone: ${ok} Daikin modellen toegevoegd`);
  const total = await prisma.aircoModel.count();
  console.log(`Totaal in database: ${total}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
