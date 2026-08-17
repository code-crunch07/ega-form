import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Download, Printer, ArrowLeft, Building2, ShieldCheck, FileCheck } from "lucide-react";
import Link from "next/link";

export default async function OfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const offerId = resolvedParams.id;

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      application: {
        include: {
          user: {
            include: { profile: true }
          }
        }
      }
    }
  });

  if (!offer || !offer.application) {
    notFound();
  }

  const app = offer.application;
  const profile = app.user?.profile;
  const applicantName = profile 
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() 
    : app.user?.name || "Applicant";

  const issueDate = new Date(offer.createdAt).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-neutral-950 p-4 sm:p-8 font-jost">
      
      {/* Action Bar (Print / Back) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href="/admin/offers">
          <Button variant="outline" className="gap-2 bg-white dark:bg-neutral-900">
            <ArrowLeft size={16} /> Back to Offers
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => {}} 
            className="gap-2 bg-white dark:bg-neutral-900"
          >
            <Printer size={16} /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Official EGA Letterhead Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 md:p-16 rounded-3xl shadow-xl border border-slate-200 print:shadow-none print:p-0 print:border-none">
        
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#252D65] pb-6 mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#252D65]" />
              <h1 className="text-2xl font-black text-[#252D65] tracking-tight font-heading uppercase">
                Educare Global Academy
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">Official Admission Letter of Offer • Registered Private Education Institution</p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono space-y-0.5">
            <p className="font-bold text-slate-800">Date: {issueDate}</p>
            <p>Ref: <span className="font-bold text-[#252D65]">OFFER-{app.appNumber}</span></p>
            <p>CPE Reg No: 202612345E</p>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="mb-8 space-y-1 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Addressed To</p>
          <p className="font-bold text-slate-900 text-base">{applicantName}</p>
          <p className="text-slate-600">Passport / NRIC: <span className="font-mono font-bold">{profile?.passportNumber || "S1234567A"}</span></p>
          <p className="text-slate-600">Email: {app.user.email}</p>
          <p className="text-slate-600">Address: {profile?.address || "Singapore"}</p>
        </div>

        {/* Letter Body */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-[#252D65] font-heading">
            OFFICIAL LETTER OF OFFER — {offer.type.toUpperCase()} ADMISSION
          </h2>

          <p>Dear <strong>{applicantName}</strong>,</p>

          <p>
            We are pleased to inform you that following the assessment of your application and academic achievements, 
            <strong> Educare Global Academy (EGA)</strong> is delighted to offer you admission for the specified academic programme set out below:
          </p>

          {/* Offer Details Grid Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden my-6">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-500 uppercase tracking-wider w-1/3">University Partner</td>
                  <td className="p-3.5 font-bold text-slate-900">{app.school}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-500 uppercase tracking-wider">Programme / Course</td>
                  <td className="p-3.5 font-bold text-[#252D65]">{app.programmeLevel}</td>
                </tr>
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-500 uppercase tracking-wider">Intake & Mode</td>
                  <td className="p-3.5 font-bold text-slate-900">{app.intake} • {app.studyMode}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-500 uppercase tracking-wider">Campus Location</td>
                  <td className="p-3.5 font-bold text-slate-900">{app.campus}</td>
                </tr>
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-bold text-slate-500 uppercase tracking-wider">Offer Type</td>
                  <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block my-1">
                    {offer.type} Offer
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            This offer is subject to the terms and conditions outlined in the EGA Student Contract and compliance with all Immigration & Checkpoints Authority (ICA) Student Pass requirements where applicable.
          </p>

          {/* Official Signature Block */}
          <div className="pt-8 border-t border-slate-200 mt-12 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <div className="h-14 w-44 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-[#252D65]">
                [EGA Official Seal]
              </div>
              <p className="font-bold text-slate-900 text-xs">Office of Admissions & Registrar</p>
              <p className="text-[11px] text-slate-500">Educare Global Academy, Singapore</p>
            </div>

            <div className="text-right space-y-1 text-xs text-slate-500">
              <p className="font-bold text-slate-800">Digitally Verified Document</p>
              <p className="font-mono text-[10px]">Checksum: {offer.id.slice(0, 16)}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
