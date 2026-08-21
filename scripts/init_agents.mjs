import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Agent" (
      "id" TEXT PRIMARY KEY,
      "agencyName" TEXT NOT NULL,
      "contactPerson" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "phone" TEXT,
      "country" TEXT NOT NULL DEFAULT 'Singapore',
      "city" TEXT,
      "commissionRate" DOUBLE PRECISION DEFAULT 10.0,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Agent table ready!");
  
  // Seed sample initial agents if table is empty
  const countRes = await pool.query('SELECT count(*) FROM "Agent"');
  if (parseInt(countRes.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO "Agent" ("id", "agencyName", "contactPerson", "email", "phone", "country", "city", "commissionRate", "status", "notes")
      VALUES 
        ('agent_1', 'Apex Global Education', 'David Lim', 'david@apexeducation.sg', '+65 6789 0123', 'Singapore', 'Singapore', 12.5, 'Active', 'Tier-1 accredited recruitment partner'),
        ('agent_2', 'EduBridge Overseas Pathways', 'Sarah Tan', 'sarah.tan@edubridge.my', '+60 3 2145 8899', 'Malaysia', 'Kuala Lumpur', 10.0, 'Active', 'Specializes in Foundation and Diploma placements'),
        ('agent_3', 'IndoGlobal University Services', 'Budi Santoso', 'budi@indoglobal.id', '+62 21 5566 7788', 'Indonesia', 'Jakarta', 15.0, 'Active', 'Official Southeast Asia student recruitment hub'),
        ('agent_4', 'Global Link Educational Consultancy', 'Mei Ling Wang', 'meiling@globallink.cn', '+86 21 8899 0011', 'China', 'Shanghai', 10.0, 'Active', 'Top performing partner for Business & IT degrees'),
        ('agent_5', 'Vietnam Elite Student Services', 'Nguyen Van Minh', 'minh.nguyen@vnelite.vn', '+84 28 3939 4040', 'Vietnam', 'Ho Chi Minh City', 12.0, 'Active', 'Active across hospitality and management intakes')
    `);
    console.log("Seeded initial partner recruitment agencies!");
  }
  await pool.end();
}

main().catch(console.error);
