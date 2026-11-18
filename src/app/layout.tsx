import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GearVault | Rent the Right Gear",
  description:
    "Rent the right gear. Skip the cost of owning it. Explore equipment and rent from trusted owners with GearVault.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}