import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    include: {
      application: {
        include: {
          user: {
            include: { profile: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

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
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                  No documents found in the database.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => {
                const applicantName = doc.application?.user?.profile 
                  ? `${doc.application.user.profile.firstName || ''} ${doc.application.user.profile.lastName || ''}`.trim()
                  : doc.application?.user?.name || "Unknown";

                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-bold">{applicantName}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                        <FileText size={14} /> {doc.filename || "document.pdf"}
                      </a>
                    </TableCell>
                    <TableCell className="text-neutral-500">{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Approved</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-neutral-400 text-xs mr-4">Verified</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
