import type { Metadata } from "next";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TMAS - The Math and Science Academy",
  description: "Free, high-quality math and science resources for students. Access 7 ACE series study guides and join our community of 500+ learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
