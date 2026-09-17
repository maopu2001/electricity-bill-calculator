import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoltCalc — BERC Residential (LT-A) Electricity Bill Calculator",
  description: "Calculate your monthly electricity bill based on the Bangladesh Energy Regulatory Commission (BERC) Residential (LT-A) tariff schedule.",
  authors: [{ name: "M. Aktaruzzaman Opu", url: "https://maopu.com.bd" }],
  creator: "M. Aktaruzzaman Opu",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  window.__EBC_INIT__ = {
                    mode: localStorage.getItem('ebc-mode') || 'units',
                    units: localStorage.getItem('ebc-units') || '150',
                    amount: localStorage.getItem('ebc-amount') || '1500',
                    demand: localStorage.getItem('ebc-demand') || '1'
                  };
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider delay={200}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
