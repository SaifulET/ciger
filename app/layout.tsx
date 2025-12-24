import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // include the weights you use
  variable: "--font-poppins", // optional: CSS variable name
});
export const metadata: Metadata = {
  title: "Smokenza Dashboard | Admin Portal",
  description: "Comprehensive dashboard for managing Smokenza operations, analytics, and administration",
  keywords: ["dashboard", "admin", "smokenza", "management", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"className={poppins.variable}>
      <body
       
      >
        
        {children}
      </body>
    </html>
  );
}
