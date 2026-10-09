import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paul Space Combat",
  description: "Paul Space Combat — A fast-paced 2D browser space combat arcade shooter built with Next.js, TypeScript, and HTML5 Canvas.",
  authors: [{ name: "Paul" }],
  keywords: ["Paul Space Combat", "Space Combat", "Paul", "Arcade Shooter", "Next.js Game", "Canvas 2D"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-space-darkest text-slate-100 antialiased overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
