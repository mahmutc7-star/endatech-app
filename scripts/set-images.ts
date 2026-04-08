import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Map: brand + description keywords -> image path
const IMAGE_RULES: { brand: string; match: (desc: string, type: string, model: string) => boolean; image: string }[] = [
  // === GREE (from greebelgium.be + aircobeurs.nl) ===
  { brand: "Gree", match: (d, t) => d.includes("Fairy") && t === "Wand" && d.includes("antraciet"), image: "/products/gree-fairy-antraciet.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Fairy") && t === "Wand" && d.includes("zilver"), image: "/products/gree-fairy-zilver.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Fairy") && t === "Wand", image: "/products/gree-fairy.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Clivia") && t === "Wand" && d.includes("antraciet"), image: "/products/gree-clivia-antraciet.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Clivia") && t === "Wand" && d.includes("zilver"), image: "/products/gree-clivia-zilver.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Clivia") && t === "Wand", image: "/products/gree-clivia-wit.jpg" },
  { brand: "Gree", match: (d, t) => d.includes("Airy") && t === "Wand" && d.includes("antraciet"), image: "/products/gree-airy-antraciet.png" },
  { brand: "Gree", match: (d, t) => d.includes("Airy") && t === "Wand" && d.includes("zilver"), image: "/products/gree-airy-zilver.webp" },
  { brand: "Gree", match: (d, t) => d.includes("Airy") && t === "Wand", image: "/products/gree-airy.png" },
  { brand: "Gree", match: (d, t) => d.includes("Charmo") && t === "Wand", image: "/products/gree-charmo.png" },
  { brand: "Gree", match: (_, t) => t === "Console", image: "/products/gree-console.jpg" },
  { brand: "Gree", match: (_, t) => t === "Cassette", image: "/products/gree-cassette.jpg" },
  { brand: "Gree", match: (_, t) => t === "Kanaal", image: "/products/gree-kanaal.png" },
  { brand: "Gree", match: (_, t) => t === "Vloer & Plafond", image: "/products/gree-console.jpg" },
  { brand: "Gree", match: (_, t) => t === "Buitenunit", image: "/products/gree-buitenunit.jpg" },
  { brand: "Gree", match: (_, t) => t === "Dakairco", image: "/products/gree-dakairco.jpg" },
  // Fallback Gree wand
  { brand: "Gree", match: (_, t) => t === "Wand", image: "/products/gree-fairy.jpg" },

  // === DAIKIN (from daikin-ce.com official DAM packshots 1280px) ===
  { brand: "Daikin", match: (d) => d.includes("Stylish") && d.includes("Kleur: zwart hout"), image: "/products/daikin-stylish-zwarthout.jpg" },
  { brand: "Daikin", match: (d) => d.includes("Stylish") && d.includes("Kleur: zwart"), image: "/products/daikin-stylish-zwart.jpg" },
  { brand: "Daikin", match: (d) => d.includes("Stylish") && d.includes("Kleur: zilver"), image: "/products/daikin-stylish-zilver.jpg" },
  { brand: "Daikin", match: (d) => d.includes("Stylish"), image: "/products/daikin-stylish.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Emura"), image: "/products/daikin-emura.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Perfera Vloer"), image: "/products/daikin-perfera-vloer.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Perfera"), image: "/products/daikin-perfera.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Ururu"), image: "/products/daikin-ururu-sarara.jpg" },
  { brand: "Daikin", match: (_, __, m) => m.includes("Comfora"), image: "/products/daikin-comfora.jpg" },

  // === LG (from lgklimaat.nl + chillair.nl) ===
  { brand: "LG", match: (d) => d.includes("ARTCOOL Gallery"), image: "/products/lg-gallery.jpg" },
  { brand: "LG", match: (d) => d.includes("DUALCOOL Deluxe"), image: "/products/lg-deluxe.jpg" },
  { brand: "LG", match: (d) => d.includes("DUALCOOL Premium+"), image: "/products/lg-premiumplus.jpg" },
  { brand: "LG", match: (d) => d.includes("DUALCOOL Premium"), image: "/products/lg-premium.jpg" },
  { brand: "LG", match: () => true, image: "/products/lg-wand.jpg" },

  // === MITSUBISHI HEAVY (from mhi-mth.co.jp official) ===
  { brand: "Mitsubishi Heavy", match: (d, t) => t === "Wand" && d.includes("SRK-ZSX"), image: "/products/mhi-zsx.png" },
  { brand: "Mitsubishi Heavy", match: (d, t) => t === "Wand" && d.includes("SRK-ZR"), image: "/products/mhi-zr.png" },
  { brand: "Mitsubishi Heavy", match: (d, t) => t === "Wand" && d.includes("SRK-ZS"), image: "/products/mhi-zs.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Wand", image: "/products/mhi-zs.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Vloer & Plafond", image: "/products/mhi-srf.png" },
  { brand: "Mitsubishi Heavy", match: (_, t) => t === "Buitenunit", image: "/products/mhi-scm.png" },

  // === MITSUBISHI ELECTRIC (from les.mitsubishielectric.co.uk official) ===
  { brand: "Mitsubishi Electric", match: (_, __, m) => m.includes("MSZ-LN"), image: "/products/me-msz-ln.png" },
  { brand: "Mitsubishi Electric", match: (_, __, m) => m.includes("MSZ-EF"), image: "/products/me-msz-ef.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Wand", image: "/products/me-msz-ap.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Cassette", image: "/products/mitsubishi-electric-cassette.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Vloer & Plafond", image: "/products/me-mfz-kt.png" },
  { brand: "Mitsubishi Electric", match: (d) => d.includes("PUMY"), image: "/products/me-pumy.png" },
  { brand: "Mitsubishi Electric", match: (_, t) => t === "Buitenunit", image: "/products/me-mxz.png" },

  // === MITSUI (from goedkoopaircos.nl + technim.nl + solardeal.nl) ===
  { brand: "Mitsui", match: (d, t) => t === "Wand" && d.includes("CDX Dynamic"), image: "/products/mitsui-cdx.jpg" },
  { brand: "Mitsui", match: (d, t) => t === "Wand" && d.includes("ZDX Dynamic"), image: "/products/mitsui-zdx.jpg" },
  { brand: "Mitsui", match: (d, t) => t === "Wand" && d.includes("MTX Trend"), image: "/products/mitsui-wand.png" },
  { brand: "Mitsui", match: (d, t) => t === "Wand" && d.includes("Monobloc"), image: "/products/mitsui-wand.png" },
  { brand: "Mitsui", match: (_, t) => t === "Wand", image: "/products/mitsui-wand.png" },
  { brand: "Mitsui", match: (_, t) => t === "Cassette", image: "/products/mitsui-commercieel.jpg" },
  { brand: "Mitsui", match: (_, t) => t === "Vloer & Plafond", image: "/products/mitsui-commercieel.jpg" },
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
