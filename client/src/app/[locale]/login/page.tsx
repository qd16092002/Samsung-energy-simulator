"use client";
import Main from "@/components/login/main";
import storage from "@/services/storage";import { redirect } from "next/navigation";
import Cookie from "js-cookie";
import api from "@/services/api";

import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const checkToken = () => {
      let accessToken = storage.getAccessToken();
      if (accessToken) {
        const locale = Cookie.get("NEXT_LOCALE") || "vi";
        redirect(`/${locale}/energy-simulator`);
      }
    };
    checkToken();
  }, []);
  api.post("check-health", {})
    .then((response) => {
      console.log("Health check successful:", response);
    })
    .catch((error) => {
      console.error("Health check failed:", error);
    });
  return (
    <Main></Main>
  )
}