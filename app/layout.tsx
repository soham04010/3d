import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
