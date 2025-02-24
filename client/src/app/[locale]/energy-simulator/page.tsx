"use client";
import Main from "@/components/energy-simulator/main";
import storage from "@/services/storage";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Cookie from "js-cookie";

export default function EnergySimulator() {
  useEffect(() => {
    const checkToken = () => {
      let accessToken = storage.getAccessToken();
      if (!accessToken) {
        const locale = Cookie.get("NEXT_LOCALE") || "vi";
        redirect(`/${locale}/login`);
      }
    };
    checkToken();
  }, []);
  return <Main></Main>;
}
