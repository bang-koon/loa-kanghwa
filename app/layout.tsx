import { Metadata } from "next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ViewProvider } from "./lib/ViewContext";
import Header from "./components/Header/Header";

export const metadata: Metadata = {
  title: "로아쿤 - 재련 계산기 & 레이드 보상 정보",
  description:
    "로스트아크(로아) 재련 비용 계산기와 최신 레이드(발탄, 비아키스, 카멘 등) 보상 정보를 한눈에 확인하세요. 강화 비용, 재료, 골드 보상을 모두 제공합니다.",
  keywords: [
    "로스트아크",
    "로아",
    "재련",
    "강화",
    "재련 비용 계산기",
    "레이드",
    "레이드 보상",
    "발탄",
    "비아키스",
    "쿠크세이튼",
    "아브렐슈드",
    "일리아칸",
    "카멘",
    "에키드나",
    "베히모스",
    "에기르",
    "모르둠",
    "아르모체",
    "카제로스",
  ],
  openGraph: {
    title: "로아쿤 - 재련 계산기 & 레이드 보상 정보",
    description: "로아 재련 비용 계산과 최신 레이드 보상 정보를 한눈에!",
    url: "https://loa-koon.co.kr",
    siteName: "로아쿤",
    images: [
      {
        url: "https://loa-koon.co.kr/logo.png",
        width: 200,
        height: 200,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "로아쿤 - 재련 계산기 & 레이드 보상 정보",
    description: "로아 재련 비용 계산과 최신 레이드 보상 정보를 한눈에!",
    images: ["https://loa-koon.co.kr/logo.png"],
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
    <html lang="ko">
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
