import BackgroundEffect from "@/components/BackgroundEffect";
import HeaderApp from "@/components/HeaderApp";
import { ThemeProvider } from "@/components/theme-provider";
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
            <div className="absolute inset-0 -z-10">
              <BackgroundEffect />
            </div>

            <div className=" absolute top-0 inset-x-0 z-50">
              <HeaderApp />
            </div>

            <main className="relative h-screen  overflow-hidden">
              {children}
            </main>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
