import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RootPage() {
  let destination = "/login";

  try {
    const session = await auth();
    if (session?.user) {
      destination = (session.user as any).role === "ADMIN" ? "/admin" : "/dashboard";
    }
  } catch {
    destination = "/login";
  }

  redirect(destination);
}

