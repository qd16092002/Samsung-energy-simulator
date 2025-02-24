import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Modal from "@/components/modals/modal";
import Confirm from "@/components/modals/confirm";
import Alert from "@/components/modals/alert";
import Loading from "@/components/modals/loading";
import { ReduxProvider } from "./provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// Load custom font
const pretendard = localFont({
  src: [
    {
      path: "../../assets/fonts/Pretendard-Thin.otf",
      style: "thin", //weight 100
    },
    {
      path: "../../assets/fonts/Pretendard-ExtraLight.otf",
      style: "extralight", //weight 200
    },
    {
      path: "../../assets/fonts/Pretendard-Light.otf",
      style: "light", //weight 300
    },
    {
      path: "../../assets/fonts/Pretendard-Regular.otf",
      style: "normal", //weight 400
    },
    {
      path: "../../assets/fonts/Pretendard-Medium.otf",
      style: "medium", //weight 500
    },
    {
      path: "../../assets/fonts/Pretendard-SemiBold.otf",
      style: "semibold", //weight 600
    },
    {
      path: "../../assets/fonts/Pretendard-Bold.otf",
      style: "bold", //weight 700
    },
    {
      path: "../../assets/fonts/Pretendard-ExtraBold.otf",
      style: "extrabold", //weight 800
    },
    {
      path: "../../assets/fonts/Pretendard-Black.otf",
      style: "blackbold", //weight 900
    },
  ],
});

export const metadata: Metadata = {
  title: "Energy Simulator",
  description: "Energy Simulator",
};

type Locale = "vi" | "hi" | "th";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale: locale as Locale });

  return (
    <html lang={locale}>
      <body className={`${pretendard.className} bg-white md:bg-[#dde0e5]`}>
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <ReduxProvider>
            {children}
            <Modal />
            <Confirm />
            <Alert />
            <Loading />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
