import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, User } from "lucide-react";

export default function AdminMessagesPage() {
  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-neutral-500 mt-1 dark:text-neutral-400">Communicate with applicants and view internal staff notes.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Thread List Sidebar */}
        <Card className="w-1/3 flex flex-col shadow-sm border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <CardHeader className="p-4 border-b dark:border-neutral-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <Input placeholder="Search messages..." className="pl-9 h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {[
              { name: "Jane Doe", prog: "Comp Sci", time: "10:24 AM", unread: true },
              { name: "John Smith", prog: "Data Science", time: "Yesterday", unread: false },
              { name: "Internal Notes", prog: "App #2026-004", time: "Jul 5", unread: false },
            ].map((thread, i) => (
              <div key={i} className={`p-4 border-b dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${thread.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${thread.unread ? 'font-bold' : 'font-medium'}`}>{thread.name}</h4>
                  <span className="text-xs text-neutral-500">{thread.time}</span>
                </div>
                <p className="text-xs text-neutral-500 truncate">{thread.prog}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-sm border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <CardHeader className="p-4 border-b dark:border-neutral-800 flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <CardTitle className="text-base">Jane Doe</CardTitle>
              <p className="text-xs text-neutral-500">App #APP-2026-001</p>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex justify-center">
              <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">Today</span>
            </div>
            
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0"></div>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none">
                <p className="text-sm">Hi, I uploaded my IELTS certificate as requested. Could you please confirm if it's the correct format?</p>
                <span className="text-[10px] text-neutral-500 mt-1 block">10:24 AM</span>
              </div>
            </div>

            <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0"></div>
              <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none">
                <p className="text-sm">Hello Jane. Yes, the document looks perfect. We will review it shortly and update your application status.</p>
                <span className="text-[10px] text-blue-200 mt-1 block text-right">Just now</span>
              </div>
            </div>
          </CardContent>
          
          <div className="p-4 border-t dark:border-neutral-800 bg-white dark:bg-black">
            <div className="flex items-center gap-2">
              <Input placeholder="Type your message here..." className="flex-1" />
              <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
