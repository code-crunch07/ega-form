import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  User, 
  MapPin, 
  PhoneCall, 
  Plane, 
  FileCheck, 
  CreditCard, 
  FolderOpen, 
  MessageSquare, 
  ShieldAlert,
  MoreHorizontal,
  Edit,
  UserX,
  Key,
  History,
  Merge
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default async function ApplicantProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const applicantId = resolvedParams.id;

  const user = await prisma.user.findUnique({
    where: { id: applicantId },
    include: {
      profile: true,
      applications: true
    }
  });

  if (!user) {
    notFound();
  }

  const displayName = user.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : user.name || "Unknown";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Profile Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-inner">
              {initials}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                  {displayName}
                </h1>
                {user.emailVerified ? (
                   <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-none px-2.5">Verified</Badge>
                ) : (
                   <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-none px-2.5">Unverified</Badge>
                )}
              </div>
              <p className="text-neutral-500 font-medium">{user.email} • {user.profile?.phone || "No phone provided"}</p>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 text-neutral-600 border-neutral-200 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-400 rounded-xl h-11 px-4 font-semibold transition-all">
              <MessageSquare size={16} /> Send Message
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
                <DropdownMenuItem className="gap-2 text-neutral-600 font-medium">
                  <Edit size={15} /> Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-neutral-600 font-medium">
                  <Key size={15} /> Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-neutral-600 font-medium">
                  <History size={15} /> View Login History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-amber-600 font-medium">
                  <Merge size={15} /> Merge Accounts
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-red-600 font-medium">
                  <UserX size={15} /> Disable Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        {/* Sleek Horizontal Tab Bar */}
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="personal" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><User size={16}/> Personal Info</TabsTrigger>
          <TabsTrigger value="addresses" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MapPin size={16}/> Addresses</TabsTrigger>
          <TabsTrigger value="emergency" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><PhoneCall size={16}/> Emergency Contact</TabsTrigger>
          <TabsTrigger value="passport" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Plane size={16}/> Passport</TabsTrigger>
          <TabsTrigger value="applications" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileCheck size={16}/> Applications</TabsTrigger>
          <TabsTrigger value="payments" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CreditCard size={16}/> Payments</TabsTrigger>
          <TabsTrigger value="documents" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FolderOpen size={16}/> Documents</TabsTrigger>
          <TabsTrigger value="messages" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MessageSquare size={16}/> Messages</TabsTrigger>
          <TabsTrigger value="activity" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><ShieldAlert size={16}/> Activity</TabsTrigger>
        </TabsList>

        {/* TAB: Personal Info */}
        <TabsContent value="personal" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Date of Birth</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{user.profile?.dob ? new Date(user.profile.dob).toLocaleDateString() : "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Gender</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{user.profile?.gender || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Addresses */}
        <TabsContent value="addresses" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Addresses</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Address information not fully provided.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Emergency Contact */}
        <TabsContent value="emergency" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No emergency contacts listed.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Passport */}
        <TabsContent value="passport" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Passport & Visa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Passport Details: {user.profile?.passportNumber || "Not provided"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Applications */}
        <TabsContent value="applications" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>App ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.applications.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center text-neutral-500 h-24">No applications submitted yet.</TableCell></TableRow>
                    ) : (
                      user.applications.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium text-blue-600">{app.appNumber}</TableCell>
                          <TableCell>{app.status}</TableCell>
                          <TableCell>{app.createdAt.toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Payments */}
        <TabsContent value="payments" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No payment records found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Documents */}
        <TabsContent value="documents" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No documents uploaded.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Messages */}
        <TabsContent value="messages" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No messages in inbox.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Activity */}
        <TabsContent value="activity" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Account created on {user.createdAt.toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
