import { CreditCard, Receipt, CheckCircle2, Clock, Download } from "lucide-react";
import { getMockSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    session_id?: string;
    application_id?: string;
  }>;
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { status, session_id, application_id } = resolvedSearchParams;

  if (status === "success" && session_id && application_id) {
    const existingPayment = await prisma.payment.findFirst({
      where: { applicationId: application_id }
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          applicationId: application_id,
          amount: 50.00,
          gateway: session_id.startsWith("mock_") ? "Mock" : "Stripe",
          status: "Paid"
        }
      });

      await prisma.application.update({
        where: { id: application_id },
        data: { status: "Submitted" }
      });
    } else {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: "Paid" }
      });
      await prisma.application.update({
        where: { id: application_id },
        data: { status: "Submitted" }
      });
    }
  }

  const user = await getMockSessionUser();

  const payments = await prisma.payment.findMany({
    where: { application: { userId: user.id } },
    include: {
      application: { select: { appNumber: true, programmeId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalPaid = payments
    .filter((p) => p.status === "Completed" || p.status === "Paid")
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const pending = payments.filter((p) => p.status !== "Completed" && p.status !== "Paid").length;

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Payments"
        icon={CreditCard}
        title="Payment History"
        description="View application fees, payment status, and download receipts."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={`$${totalPaid.toFixed(2)}`}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Transactions"
          value={payments.length}
          icon={Receipt}
          iconClassName="bg-[#2C315E]/10 text-[#2C315E]"
        />
        <StatCard
          label="Pending"
          value={pending}
          icon={Clock}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">All Transactions</h2>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Application fees are collected when you submit an application. Your receipts will appear here."
            action={{ label: "Start Application", href: "/dashboard/applications/new" }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-3">Application</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-neutral-50/80">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {payment.application.appNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                      ${(payment.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {payment.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {(payment.status === "Completed" || payment.status === "Paid") && (
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2C315E] hover:underline">
                          <Download size={14} />
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
