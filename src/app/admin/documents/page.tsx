import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle } from "lucide-react";

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Verification</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Review and verify applicant uploaded documents.</p>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>Applicant</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { applicant: "Jane Doe", type: "Passport", file: "passport_scan.pdf", date: "Jul 7, 2026", status: "Needs Review" },
              { applicant: "John Smith", type: "Academic Transcript", file: "BSc_Transcript.pdf", date: "Jul 6, 2026", status: "Needs Review" },
              { applicant: "Alice Johnson", type: "IELTS Certificate", file: "IELTS_results.jpg", date: "Jul 5, 2026", status: "Approved" },
            ].map((doc, i) => (
              <TableRow key={i}>
                <TableCell className="font-bold">{doc.applicant}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                    <FileText size={14} /> {doc.file}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-500">{doc.date}</TableCell>
                <TableCell>
                  {doc.status === "Approved" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800">Needs Review</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {doc.status === "Needs Review" ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-green-600 border-green-200 hover:bg-green-50"><CheckCircle size={14} className="mr-1"/> Approve</Button>
                      <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50"><XCircle size={14} className="mr-1"/> Reject</Button>
                    </div>
                  ) : (
                    <span className="text-neutral-400 text-xs mr-4">Verified</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
