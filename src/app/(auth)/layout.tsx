import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | Admissions Management",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/20" /> {/* Slight dark overlay */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
