import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addModeOfStudy() {
  await pool.query(`
    ALTER TABLE "Programme" 
    ADD COLUMN IF NOT EXISTS "modeOfStudy" TEXT DEFAULT 'Full Time / Part Time';
  `);
  console.log("modeOfStudy column added to Programme table!");
  await pool.end();
}

addModeOfStudy().catch(console.error);
