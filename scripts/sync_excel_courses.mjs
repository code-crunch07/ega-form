import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const partnerMap = {
  "EGA": "Educare Global Academy",
  "NCC": "NCC Education",
  "GCU": "Glasgow Caledonian University",
  "KU": "Kingston University"
};

const coursesData = [
  // --- Preparatory & Foundation ---
  { name: "Admission Exercise for International Students (3-month)", partner: "EGA", mode: "FT", level: "Preparatory", intakes: [] },
  { name: "Admission Exercise for International Students (6-month)", partner: "EGA", mode: "FT", level: "Preparatory", intakes: [] },
  { name: "Certificate of English - Beginners", partner: "EGA", mode: "FT", level: "Preparatory", intakes: [] },
  { name: "Certificate of English - Intermediate", partner: "EGA", mode: "FT", level: "Preparatory", intakes: [] },
  { name: "Certificate of English - Advanced", partner: "EGA", mode: "FT", level: "Preparatory", intakes: [] },
  { name: "Certificate Course in Pre-Foundation Studies", partner: "EGA", mode: "FT", level: "Preparatory", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "Foundation Course in Management", partner: "EGA", mode: "FT / PT", level: "Foundation", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "Foundation Course in Management (E-learning)", partner: "EGA", mode: "E-learning", level: "Foundation", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "Foundation Course in Hotel and Tourism Management", partner: "EGA", mode: "FT / PT", level: "Foundation", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "NCC Education Level 3 Foundation Diploma for Higher Education Studies", partner: "NCC", mode: "FT", level: "Foundation", intakes: ["16-Nov-26"] },

  // --- Diploma ---
  { name: "Diploma in Business Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Business Management (E-learning)", partner: "EGA", mode: "E-learning", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Management Studies", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Accounting and Finance", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in International Hotel and Tourism Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Culinary Arts and Pastry Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "Higher Diploma in Computing", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Higher Diploma in International Hospitality Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Higher Diploma in Business Entrepreneurship", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Higher Diploma in Low-Altitude Economy and UAV Technology", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Applied Artificial Intelligence", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Diploma in Logistics and Supply Chain Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "NCC Education Level 4 Diploma in Computing", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },
  { name: "NCC Education Level 4 Diploma in Computing (with Business)", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },
  { name: "NCC Education Level 4 Diploma in Business", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },

  // --- Advanced Diploma ---
  { name: "Advanced Diploma in International Hotel and Tourism Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Business Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Business Management (E-learning)", partner: "EGA", mode: "E-learning", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Culinary Arts and Bakery Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "15-Feb-27", "10-May-27", "10-Aug-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Applied Artificial Intelligence", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Computer Science", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Accounting and Finance", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "Advanced Diploma in Logistics and Supply Chain Management", partner: "EGA", mode: "FT / PT", level: "Diploma", intakes: ["16-Nov-26", "11-Jan-27", "15-Mar-27", "10-May-27", "12-Jul-27", "6-Sep-27", "15-Nov-27"] },
  { name: "NCC Education Level 5 Diploma in Computing", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },
  { name: "NCC Education Level 5 Diploma in Computing (with Business)", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },
  { name: "NCC Education Level 5 Diploma in Business", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },
  { name: "NCC Education Level 5 Diploma in Computing (with Cyber Security)", partner: "NCC", mode: "FT", level: "Diploma", intakes: ["16-Nov-26"] },

  // --- Undergraduate ---
  { name: "Bachelor of Arts (Honours) International Tourism and Events Management (Honours)", partner: "GCU", mode: "FT / PT", level: "Undergraduate", intakes: ["14-Sep-26"] },
  { name: "Bachelor of Arts (Honours) Business Management (Honours)", partner: "GCU", mode: "FT / PT", level: "Undergraduate", intakes: ["14-Sep-26"] },
  { name: "Bachelor of Science (Honours) Artificial Intelligence and Data Science (Top-up)", partner: "GCU", mode: "FT / PT", level: "Undergraduate", intakes: ["14-Sep-26"] },
  { name: "Bachelor of Science (Honours) Computer Science (E-learning)", partner: "KU", mode: "E-learning", level: "Undergraduate", intakes: ["5-Oct-26"] },

  // --- Postgraduate ---
  { name: "Postgraduate Diploma in Business Management", partner: "EGA", mode: "FT / PT", level: "Postgraduate", intakes: ["16-Nov-26"] },
  { name: "Postgraduate Diploma in Business Management (E-learning)", partner: "EGA", mode: "E-learning", level: "Postgraduate", intakes: ["16-Nov-26"] },
  { name: "NCC Education Pre-Masters in Business", partner: "NCC", mode: "FT", level: "Postgraduate", intakes: ["16-Nov-26"] },
  { name: "Master of Science Environmental Management (Energy)", partner: "KU", mode: "FT / PT", level: "Postgraduate", intakes: ["5-Oct-26"] },
  { name: "Master of Science Artificial Intelligence", partner: "KU", mode: "FT / PT", level: "Postgraduate", intakes: ["5-Oct-26"] },
  { name: "Master of Business Administration", partner: "GCU", mode: "FT / PT", level: "Postgraduate", intakes: ["14-Sep-26"] },
  { name: "Master of Business Administration (Moncordia)", partner: "GCU", mode: "FT / PT", level: "Postgraduate", intakes: ["14-Sep-26"] }
];

async function main() {
  console.log("Connecting to database to auto-seed spreadsheet data...");

  // 1. Ensure Schools exist
  const schoolIdMap = {};
  for (const [code, fullName] of Object.entries(partnerMap)) {
    const res = await pool.query(
      `INSERT INTO "School" ("id", "name", "description", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT ("name") DO UPDATE SET "updatedAt" = NOW()
       RETURNING "id", "name"`,
      [`school_${code.toLowerCase()}`, fullName, `${fullName} partner institution`]
    );
    schoolIdMap[code] = res.rows[0].id;
  }
  console.log("Partner schools synced:", schoolIdMap);

  // 2. Collect unique Intakes across all courses and insert them
  const allIntakesSet = new Set();
  coursesData.forEach(c => c.intakes.forEach(i => allIntakesSet.add(i)));
  
  for (const intakeDate of allIntakesSet) {
    const intakeName = `${intakeDate} Intake`;
    const check = await pool.query(`SELECT "id" FROM "Intake" WHERE "name" = $1 LIMIT 1`, [intakeName]);
    if (check.rows.length === 0) {
      await pool.query(
        `INSERT INTO "Intake" ("id", "name", "status", "openDate", "closeDate", "createdAt", "updatedAt")
         VALUES ($1, $2, 'Open', NOW(), NOW() + interval '90 days', NOW(), NOW())`,
        [`intake_${intakeDate.replace(/[^a-zA-Z0-9]/g, '_')}`, intakeName]
      );
    }
  }
  console.log(`Created ${allIntakesSet.size} unique intake sessions.`);

  // 3. Insert or update all 48 courses
  let courseCount = 0;
  for (let idx = 0; idx < coursesData.length; idx++) {
    const c = coursesData[idx];
    const code = `${c.partner}-${c.level.substring(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, '0')}`;
    const schoolId = schoolIdMap[c.partner] || schoolIdMap["EGA"];
    const duration = c.level === "Preparatory" ? "6 Months" : c.level === "Foundation" ? "1 Year" : c.level === "Diploma" ? "2 Years" : c.level === "Undergraduate" ? "3 Years" : "1.5 Years";
    const credits = c.level === "Postgraduate" ? 180 : c.level === "Undergraduate" ? 120 : 80;
    const applicationFee = c.level === "Postgraduate" ? 320.0 : 160.0;

    await pool.query(
      `INSERT INTO "Programme" ("id", "code", "name", "schoolId", "level", "duration", "credits", "applicationFee", "status", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', NOW(), NOW())
       ON CONFLICT ("code") DO UPDATE SET 
         "name" = EXCLUDED."name",
         "schoolId" = EXCLUDED."schoolId",
         "level" = EXCLUDED."level",
         "duration" = EXCLUDED."duration",
         "credits" = EXCLUDED."credits",
         "applicationFee" = EXCLUDED."applicationFee",
         "status" = 'Active',
         "updatedAt" = NOW()`,
      [`prog_${idx + 1}`, code, c.name, schoolId, c.level, duration, credits, applicationFee]
    );
    courseCount++;
  }

  console.log(`Successfully synced all ${courseCount} courses from Excel sheet!`);
  await pool.end();
}

main().catch(console.error);
