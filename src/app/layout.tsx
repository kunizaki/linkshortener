import React from "react";
import type { Metadata } from "next";
import './global.css'
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Link shortener manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ backgroundColor: '#000000', color: '#ffffff'}}>
        <div style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100dvh', textAlign: 'center'}}>
          <h1>Sistema encurtador de links</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
