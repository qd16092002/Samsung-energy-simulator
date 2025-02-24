"use client";
import Header from "@/components/layouts/header/header";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex relative flex-col md:flex-row min-h-screen w-full">
      <Header />
      {children}
    </main>
  );
}
