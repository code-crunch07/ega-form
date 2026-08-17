import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "./print-button";

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
    <div className="min-h-screen bg-slate-200 dark:bg-neutral-950 p-4 sm:p-8 font-sans antialiased text-slate-800">
      
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

          <div>
            {/* Page 1 Header Logo */}
            <div className="flex justify-end pb-8">
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

              <p className="pt-4 font-bold text-slate-900">Dear Applicant,</p>

              {/* Programme Award Details */}
              <div className="space-y-1 font-bold text-slate-900 uppercase pt-2">
                <p className="text-base font-extrabold text-[#252D65]">
                  {programmeName} {studyMode} {intake}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  AWARDED BY {schoolName.toUpperCase()}
                </p>
              </div>

              <p className="pt-2 text-xs sm:text-sm leading-relaxed text-slate-800">
                We are pleased to inform you that you have been given a(n) confirmed offer after meeting all the conditions to the <strong className="font-extrabold">{programmeName}</strong> commencing <strong className="font-extrabold">{commencementDate}</strong>.
              </p>

              {/* Section 1: Acceptance of Offer */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">1. ACCEPTANCE OF OFFER</h3>
                <p className="leading-relaxed text-slate-700">
                  Please proceed to accept the Admission Offer and PEI-Student Contract by signing on the offer letter and student contract.
                </p>
                <p className="leading-relaxed text-slate-700">
                  You may refer to the PEI-student contract for course details, modules, subjects, course fees payable, refund policy, cooling-off period, confidentiality clause, medical insurance, fee protection schemes and other information.
                </p>
                <div className="pt-1">
                  <p className="font-bold underline uppercase text-xs text-slate-900">UNDER 18 YEARS OF AGE</p>
                  <p className="leading-relaxed text-slate-700">
                    If you are below 18 years old, you and your parents are required to accept the Offer Letter and submit the signed copy PEI Student Contract to EGA.
                  </p>
                </div>
              </div>

              {/* Section 2: Application Fee and Payment Method */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">2. APPLICATION FEE AND PAYMENT METHOD</h3>
                <p className="leading-relaxed text-slate-700">
                  A non-refundable application fee of <strong className="font-extrabold text-slate-900">{feeAmount}</strong> is payable upon acceptance of this offer.
                </p>
                <p className="leading-relaxed text-slate-700">
                  For details on the available payment methods and payment instructions, please refer to <span className="text-blue-600 underline cursor-pointer font-semibold">EGA Payment Method Details</span>.
                </p>
              </div>

              {/* Section 3: EGA Mail Login and Password */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">3. EGA MAIL LOGIN AND PASSWORD</h3>
                <p className="leading-relaxed text-slate-700">
                  Your EGA email login credentials will be sent to your personal email address within seven days of course fee payment.
                </p>
                <p className="leading-relaxed text-slate-700">
                  It is important that you log in to your EGA email account before the commencement of classes, as your &apos;Welcome Package&apos; and other important course-related information will be available there.
                </p>
              </div>

              {/* Section 4: Verification of Documents */}
              <div className="space-y-2 pt-3 text-xs sm:text-sm">
                <h3 className="font-extrabold text-slate-900 uppercase">4. VERIFICATION OF DOCUMENTS</h3>
                <p className="leading-relaxed text-slate-700">
                  It is the EGA&apos;s policy that all supporting documents submitted in your application such as, Identification document (NRIC/Passport), academic qualifications and etc., must be verified by EGA.
                </p>
              </div>

            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="pt-8 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Educare Global Academy Pte Ltd</span>
              <span>Registration Number: 201505088M</span>
            </div>
            <div className="flex flex-wrap justify-between text-slate-500 pt-0.5">
              <span>📍 133 New Bridge Road, Chinatown Point #25-10, Singapore 059413</span>
              <span>📞 (65) 6908 5994 / (65) 6908 5984</span>
              <span>🌐 www.ega.edu.sg</span>
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

          <div>
            {/* Page 2 Header Logo */}
            <div className="flex justify-end pb-8">
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
                  The IPA letter issued by the Immigration & Checkpoints Authority&apos;s (ICA) will not be released to you if the EGA offer and PEI-signed contract are not accepted/submitted by due dates and course fee is not paid. Your STP application will also be cancelled if we do not receive your contract acceptance by the stipulated deadline.
                </p>
                <p className="leading-relaxed text-slate-700">
                  EGA will inform you of the outcome of your Student&apos;s Pass (STP) application as we receive the decision from the Immigration & Checkpoints Authority (ICA).
                </p>
                <p className="leading-relaxed text-slate-700">
                  It is important that <strong className="font-extrabold text-slate-900">you hold a valid student&apos;s pass</strong>. Successful enrolment into the programme is subject to the STP approval by ICA.
                </p>
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
                <p className="text-slate-800">You&apos;re sincerely,</p>

                <div className="pt-4 space-y-0.5">
                  <p className="font-bold text-slate-900 text-base">Zun Hnin Pwint Aung</p>
                  <p className="font-semibold text-slate-700">Admissions Department</p>
                  <p className="text-[11px] text-slate-400 italic pt-1">(This is a computer generate letter. No Signature is required.)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="pt-8 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Educare Global Academy Pte Ltd</span>
              <span>Registration Number: 201505088M</span>
            </div>
            <div className="flex flex-wrap justify-between text-slate-500 pt-0.5">
              <span>📍 133 New Bridge Road, Chinatown Point #25-10, Singapore 059413</span>
              <span>📞 (65) 6908 5994 / (65) 6908 5984</span>
              <span>🌐 www.ega.edu.sg</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
