import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Map: brand + description keywords -> image path
const IMAGE_RULES: { brand: string; match: (desc: string, type: string, model: string) => boolean; image: string }[] = [
  // === GREE (from greebelgium.be + aircobeurs.nl) ===
  { brand: "Gree", match: (d, t) => d.includes("Fairy") && t === "Wand", image: "/products/gree-fairy.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Clivia") && t === "Wand", image: "/products/gree-clivia.png" },
  { brand: "Gree", match: (d, t) => d.includes("Airy") && t === "Wand", image: "/products/gree-airy.webp" },
  { brand: "Gree", match: (d, t) => d.includes("Charmo") && t === "Wand", image: "/products/gree-charmo.png" },
  { brand: "Gree", match: (_, t) => t === "Console", image: "/products/gree-console.png" },
  { brand: "Gree", match: (_, t) => t === "Cassette", image: "/products/gree-cassette.png" },
  { brand: "Gree", match: (_, t) => t === "Kanaal", image: "/products/gree-kanaal.png" },
  { brand: "Gree", match: (_, t) => t === "Vloer/Plafond", image: "/products/gree-vloerplafond.jpg" },
  { brand: "Gree", match: (_, t) => t === "Buitenunit", image: "/products/gree-buitenunit.png" },
  { brand: "Gree", match: (_, t) => t === "Dakairco", image: "/products/gree-lomo.png" },
  // Fallback Gree wand (Free Match indoor wand units)
  { brand: "Gree", match: (_, t) => t === "Wand", image: "/products/gree-clivia.png" },

  // === DAIKIN (from daikin-ce.com official DAM packshots 1280px) ===
  { brand: "Daikin", match: (_, __, m) => m.includes("Stylish"), image: "/products/daikin-stylish.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Emura"), image: "/products/daikin-emura.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Perfera Vloer"), image: "/products/daikin-perfera-vloer.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Perfera"), image: "/products/daikin-perfera.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Ururu"), image: "/products/daikin-ururu-sarara.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Comfora"), image: "/products/daikin-comfora.jpg" },

  // === LG (from klimaat-shop.nl) ===
  { brand: "LG", match: () => true, image: "/products/lg-wand.jpg" },

  // === MITSUBISHI HEAVY (from airco-kopen.nu + mhinederland.nl) ===
  { brand: "Mitsubishi Heavy", match: (d, t) => t === "Wand" && d.includes("Diamond"), image: "/products/mitsubishi-heavy-wand.png" },
  { brand: "Mitsubishi Heavy", match: (d, t) => t === "Wand" && d.includes("Premium"), image: "/products/mitsubishi-heavy-premium.jpg" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Wand", image: "/products/mitsubishi-heavy-wand.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Vloer", image: "/products/gree-vloerplafond.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Kanaal", image: "/products/gree-kanaal.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Buitenunit", image: "/products/gree-buitenunit.png" },

  // === MITSUBISHI ELECTRIC (from les.mitsubishielectric.co.uk) ===
  { brand: "Mitsubishi Electric", match: (_, __, m) => m.includes("MSZ-LN"), image: "/products/mitsubishi-electric-msz-ln.png" },
  { brand: "Mitsubishi Electric", match: (_, __, m) => m.includes("MSZ-EF"), image: "/products/mitsubishi-electric-msz-ln.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Wand", image: "/products/mitsubishi-electric-msz-ap.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Cassette", image: "/products/gree-cassette.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Vloer", image: "/products/gree-vloerplafond.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Buitenunit", image: "/products/gree-buitenunit.png" },

  // === MITSUI (from archiexpo.com) ===
  { brand: "Mitsui", match: (_, t) => t === "Wand", image: "/products/mitsui-wand.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Cassette", image: "/products/mitsui-commercieel.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Kanaal", image: "/products/mitsui-commercieel.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Vloer/Plafond", image: "/products/mitsui-commercieel.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Console", image: "/products/mitsui-commercieel.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Kolom", image: "/products/mitsui-commercieel.jpg" },
  // Mitsui fallback
  { brand: "Mitsui", match: () => true, image: "/products/mitsui-wand.jpg" },
];

async function main() {
  const allModels = await prisma.aircoModel.findMany();
  console.log(`Updating images for ${allModels.length} models...`);

  let updated = 0;
  for (const m of allModels) {
    const desc = m.description || "";
    const rule = IMAGE_RULES.find((r) => r.brand === m.brand && r.match(desc, m.type, m.model));
    if (rule) {
      await prisma.aircoModel.update({
        where: { id: m.id },
        data: { imageUrl: rule.image },
      });
      updated++;
    }
  }

  console.log(`Done: ${updated} models updated with images`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
