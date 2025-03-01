import BackgroundEffect from "@/components/BackgroundEffect";
import HeaderApp from "@/components/HeaderApp";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/config/Web3Provider";
import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

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
        suppressHydrationWarning
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
      >
        <Web3Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative">
              <div className="absolute inset-0 overflow-hidden">
                <BackgroundEffect />
              </div>
              <div className="absolute inset-x-0 h-16 z-[9999]">
                <HeaderApp />
              </div>
              <div className="relative w-full min-h-screen md:h-screen">
                {" "}
                {children}
              </div>
            </div>
          </ThemeProvider>
          <Toaster position="top-center" duration={10000} />
        </Web3Provider>
      </body>
    </html>
  );
}
