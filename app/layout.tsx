import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "DANG SODA | Gen Z Desi Pop",
  description: "A Gen-Z desi pop beverage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full antialiased cursor-none`}
    >
      <body className="min-h-full flex flex-col font-sans cursor-none">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
