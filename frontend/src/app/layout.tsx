import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AudioProvider } from "@/components/audio elements/AudioContext";
import { GlobalProvider } from "@/components/global/GlobalContext";
import SystemAlertHandler from "@/components/common/alerts/SystemAlertHandler";
import Header from "@/components/header/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Music Streaming App",
  description: "Stream your my favorite music",
};
export const viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#111827",
    } /* 1f2937 111827 */,
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

// TODO PLAY Song in loop (audioRef.current.loop)
// TODO Audio visuliser

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
          <AudioProvider>
            <Header />
            <main>{children}</main>
            <SystemAlertHandler />
          </AudioProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
