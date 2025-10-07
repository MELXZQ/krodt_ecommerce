import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nike",
  description: "An e-commerce platform for Nike shoes by KroDT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${jost.className} antialiased`}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
