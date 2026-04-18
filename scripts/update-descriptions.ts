import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Product data from fabrikant JSON
const PRODUCTS = [
  { model_code: "GWH09AVCXB-K6DNA1B", brand: "Gree", short: "Wand airco voor ruimtes tot ±20–30 m² met 2.7 kW koelvermogen.", long: "De Gree Airy GWH09AVCXB-K6DNA1B is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 20–30 m².\nMet een koelvermogen van 2.7 kW en een verwarmingscapaciteit van 3 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuinig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Airy-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "9000" },
  { model_code: "GWH12AVCXD-K6DNA1A", brand: "Gree", short: "Wand airco voor ruimtes tot ±30–50 m² met 3.5 kW koelvermogen.", long: "De Gree Airy GWH12AVCXD-K6DNA1A is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 30–50 m².\nMet een koelvermogen van 3.5 kW en een verwarmingscapaciteit van 3.8 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuinig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Airy-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "12000" },
  { model_code: "GWH18AVDXE-K6DNA1A", brand: "Gree", short: "Wand airco voor ruimtes tot ±50–70 m² met 5.3 kW koelvermogen.", long: "De Gree Airy GWH18AVDXE-K6DNA1A is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 50–70 m².\nMet een koelvermogen van 5.3 kW en een verwarmingscapaciteit van 5.6 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuinig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Airy-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "18000" },
  { model_code: "GWH09ATAXB-K6DNA1B", brand: "Gree", short: "Wand airco voor ruimtes tot ±20–30 m² met 2.5 kW koelvermogen.", long: "De Gree Charmo GWH09ATAXB-K6DNA1B is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 20–30 m².\nMet een koelvermogen van 2.5 kW en een verwarmingscapaciteit van 2.8 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuinig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Charmo-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "9000" },
  { model_code: "GWH12ATAXB-K6DNA1D", brand: "Gree", short: "Wand airco voor ruimtes tot ±30–50 m² met 3.2 kW koelvermogen.", long: "De Gree Charmo GWH12ATAXB-K6DNA1D is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 30–50 m².\nMet een koelvermogen van 3.2 kW en een verwarmingscapaciteit van 3.4 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuunig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Charmo-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "12000" },
  { model_code: "GWH18ATAXB-K6DNA1A", brand: "Gree", short: "Wand airco voor ruimtes tot ±50–70 m² met 4.6 kW koelvermogen.", long: "De Gree Charmo GWH18ATAXB-K6DNA1A is een Single Split wand airconditioner die ideaal is voor ruimtes tot circa 50–70 m².\nMet een koelvermogen van 4.6 kW en een verwarmingscapaciteit van 5.3 kW biedt dit systeem het hele jaar door optimaal comfort.\n\nDankzij moderne invertertechnologie werkt deze airco energiezuunig en stil, wat hem geschikt maakt voor zowel woningen als kantoren.\nDe Charmo-serie van Gree staat bekend om zijn betrouwbare prestaties, gebruiksvriendelijkheid en moderne design.", btu: "18000" },
];

async function main() {
  console.log("Updating product descriptions from fabrikant data...");

  let updated = 0;
  let notFound = 0;

  for (const p of PRODUCTS) {
    // Find by model containing the model_code
    const models = await prisma.aircoModel.findMany({
      where: { brand: p.brand, model: { contains: p.model_code.substring(0, 15) } }
    });

    if (models.length === 0) {
      console.log("  NOT FOUND: " + p.brand + " " + p.model_code);
      notFound++;
      continue;
    }

    // For now just log what we'd update
    for (const m of models) {
      console.log("  MATCH: " + m.model + " -> " + p.short.substring(0, 50) + "...");
      updated++;
    }
  }

  console.log("\nMatched: " + updated + ", Not found: " + notFound);
  console.log("\nNote: This is a dry run. The actual update will use the long_description on the product detail page.");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
