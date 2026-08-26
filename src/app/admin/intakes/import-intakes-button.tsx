"use client";

import { ImportCsvDialog } from "@/components/admin/import-csv-dialog";
import { bulkImportIntakes } from "@/app/actions/admin";

export function ImportIntakesButton() {
  return (
    <ImportCsvDialog
      title="Bulk Import Intakes & Cohort Dates"
      description="Upload a CSV spreadsheet to import multiple intake cohorts and application deadlines at once."
      templateFileName="intakes_import_template.csv"
      columns={[
        { key: "name", label: "Intake Name (e.g. January 2026)", required: true },
        { key: "openDate", label: "Opening Date (YYYY-MM-DD)", required: true },
        { key: "closeDate", label: "Closing / Deadline Date (YYYY-MM-DD)", required: true },
        { key: "capacity", label: "Capacity (Number or blank for Unlimited)" },
        { key: "status", label: "Status (Open / Upcoming / Closed)" },
      ]}
      sampleRows={[
        {
          name: "January 2026",
          openDate: "2026-01-05",
          closeDate: "2026-02-28",
          capacity: "120",
          status: "Open"
        },
        {
          name: "March 2026 (Mid-Spring)",
          openDate: "2026-02-15",
          closeDate: "2026-04-15",
          capacity: "80",
          status: "Upcoming"
        },
        {
          name: "May 2026",
          openDate: "2026-04-01",
          closeDate: "2026-06-30",
          capacity: "150",
          status: "Upcoming"
        },
        {
          name: "September 2026 (Fall Main)",
          openDate: "2026-07-01",
          closeDate: "2026-09-30",
          capacity: "200",
          status: "Upcoming"
        }
      ]}
      onImport={async (rows) => {
        return await bulkImportIntakes(rows);
      }}
    />
  );
}
