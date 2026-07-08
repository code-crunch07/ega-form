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

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  displayName: z.string().min(2, "Display Name is required"),
  givenName: z.string().min(1, "Given Name is required"),
  surname: z.string().min(1, "Surname is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        name: data.displayName,
        email: data.email,
        password: data.password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      // Auto login after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Failed to sign in automatically. Please sign in manually.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[420px] mx-auto shadow-2xl border-none bg-white text-black rounded-lg overflow-hidden py-4 px-2 relative animate-entrance">
      
      {/* Cancel Link */}
      <div className="absolute top-4 left-4">
        <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black flex items-center">
          &lt; Cancel
        </Link>
      </div>

      <CardHeader className="space-y-4 flex flex-col items-center pt-8 pb-2">
        <Logo className="mb-2" iconSize={120} textClass="hidden" />
        <div className="w-full text-center">
          <p className="text-[11px] text-gray-600">Verification is necessary. Please click Send button.</p>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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



          <div className="pt-2 pb-2">
            <Button 
              type="button" 
              className="w-full bg-[#3b5998] hover:bg-[#2d4373] text-white h-11 font-normal transition-all"
            >
              Send verification code
            </Button>
          </div>

          <div className="space-y-1">
            <Input
              id="password"
              type="password"
              placeholder="New Password"
              {...register("password")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <Input
              id="displayName"
              placeholder="Display Name"
              {...register("displayName")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.displayName ? "border-red-500" : ""}`}
            />
            {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>}
          </div>

          <div className="space-y-1">
            <Input
              id="givenName"
              placeholder="Given Name"
              {...register("givenName")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.givenName ? "border-red-500" : ""}`}
            />
            {errors.givenName && <p className="text-xs text-red-500 mt-1">{errors.givenName.message}</p>}
          </div>

          <div className="space-y-1">
            <Input
              id="surname"
              placeholder="Surname"
              {...register("surname")}
              className={`bg-white border-gray-300 text-black h-11 ${errors.surname ? "border-red-500" : ""}`}
            />
            {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname.message}</p>}
          </div>
          
          {error && <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs">{error}</div>}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-[#b3cbf2] hover:bg-[#8baee6] text-white h-11 font-medium transition-all" 
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
