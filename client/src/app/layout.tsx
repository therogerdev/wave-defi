import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import HeaderApp from "@/components/HeaderApp";
import BackgroundEffect from "@/components/BackgroundEffect";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WaveDeFi",
  description: "Dapp for WaveDeFi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <BackgroundEffect />
          </div>

          <div className="relative z-20">
            <HeaderApp />
          </div>

          <main className="relative z-10 container mx-auto px-4 md:px-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
