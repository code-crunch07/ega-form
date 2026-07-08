import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, BarChart2 } from "lucide-react";

export default function AdminReportsPage() {
  const reports = [
    { title: "Applications by Country", desc: "Geographic distribution of all applicants.", icon: <BarChart2 size={24} className="text-blue-600"/> },
    { title: "Applications by Programme", desc: "Breakdown of demand per academic programme.", icon: <BarChart2 size={24} className="text-indigo-600"/> },
    { title: "Revenue & Finance", desc: "Application fee collection and pending invoices.", icon: <BarChart2 size={24} className="text-green-600"/> },
    { title: "Conversion Rate", desc: "Draft vs Submitted vs Offered vs Enrolled funnel.", icon: <BarChart2 size={24} className="text-orange-600"/> },
    { title: "Acceptance Rate", desc: "Ratio of offers issued vs applications received.", icon: <BarChart2 size={24} className="text-purple-600"/> },
    { title: "Agent Performance", desc: "Track conversions from affiliated recruitment agents.", icon: <BarChart2 size={24} className="text-pink-600"/> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-neutral-500 mt-1 dark:text-neutral-400">Generate and export institutional data reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <Card key={i} className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                {report.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <p className="text-sm text-neutral-500 mt-1">{report.desc}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2 border-neutral-200 dark:border-neutral-800"><FileText size={14} /> PDF</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 border-neutral-200 dark:border-neutral-800"><FileSpreadsheet size={14} /> Excel</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 border-neutral-200 dark:border-neutral-800"><Download size={14} /> CSV</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
