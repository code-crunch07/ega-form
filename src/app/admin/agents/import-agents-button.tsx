"use client";

import { ImportCsvDialog } from "@/components/admin/import-csv-dialog";
import { bulkImportAgents } from "@/app/actions/admin";

export function ImportAgentsButton() {
  return (
    <ImportCsvDialog
      title="Bulk Import Recruitment Agencies"
      description="Upload a CSV spreadsheet to import multiple authorized recruitment agents and counsellors."
      templateFileName="agents_import_template.csv"
      columns={[
        { key: "agencyName", label: "Agency Name", required: true },
        { key: "contactPerson", label: "Contact Person / Counsellor", required: true },
        { key: "email", label: "Email Address", required: true },
        { key: "phone", label: "Phone" },
        { key: "country", label: "Country" },
        { key: "city", label: "City" },
        { key: "commissionRate", label: "Commission %" },
        { key: "status", label: "Status" },
        { key: "notes", label: "Notes" },
      ]}
      sampleRows={[
        {
          agencyName: "Apex Global Education Services",
          contactPerson: "David Lim",
          email: "david@apexeducation.sg",
          phone: "+65 6789 0123",
          country: "Singapore",
          city: "Singapore",
          commissionRate: "12.5",
          status: "Active",
          notes: "Tier-1 accredited recruitment partner"
        },
        {
          agencyName: "EduBridge Overseas Pathways",
          contactPerson: "Sarah Tan",
          email: "sarah.tan@edubridge.my",
          phone: "+60 3 2145 8899",
          country: "Malaysia",
          city: "Kuala Lumpur",
          commissionRate: "10.0",
          status: "Active",
          notes: "Specializes in Diploma and Foundation enrollments"
        }
      ]}
      onImport={async (rows) => {
        return await bulkImportAgents(rows);
      }}
    />
  );
}
