import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>로아쿤 - 로스트아크 재련 비용 계산기</title>
        <meta name="description" content="로아 재련 비용 계산기" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta property="og:site_name" content="로아쿤" />
        <meta property="og:locale" content="ko_KR" />
        <meta
          property="og:title"
          content="로아쿤 - 로스트아크 재련 비용 계산기"
        />
        <meta property="og:description" content="로아 재련 비용 계산기" />
        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://loa-koon.co.kr" />
        <meta
          name="twitter:title"
          content="로아쿤 - 로스트아크 재련 비용 계산기"
        />
        <meta name="twitter:description" content="로아 재련 비용 계산기" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=[${process.env.GA}]`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA}', {
                  page_path: window.location.pathname,
                });
                ga('send', 'pageview', location.pathname);
              `,
          }}
        />
      </Head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
