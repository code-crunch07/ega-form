"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { signIn, signOut } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { getAdminSession, seedDefaultAdmin } from "@/app/actions/admin";
import { 
  Lock, 
  Mail, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "seeded" | "exists" | "error">("idle");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Auto-seed the admin user on load
  useEffect(() => {
    setSeedStatus("loading");
    seedDefaultAdmin()
      .then((res) => {
        if (res.error) {
          setSeedStatus("error");
        } else if (res.seeded) {
          setSeedStatus("seeded");
        } else {
          setSeedStatus("exists");
        }
      })
      .catch(() => setSeedStatus("error"));

    // Also redirect to /admin if they already have an active admin session
    getAdminSession().then((session) => {
      if (session) {
        window.location.href = "/admin";
      }
    });
  }, []);

  const handleQuickFill = () => {
    setValue("email", "admin@educare.com");
    setValue("password", "admin123");
  };

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Verify they are indeed an admin
      const adminSession = await getAdminSession();
      if (!adminSession) {
        setError("Access Denied: Unrecognized administrator role or invalid account type.");
        await signOut({ redirect: false });
        setIsLoading(false);
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred during authentication.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0bd] text-neutral-800 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Soft Multi-Colored Mesh Gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[65%] h-[65%] rounded-full bg-blue-100/50 blur-[130px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[65%] h-[65%] rounded-full bg-violet-100/50 blur-[130px] pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full bg-rose-100/30 blur-[120px] pointer-events-none" />

      {/* Modern Light Geometric Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Main Single Centered Card */}
      <div className="w-full max-w-[480px] z-10 space-y-6">
        
        <Card className="border-none bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden py-6 px-4">
          <CardContent className="space-y-6 text-left p-2">
            
            {/* Logo Container */}
            <div className="flex flex-col items-center justify-center mb-2">
              <Logo iconSize={120} textClass="hidden" />
            </div>

            <div className="space-y-1.5 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Authentication</h1>
              <p className="text-sm text-neutral-500 font-normal">Enter your administrative credentials to log in.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@educare.com"
                    {...register("email")}
                    className={`bg-white border-neutral-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 text-neutral-800 h-11 pl-11 pr-4 placeholder-neutral-400 rounded-xl transition-all ${
                      errors.email ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`bg-white border-neutral-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 text-neutral-800 h-11 pl-11 pr-10 placeholder-neutral-400 rounded-xl transition-all ${
                      errors.password ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="flex gap-2.5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                  <div>{error}</div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-medium transition-all shadow-md shadow-blue-500/10 active:scale-[0.99] mt-2 cursor-pointer flex items-center justify-center gap-2 group border-none"
                disabled={isLoading}
              >
                {isLoading ? "Validating security..." : "Sign In to Console"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 duration-200" />
              </Button>
            </form>

            {/* Premium Seeded Developer Credentials Section */}
            <div className="p-4 bg-slate-50/50 border border-neutral-200/50 rounded-2xl space-y-3 text-left">
              <div className="flex items-start gap-3 text-xs text-neutral-500">
                <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    Testing Mode Enablement
                  </p>
                  <p className="leading-relaxed text-[11px] text-neutral-500 font-normal">
                    Use the mock administrator account below to verify console functionality.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
                <div className="w-full sm:w-auto font-mono text-[11px] text-neutral-600 space-y-0.5 text-left">
                  <div><span className="text-neutral-400 font-sans">Email:</span> <span className="text-blue-600 font-medium select-all">admin@educare.com</span></div>
                  <div><span className="text-neutral-400 font-sans">Password:</span> <span className="text-purple-600 font-medium select-all">admin123</span></div>
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleQuickFill}
                  className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-800 border border-neutral-200 text-xs px-3 h-8.5 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 font-sans font-medium"
                >
                  <CheckCircle2 size={12} className="text-blue-500" />
                  Quick-Fill Demo
                </Button>
              </div>

              <hr className="border-neutral-200/60" />

              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium font-sans">
                {seedStatus === "loading" && (
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Checking database...</span>
                )}
                {seedStatus === "seeded" && (
                  <span className="flex items-center gap-1.5 text-green-600 font-semibold"><CheckCircle2 size={11} /> Demo account seeded!</span>
                )}
                {seedStatus === "exists" && (
                  <span className="flex items-center gap-1.5 text-blue-600 font-semibold"><CheckCircle2 size={11} /> Demo credentials verified.</span>
                )}
                {seedStatus === "error" && (
                  <span className="flex items-center gap-1.5 text-red-500"><AlertTriangle size={11} /> Seeding error. Check database.</span>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="/login"
                className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1.5 hover:underline"
              >
                ← Return to Student Portal
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
