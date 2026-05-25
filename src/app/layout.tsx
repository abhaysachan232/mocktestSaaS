import type { Metadata } from "next";

import "./globals.css";

import AuthProvider from "../providers/SessionProvider";

export const metadata: Metadata = {
  title: "Coaching SaaS",

  description:
    "Online Mock Test Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}