import { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ClientProvider from "./lib/ClientProvider";
import { ViewProvider } from "./lib/ViewContext";
import Header from "./components/Header/Header";

export const metadata: Metadata = {
  title: "로아쿤 - 로스트아크 재련 비용 계산기",
  description: "로아 재련 비용 계산기",
  openGraph: {
    title: "로아쿤 - 로스트아크 재련 비용 계산기",
    description: "로아 재련 비용 계산기",
    url: "https://loa-koon.co.kr",
    siteName: "로아쿤",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    title: "로아쿤 - 로스트아크 재련 비용 계산기",
    description: "로아 재련 비용 계산기",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7085791456313815" />
      </head>
      <body>
        <ViewProvider>
          <Header />
          <GoogleTagManager gtmId={`${process.env.GA}`} />
          <GoogleAnalytics gaId={`${process.env.GT}`} />
          {children}
          <SpeedInsights />
        </ViewProvider>
      </body>
    </html>
  );
}
