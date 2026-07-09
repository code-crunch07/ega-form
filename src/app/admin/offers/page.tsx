import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileSignature, FilePlus2 } from "lucide-react";

import { GenerateOfferDialog } from "./generate-offer-dialog";

export default async function AdminOffersPage() {
  const [offers, applications] = await Promise.all([
    prisma.offer.findMany({
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
    }),
    prisma.application.findMany({
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const applicationOptions = applications.map(app => ({
    id: app.id,
    appNumber: app.appNumber,
    applicantName: app.user?.profile 
      ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
      : app.user?.name || "Unknown"
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Generate, issue, and track admission offers.</p>
        </div>
        <GenerateOfferDialog applications={applicationOptions} />
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>Applicant</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Offer Type</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                  No offers found in the database.
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => {
                const applicantName = offer.application?.user?.profile 
                  ? `${offer.application.user.profile.firstName || ''} ${offer.application.user.profile.lastName || ''}`.trim()
                  : offer.application?.user?.name || "Unknown";
                  
                const programmeName = offer.application?.programmeId || "Not Selected"; // fallback

                return (
                  <TableRow key={offer.id}>
                    <TableCell className="font-bold">{applicantName}</TableCell>
                    <TableCell>{programmeName}</TableCell>
                    <TableCell>
                      {offer.type === "Unconditional" && <span className="text-green-600 font-medium">Unconditional Offer</span>}
                      {offer.type === "Conditional" && <span className="text-blue-600 font-medium">Conditional Offer</span>}
                      {offer.type === "Rejection" && <span className="text-red-600 font-medium">Rejection Letter</span>}
                      {(!offer.type || !["Unconditional", "Conditional", "Rejection"].includes(offer.type)) && <span>{offer.type}</span>}
                    </TableCell>
                    <TableCell className="text-neutral-500">{offer.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {offer.status === "Accepted" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Accepted</Badge>}
                      {offer.status === "Issued" && <Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">Pending Reply</Badge>}
                      {offer.status === "Declined" && <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-none">Declined</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {offer.documentUrl ? (
                          <a href={offer.documentUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-8 text-neutral-500 gap-2"><FileSignature size={14} /> PDF</Button>
                          </a>
                        ) : (
                          <span className="text-neutral-400 text-xs mt-2 mr-2">No Doc</span>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 text-neutral-500 gap-2"><Mail size={14} /> Resend</Button>
                      </div>
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
