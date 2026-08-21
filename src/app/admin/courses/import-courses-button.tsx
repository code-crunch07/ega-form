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
        { key: "code", label: "Course Code", required: true },
        { key: "name", label: "Course Title", required: true },
        { key: "schoolName", label: "School / Faculty" },
        { key: "level", label: "Study Level" },
        { key: "duration", label: "Duration" },
        { key: "credits", label: "Credits" },
        { key: "applicationFee", label: "App Fee ($)" },
        { key: "status", label: "Status" },
      ]}
      sampleRows={[
        {
          code: "BCS-101",
          name: "BSc (Hons) Computer Science",
          schoolName: "Kingston University",
          level: "Undergraduate / Bachelor's Degree",
          duration: "3 Years",
          credits: "120",
          applicationFee: "160.00",
          status: "Active"
        },
        {
          code: "MBA-201",
          name: "Master of Business Administration (MBA)",
          schoolName: "Glasgow Caledonian University",
          level: "Postgraduate / Master's Degree",
          duration: "1 Year",
          credits: "180",
          applicationFee: "320.00",
          status: "Active"
        },
        {
          code: "DHM-301",
          name: "Diploma in International Hotel and Tourism Management",
          schoolName: "Educare Global Academy",
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
