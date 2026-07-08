"use client";

import { useState, useTransition } from "react";
import { uploadLogo } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);

      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("logo", file);
          await uploadLogo(formData);
        } catch (error) {
          console.error("Failed to upload logo", error);
        }
      });
    }
  };

  const tabs = [
    { id: "institution", label: "Institution Details" },
    { id: "email", label: "Email Templates" },
    { id: "workflow", label: "Application Workflow" },
    { id: "payments", label: "Payment Gateways" },
    { id: "storage", label: "Storage (S3/R2)" },
    { id: "notifications", label: "Notification Rules" },
    { id: "roles", label: "User Roles" },
    { id: "branding", label: "Branding" },
    { id: "api", label: "API Keys" },
    { id: "audit", label: "Audit Logs" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Configure global application parameters.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Save size={16} /> Save Changes
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs defaultValue="institution" className="w-full flex flex-col gap-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="flex h-auto w-max md:w-full flex-nowrap md:flex-wrap bg-transparent justify-start gap-2 p-0">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-800 data-[state=active]:shadow-sm rounded-md border border-transparent data-[state=active]:border-neutral-200 dark:data-[state=active]:border-neutral-700 bg-neutral-200/50 dark:bg-neutral-800/50"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 w-full max-w-4xl">
            <TabsContent value="institution" className="m-0 space-y-6">
              <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle>Institution Details</CardTitle>
                  <CardDescription>Basic information about your university or institution.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution Name</label>
                    <Input defaultValue="Global Admissions University" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input defaultValue="admissions@institution.edu" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Phone</label>
                      <Input defaultValue="+1 (800) 555-0199" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Physical Address</label>
                    <Input defaultValue="123 University Blvd, Tech City, ST 12345" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="m-0 space-y-6">
              <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle>Stripe Integration</CardTitle>
                  <CardDescription>Configure your payment processor credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publishable Key</label>
                    <Input type="password" defaultValue="pk_test_1234567890abcdef" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <Input type="password" defaultValue="sk_test_1234567890abcdef" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook Secret</label>
                    <Input type="password" defaultValue="whsec_1234567890abcdef" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="m-0 space-y-6">
              <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle>AWS S3 / Cloudflare R2 Config</CardTitle>
                  <CardDescription>Configure secure document storage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bucket Name</label>
                    <Input defaultValue="ega-form-documents" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Access Key ID</label>
                      <Input type="password" defaultValue="AKIAIOSFODNN7EXAMPLE" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secret Access Key</label>
                      <Input type="password" defaultValue="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="m-0 space-y-6">
              <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle>Branding & Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution Logo</label>
                    <div className="flex items-center gap-6 mt-2">
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs text-neutral-400">No Logo</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload}
                          className="w-full max-w-xs"
                          disabled={isPending}
                        />
                        <p className="text-xs text-neutral-500">
                          {isPending ? "Uploading..." : "Recommended size: 256x256px. PNG, JPG, or SVG."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Color (Hex)</label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border bg-blue-600"></div>
                        <Input defaultValue="#2563eb" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform Name</label>
                      <Input defaultValue="EGA Admissions" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs map to placeholders for brevity */}
            {["email", "workflow", "notifications", "roles", "api", "audit"].map(tabId => (
              <TabsContent key={tabId} value={tabId} className="m-0">
                <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 min-h-[300px] flex items-center justify-center text-neutral-500">
                  <p>Configuration panel for {tabId}.</p>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
