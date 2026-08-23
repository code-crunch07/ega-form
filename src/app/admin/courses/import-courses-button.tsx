"use client";

import { ImportCsvDialog } from "@/components/admin/import-csv-dialog";
import { bulkImportCourses } from "@/app/actions/admin";

export function ImportCoursesButton() {
  return (
    <ImportCsvDialog
      title="Bulk Import Courses / Programmes"
      description="Upload a CSV spreadsheet to import multiple academic programmes at once."
      templateFileName="courses_import_template.csv"
      columns={[
        { key: "name", label: "Course Title", required: true },
        { key: "schoolName", label: "University Partner (EGA/NCC/GCU/KU)" },
        { key: "level", label: "Academic Level" },
        { key: "duration", label: "Duration" },
        { key: "credits", label: "Credits" },
        { key: "applicationFee", label: "App Fee ($)" },
        { key: "status", label: "Status" },
      ]}
      sampleRows={[
        {
          name: "Bachelor of Science (Honours) Artificial Intelligence",
          schoolName: "KU",
          level: "Undergraduate",
          duration: "3 Years",
          credits: "120",
          applicationFee: "160.00",
          status: "Active"
        },
        {
          name: "Master of Business Administration (MBA)",
          schoolName: "GCU",
          level: "Postgraduate",
          duration: "1 Year",
          credits: "180",
          applicationFee: "320.00",
          status: "Active"
        },
        {
          name: "Diploma in Business Management",
          schoolName: "EGA",
          level: "Diploma",
          duration: "2 Years",
          credits: "80",
          applicationFee: "160.00",
          status: "Active"
        }
      ]}
      onImport={async (rows) => {
        return await bulkImportCourses(rows);
      }}
    />
  );
}
