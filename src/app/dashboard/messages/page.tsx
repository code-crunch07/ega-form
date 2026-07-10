import { MessageSquare, Send, Headphones } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    q: "How do I upload missing documents?",
    a: "Go to Documents or continue your application wizard to the Documents step. Accepted formats are PDF, JPG, and PNG up to 5MB.",
  },
  {
    q: "Can I edit my application after submitting?",
    a: "Submitted applications cannot be edited. Contact admissions if you need to make changes.",
  },
  {
    q: "When will I hear back about my application?",
    a: "Review typically takes 2–4 weeks after submission. You'll receive updates via notifications and email.",
  },
];

export default function MessagesPage() {
  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Support"
        icon={MessageSquare}
        title="Messages"
        description="Chat with the admissions team and get help with your application."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C3D6B]/10 text-[#3C3D6B]">
              <Headphones size={18} />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Admissions Support</p>
              <p className="text-xs text-emerald-600 font-medium">Typically replies within 1 business day</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-semibold text-neutral-900">No messages yet</h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              Start a conversation with our admissions team for help with documents, deadlines, or programme questions.
            </p>
          </div>

          <div className="border-t border-neutral-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="h-11 flex-1 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 text-sm focus:border-[#3C3D6B]/40 focus:outline-none focus:ring-2 focus:ring-[#3C3D6B]/10"
              />
              <Button className="h-11 rounded-xl bg-[#3C3D6B] px-5 hover:bg-[#2C2D54]">
                <Send size={18} />
                Send
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900">Quick Help</h3>
            <p className="mt-1 text-sm text-neutral-500">Common questions from applicants</p>
            <div className="mt-4 space-y-4">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="group rounded-xl border border-neutral-100 bg-neutral-50/50">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="border-t border-neutral-100 px-4 py-3 text-xs leading-relaxed text-neutral-600">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
