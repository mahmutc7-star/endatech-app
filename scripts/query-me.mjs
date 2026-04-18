import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const r = await pool.query(`SELECT id, model, brand, type, "coolingCapacity", "heatingCapacity", "energyLabel", price, "installationPrice", description, "shortDescription", "longDescription", "imageUrl", active FROM "AircoModel" WHERE brand LIKE '%Mitsubishi Electric%' AND model IN ('MSZ-EF', 'MSZ-LN') ORDER BY model`);
r.rows.forEach(x => console.log(JSON.stringify(x)));
await pool.end();
