"use client";
import storage from "@/services/storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const locale = Cookie.get("NEXT_LOCALE") || "vi";
      const accessToken: string = storage.getAccessToken();
      if (accessToken) {
        router.push(`/${locale}/energy-simulator`);
      } else {
        router.push(`/${locale}/login`);
      }
    };

    checkToken();
  }, [router]);

  return <main></main>;
}
