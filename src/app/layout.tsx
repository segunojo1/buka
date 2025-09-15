import type { Metadata } from "next";
import { Ojuju, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

// Initialize the font with desired weights and subsets
const ojuju = Ojuju({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ojuju',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "Buka",
  description: "Find Amala",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ojuju.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <NextTopLoader color="#b26834"/>
        {children}
        <Toaster />
      </body>
    </html> 
  );
}
