"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const locale = Cookie.get("NEXT_LOCALE") || "vi";

  useEffect(() => {
    router.push(`/${locale}/login`);
  }, [locale, router]);

  return <div>Redirecting...</div>;
}
