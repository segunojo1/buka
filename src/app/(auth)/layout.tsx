import Logo from "@/components/logo";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full ">

      </div>
          <div>{children}</div>
      </div>
    </main>
  );
};

export default Layout;
