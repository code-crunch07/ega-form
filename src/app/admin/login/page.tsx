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

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Ensure default admin exists in database on load
  useEffect(() => {
    seedDefaultAdmin().catch(() => {});

    // Redirect to /admin if already authenticated
    getAdminSession().then((session) => {
      if (session) {
        window.location.href = "/admin";
      }
    });
  }, []);

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
    <div className="min-h-screen bg-[#f0f0f0bd] text-neutral-800 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-jost">
      {/* Soft Multi-Colored Mesh Gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[65%] h-[65%] rounded-full bg-blue-100/50 blur-[130px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[65%] h-[65%] rounded-full bg-violet-100/50 blur-[130px] pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full bg-rose-100/30 blur-[120px] pointer-events-none" />

      {/* Modern Light Geometric Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Main Single Centered Card */}
      <div className="w-full max-w-[440px] z-10 space-y-6">
        
        <Card className="border-none bg-white/90 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden py-6 px-4">
          <CardContent className="space-y-6 text-left p-2">
            
            {/* Logo Container */}
            <div className="flex flex-col items-center justify-center mb-2">
              <Logo iconSize={130} textClass="hidden" />
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
                    placeholder="name@ega.edu.sg"
                    {...register("email")}
                    className={`bg-white border-neutral-200 focus:border-[#252D65] focus:ring-2 focus:ring-[#252D65]/10 text-neutral-800 h-11 pl-11 pr-4 placeholder-neutral-400 rounded-xl transition-all ${
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
                    className={`bg-white border-neutral-200 focus:border-[#252D65] focus:ring-2 focus:ring-[#252D65]/10 text-neutral-800 h-11 pl-11 pr-10 placeholder-neutral-400 rounded-xl transition-all ${
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
                className="w-full bg-[#252D65] hover:bg-[#1C224E] text-white h-11 rounded-xl font-medium transition-all shadow-md shadow-[#252D65]/10 active:scale-[0.99] mt-2 cursor-pointer flex items-center justify-center gap-2 group border-none"
                disabled={isLoading}
              >
                {isLoading ? "Validating security..." : "Sign In to Console"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 duration-200" />
              </Button>
            </form>

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
