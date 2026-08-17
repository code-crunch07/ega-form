import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "./print-button";

export default async function OfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const offerId = resolvedParams.id;

  const [offer, logoSetting] = await Promise.all([
    prisma.offer.findUnique({
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
    }),
    prisma.systemSetting.findUnique({
      where: { key: "INSTITUTION_LOGO" }
    })
  ]);

  if (!offer || !offer.application) {
    notFound();
  }

  const app = offer.application;
  const profile = app.user?.profile;
  const logoUrl = logoSetting?.value || null;

  // Dynamic Data Extraction
  const issueDate = new Date(offer.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const applicantFullName = (profile?.firstName 
    ? `${profile.firstName} ${profile.lastName || ''}`.trim() 
    : app.user?.name || "JAYAKUMAR HYSON SANJAY").toUpperCase();

  const addressLine1 = profile?.address || "63 ROJA STREET";
  const cityState = profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : "GANDHI NAGAR, CUDDALORE";
  const countryPostal = profile?.country && profile?.postalCode ? `PIN: ${profile.postalCode}, ${profile.country.toUpperCase()}` : "PIN: 607308, TAMIL NADU, INDIA";

  const appNumber = app.appNumber || "2608001015";
  const schoolName = app.school || "GLASGOW CALEDONIAN UNIVERSITY, U.K.";
  const programmeName = (app.programmeLevel || "MASTER OF BUSINESS ADMINISTRATION").toUpperCase();
  const studyMode = app.studyMode || "Full-Time";
  const intake = app.intake || "September 2026";
  const commencementDate = "14 September 2026";

  const feeAmount = (schoolName.toUpperCase().includes("GLASGOW") || schoolName.toUpperCase().includes("KINGSTON") || schoolName.toUpperCase().includes("NCC")) 
    ? "S$320.00" 
    : "S$160.00";

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-neutral-950 p-4 sm:p-8 font-sans antialiased text-slate-800 print:bg-white print:p-0 print:m-0 print:block">
      
      {/* Top Action Bar (Print / Back) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href="/admin/offers">
          <Button variant="outline" className="gap-2 bg-white dark:bg-neutral-900 border-slate-300 font-bold text-xs">
            <ArrowLeft size={16} /> Back to Offers
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      {/* DOCUMENT WRAPPER (2 PAGES EXACT MATCH) */}
      <div className="max-w-[850px] mx-auto space-y-8 print:space-y-0">

        {/* ==================== PAGE 1 ==================== */}
        <div className="bg-white p-8 sm:p-14 shadow-2xl rounded-sm border border-slate-300 relative overflow-hidden min-h-[1100px] flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-screen print:page-break-after-always">
          
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <div className="w-[500px] h-[500px] rounded-full border-[40px] border-[#252D65] flex items-center justify-center text-9xl font-black text-[#252D65]">
              EGA
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start">
            {/* Page 1 Header Logo */}
            <div className="flex justify-end pb-8">
              {logoUrl ? (
                <img src={logoUrl} alt="Educare Global Academy" className="h-16 w-auto max-w-[220px] object-contain" />
              ) : (
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-[#BE1E2D]">
                    <div className="w-9 h-9 rounded-full border-4 border-[#BE1E2D] flex items-center justify-center font-black text-xs font-mono">
                      ∞
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-[#252D65]">EDUCARE</span>
                  </div>
                  <p className="text-[9px] font-bold tracking-widest text-[#BE1E2D] uppercase font-mono">GLOBAL ACADEMY</p>
                  <p className="text-[8px] text-slate-400 font-serif italic">shaping destinies</p>
                </div>
              )}
            </div>

            {/* Date & Applicant Details */}
            <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-900 leading-snug">
              <p className="font-bold text-slate-900">{issueDate}</p>

              <div className="font-bold tracking-wide uppercase space-y-0.5">
                <p className="text-base text-slate-900 font-extrabold">{applicantFullName}</p>
                <p>{addressLine1}</p>
                <p>{cityState}</p>
                <p>{countryPostal}</p>
              </div>

              <p className="font-extrabold pt-2 text-slate-900 font-mono">
                EGA APPLICATION NO. <span className="underline">{appNumber}</span>
              </p>

              <p className="pt-3 font-bold text-slate-900">Dear Applicant,</p>

              {/* Programme Award Details */}
              <div className="space-y-1 font-bold text-slate-900 uppercase pt-1">
                <p className="text-base font-extrabold text-[#252D65]">
                  {programmeName} {studyMode.toUpperCase()} {intake.toUpperCase()}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  AWARDED BY {schoolName.toUpperCase()}
                </p>
              </div>

              <p className="pt-1 text-xs sm:text-sm leading-relaxed text-slate-800 text-justify">
                We are pleased to inform you that your application for admission to Educare Global Academy (EGA) has been successful. On behalf of the Academic Board and Management of EGA, we take great pleasure in offering you a place in the above-mentioned programme, subject to your acceptance of the terms and conditions outlined in this letter and the Student Contract.
              </p>

              {/* Offer Details Table */}
              <div className="border border-slate-300 rounded-xs overflow-hidden my-3">
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2.5 font-bold w-1/3 border-r border-slate-200">Programme Applied</td>
                      <td className="p-2.5 font-bold text-[#252D65]">{programmeName}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold border-r border-slate-200">Awarding Body</td>
                      <td className="p-2.5">{schoolName}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2.5 font-bold border-r border-slate-200">Mode of Study</td>
                      <td className="p-2.5">{studyMode}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 font-bold border-r border-slate-200">Course Intake / Commencement</td>
                      <td className="p-2.5">{intake} ({commencementDate})</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2.5 font-bold border-r border-slate-200">Application Processing Fee</td>
                      <td className="p-2.5 font-bold text-[#BE1E2D]">{feeAmount} (Non-Refundable)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Important Terms */}
              <div className="space-y-2 text-xs">
                <h3 className="font-extrabold text-slate-900 uppercase">1. ACCEPTANCE OF OFFER</h3>
                <p className="leading-relaxed text-slate-700">
                  To accept this offer, please sign and return the Offer Acceptance Form along with the non-refundable application fee payment receipt to the Admissions Office within 14 days from the date of this letter.
                </p>

                <h3 className="font-extrabold text-slate-900 uppercase pt-2">2. FEE PROTECTION SCHEME (FPS) & INSURANCE</h3>
                <p className="leading-relaxed text-slate-700">
                  In accordance with Committee for Private Education (CPE) requirements, EGA has implemented Fee Protection Scheme (FPS) to protect the paid course fees of both local and international students.
                </p>
              </div>
            </div>
          </div>

          {/* Page 1 Legal Footer (Pinned to Bottom) */}
          <div className="mt-auto pt-6 border-t border-slate-200 text-left space-y-1">
            <p className="font-extrabold text-slate-900 text-[13px] leading-tight">Educare Global Academy Pte Ltd</p>
            <p className="text-[12px] text-slate-600 font-medium leading-tight">Registration Number: 201505088M</p>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-medium pt-1.5 gap-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">📍</span>
                <span>133 New Bridge Road, Chinatown Point #25-10, Singapore 059413</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">📞</span>
                <span>(65) 6908 5994 / (65) 6908 5984</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">🌐</span>
                <span>www.ega.edu.sg</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== PAGE 2 ==================== */}
        <div className="bg-white p-8 sm:p-14 shadow-2xl rounded-sm border border-slate-300 relative overflow-hidden min-h-[1100px] flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-screen">
          
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <div className="w-[500px] h-[500px] rounded-full border-[40px] border-[#252D65] flex items-center justify-center text-9xl font-black text-[#252D65]">
              EGA
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start">
            {/* Page 2 Header Logo */}
            <div className="flex justify-end pb-8">
              {logoUrl ? (
                <img src={logoUrl} alt="Educare Global Academy" className="h-16 w-auto max-w-[220px] object-contain" />
              ) : (
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-[#BE1E2D]">
                    <div className="w-9 h-9 rounded-full border-4 border-[#BE1E2D] flex items-center justify-center font-black text-xs font-mono">
                      ∞
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-[#252D65]">EDUCARE</span>
                  </div>
                  <p className="text-[9px] font-bold tracking-widest text-[#BE1E2D] uppercase font-mono">GLOBAL ACADEMY</p>
                  <p className="text-[8px] text-slate-400 font-serif italic">shaping destinies</p>
                </div>
              )}
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-900 leading-snug">
              
              <p className="leading-relaxed text-slate-700">
                You are required to bring the original document(s), including the English-translated notarised version, for verification either during orientation/enrolment or before commencement to Student Services.
              </p>

              <p className="leading-relaxed font-bold text-slate-900">
                EGA reserves the right to rescind this offer or terminate the enrolment of student should there be any misrepresentation or omission of information.
              </p>

              {/* Section 5: International Students */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">5. FOR INTERNATIONAL STUDENTS IN FULL TIME PROGRAMME ONLY</h3>
                <p className="leading-relaxed text-slate-700">
                  You are required to complete the Student&apos;s Pass (STP) application process. After accepting the Offer Letter and submitting the signed PEI Student Contract, please complete and submit the STP Application Form to EGA. Upon receipt of the completed STP Application Form and supporting documents, EGA will submit the application to the Immigration & Checkpoints Authority (ICA) for processing.
                </p>

                <p className="font-bold underline uppercase text-xs text-slate-900 pt-1">THE IN-PRINCIPLE APPROVAL (IPA) LETTER</p>
                <p className="leading-relaxed text-slate-700">
                  You are to book your air ticket and arrive in <strong className="font-extrabold text-slate-900">Singapore only after receiving the ICA&apos;s IPA letter from EGA</strong>. Do read the <span className="text-blue-600 underline cursor-pointer font-semibold">arrival Information</span> which will tell you what you must do before your departure from your country and what you must do when you arrive in Singapore.
                </p>
              </div>

              {/* Section 6: Course Commencement */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">6. COURSE COMMENCEMENT</h3>
                <p className="leading-relaxed text-slate-700">
                  Please note that this course will only proceed if the required minimum number of students is enrolled prior to the commencement. In the event of unforeseen circumstances or administrative reasons, EGA reserves the right to cancel, delay or withdraw the course. An alternative schedule/ course may be offered to you.
                </p>
              </div>

              {/* Section 7: Contact Details Table */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">7. CONTACT DETAILS</h3>
                <div className="border border-slate-300 rounded-sm overflow-hidden my-3">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-bold uppercase">
                        <th className="p-2.5 border-r border-slate-300">ENQUIRIES</th>
                        <th className="p-2.5 border-r border-slate-300">DEPARTMENT</th>
                        <th className="p-2.5 border-r border-slate-300">DID</th>
                        <th className="p-2.5">E-MAIL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-slate-800 font-medium">
                        <td className="p-2.5 border-r border-slate-300">Course Information</td>
                        <td className="p-2.5 border-r border-slate-300">Student Services</td>
                        <td className="p-2.5 border-r border-slate-300 font-mono">(65) 8895 1696</td>
                        <td className="p-2.5 font-mono text-blue-600">stduent@ega.edu.sg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sign-off */}
              <div className="pt-4 space-y-3 text-xs sm:text-sm">
                <p className="text-slate-800">We wish you an enriching experience in Educare Global Academy.</p>
                <p className="text-slate-800">Yours sincerely,</p>

                <div className="pt-4 space-y-0.5">
                  <p className="font-bold text-slate-900 text-base">Zun Hnin Pwint Aung</p>
                  <p className="font-semibold text-slate-700">Admissions Department</p>
                  <p className="text-[11px] text-slate-400 italic pt-1">(This is a computer generated letter. No Signature is required.)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Page 2 Legal Footer (Pinned to Bottom) */}
          <div className="mt-auto pt-6 border-t border-slate-200 text-left space-y-1">
            <p className="font-extrabold text-slate-900 text-[13px] leading-tight">Educare Global Academy Pte Ltd</p>
            <p className="text-[12px] text-slate-600 font-medium leading-tight">Registration Number: 201505088M</p>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-medium pt-1.5 gap-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">📍</span>
                <span>133 New Bridge Road, Chinatown Point #25-10, Singapore 059413</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">📞</span>
                <span>(65) 6908 5994 / (65) 6908 5984</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#BE1E2D]">🌐</span>
                <span>www.ega.edu.sg</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
