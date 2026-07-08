"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/logo";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[420px] mx-auto shadow-2xl border-none bg-white text-black rounded-lg overflow-hidden py-4 px-2 animate-entrance">
      <CardHeader className="space-y-6 flex flex-col items-center pb-2">
        <Logo className="mb-2" iconSize={120} textClass="hidden" />
        <div className="w-full">
          <h2 className="text-xl font-medium tracking-tight text-left">Log In</h2>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-1">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            
            <div className="flex items-center justify-start mt-2">
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          {error && <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs">{error}</div>}

          <Button type="submit" className="w-full bg-[#3b5998] hover:bg-[#2d4373] text-white h-11 font-normal transition-all" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-xs text-neutral-800 text-left">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up now
            </Link>
          </div>
        </form>



        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-start">
            <span className="bg-white pr-2 text-sm text-gray-500">Or</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-white border-gray-300 text-black h-11 flex items-center justify-center gap-2 hover:bg-gray-50">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2]" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Sign in with LinkedIn
          </Button>
          <Button variant="outline" className="w-full bg-white border-gray-300 text-black h-11 flex items-center justify-center gap-2 hover:bg-gray-50">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Sign in with Google
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-[10px] text-gray-500 leading-tight text-center">
            By creating this account, I agree that the Institution and its related entities may collect, use and disclose my personal data, as provided by me for the purposes of administration of my account, in accordance with the Personal Data Protection Act 2012 and for the Institution to contact me via voice call, instant messaging platforms and/or email, to share with me more information about the educational services and matters that may be relevant to my academic pursuit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
