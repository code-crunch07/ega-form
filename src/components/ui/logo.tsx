"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLogoUrl } from "@/app/actions/get-logo";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textClass?: string;
  href?: string;
}

export function Logo({ className = "", iconSize = 28, textClass = "text-xl", href = "/" }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    getLogoUrl().then(url => {
      if (url) setLogoUrl(url);
    });
  }, []);

  return (
    <Link href={href} className={`flex items-center gap-2 font-bold tracking-tight ${className}`}>
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" style={{ width: iconSize, height: 'auto' }} className="object-contain" />
      ) : (
        <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center text-white">
          <GraduationCap size={iconSize} />
        </div>
      )}
    </Link>
  );
}
