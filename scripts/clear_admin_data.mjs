import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clearData() {
  console.log("Starting clean wipe of admin operational data...");

  // Delete child records first to respect foreign keys
  await pool.query(`DELETE FROM "Payment"`);
  await pool.query(`DELETE FROM "Refund"`);
  await pool.query(`DELETE FROM "Interview"`);
  await pool.query(`DELETE FROM "Offer"`);
  await pool.query(`DELETE FROM "Document"`);
  await pool.query(`DELETE FROM "Application"`);
  console.log("Cleared test applications, documents, payments, interviews, and offers.");

  // Delete programmes, intakes, schools, agents, fees
  await pool.query(`DELETE FROM "Programme"`);
  await pool.query(`DELETE FROM "Intake"`);
  await pool.query(`DELETE FROM "School"`);
  await pool.query(`DELETE FROM "Agent"`);
  await pool.query(`DELETE FROM "Fee"`);
  console.log("Cleared all courses (programmes), intakes, schools, agents, and fee settings.");

  console.log("Admin accounts and system configuration settings have been preserved.");
  await pool.end();
}

clearData().catch(console.error);
