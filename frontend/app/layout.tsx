import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from 'next/font/google'

const inter = Outfit({subsets: ['latin']})

export const metadata: Metadata = {
  title: "CashTrackr",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
