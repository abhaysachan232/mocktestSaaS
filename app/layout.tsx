import type { Metadata } from "next";

import "./globals.css";

import AuthProvider from "../providers/SessionProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "Coaching SaaS",

  description: "Online Mock Test Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black">
        <Header/>

        <AuthProvider>{children}</AuthProvider>
        <Footer/>
      </body>
    </html>
  );
}
