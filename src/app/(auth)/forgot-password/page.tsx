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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordValues) {
    setIsLoading(true);
    setMessage("");

    try {
      // Mock API call to send reset link
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("If an account exists with that email, we have sent a password reset link.");
    } catch (err: any) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-none bg-white/70 dark:bg-black/50 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          
          {message && <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">{message}</div>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
