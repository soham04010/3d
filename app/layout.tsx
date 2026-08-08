import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

const cascadia = localFont({
  src: [
    {
      path: "./fonts/CascadiaMono-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/CascadiaMono-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-cascadia",
});

const chivo = localFont({
  src: [
    {
      path: "./fonts/ChivoMono-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/ChivoMono-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-chivo",
});

export const metadata: Metadata = {
  title: "DANG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${cascadia.variable} ${chivo.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
