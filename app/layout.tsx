import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFloatingButtons from "@/components/ConditionalFloatingButtons";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "المحترفون – تخريم وقص الخرسانة بجدة، مكة والطايف | قص خرسانة وفتح كور",
  description:
    "المحترفون متخصصون في تخريم وقص الخرسانة بجدة، مكة والطايف. قص خرسانة، تخريم كور، قص جدران بالمنشار الليزر، فتحات مصاعد وفتحات كور بدقة وسرعة عالية. خدمة 24 ساعة.",
  keywords: [
    "قص خرسانة",
    "قص خرسانة بجدة",
    "قص خرسانة في جدة",
    "تخريم خرسانة",
    "تخريم خرسانة بجدة",
    "تخريم خرسانة في جدة",
    "قص جدران بالمنشار الليزر",
    "قص جدران بالمنشار الليزر بجدة",
    "عمل فتحات للمصاعد",
    "عمل فتحات للمصاعد بجدة",
    "عمل فتحات كور",
    "عمل فتحات كور بجدة",
    "فتح كور",
    "فتح كور بجدة",
    "شركة قص خرسانة",
    "شركة قص خرسانة بجدة",
    "شركة تخريم خرسانة",
    "شركة تخريم خرسانة بجدة",
    "قص وتخريم الخرسانة",
    "قص وتخريم الخرسانة بجدة",
    "قص خرسانة مكة",
    "تخريم خرسانة مكة",
    "قص جدران بالمنشار الليزر مكة",
    "فتح كور مكة",
    "عمل فتحات للمصاعد مكة",
    "عمل فتحات كور مكة",
    "قص خرسانة الطايف",
    "تخريم خرسانة الطايف",
    "قص جدران بالمنشار الليزر الطايف",
    "فتح كور الطايف",
    "عمل فتحات للمصاعد الطايف",
    "عمل فتحات كور الطايف"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* TrustedTypes Fix */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window!=='undefined'&&window.trustedTypes&&window.trustedTypes.createPolicy){try{window.trustedTypes.createPolicy('default',{createHTML:function(s){return s},createScript:function(s){return s},createScriptURL:function(u){return u}})}catch(e){console.warn('Trusted Types policy failed:',e)}}})();`,
          }}
        />
        {/* Google Tag Manager (AW-17727676448) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17727676448"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17727676448');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#FFDD00] focus:text-black focus:font-bold focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ConditionalFloatingButtons />
        </LanguageProvider>
      </body>
    </html>
  );
}
