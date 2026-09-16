import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Combat — by Paul Oyeleye",
  description: "A fast-paced 2D arcade space combat web game built with Next.js, TypeScript, and HTML5 Canvas by Paul Oyeleye.",
  authors: [{ name: "Paul Oyeleye" }],
  keywords: ["Space Combat", "Paul Oyeleye", "Arcade Shooter", "Next.js Game", "Canvas 2D"],
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
