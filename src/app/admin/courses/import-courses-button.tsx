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
        { key: "modeOfStudy", label: "Mode of Study (FT / PT / E-learning)" },
        { key: "level", label: "Academic Level" },
        { key: "duration", label: "Duration" },
        { key: "intakes", label: "Intake Dates (Separate multiple with ; )" },
        { key: "applicationFee", label: "App Fee ($)" },
        { key: "status", label: "Status" },
      ]}
      sampleRows={[
        {
          name: "Bachelor of Science (Honours) Artificial Intelligence",
          schoolName: "KU",
          modeOfStudy: "FT / PT",
          level: "Undergraduate",
          duration: "3 Years",
          intakes: "January 2026; May 2026; September 2026",
          applicationFee: "160.00",
          status: "Active"
        },
        {
          name: "Master of Business Administration (MBA)",
          schoolName: "GCU",
          modeOfStudy: "FT / PT",
          level: "Postgraduate",
          duration: "1 Year",
          intakes: "January 2026; September 2026",
          applicationFee: "320.00",
          status: "Active"
        },
        {
          name: "Diploma in Business Management (E-learning)",
          schoolName: "EGA",
          modeOfStudy: "E-learning",
          level: "Diploma",
          duration: "2 Years",
          intakes: "January 2026; March 2026; July 2026; October 2026",
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
