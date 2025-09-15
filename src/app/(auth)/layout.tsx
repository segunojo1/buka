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
      <div className="layout-container flex h-full grow flex-col ">
        <header className="flex items-center justify-center whitespace-nowrap px-10 py-6">
          <div className="flex items-center gap-3 text-buka-black">
            <svg
              fill="none"
              height="48"
              viewBox="0 0 48 48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4Z"
                fill="#EC8013"
              ></path>
              <path
                d="M24 13C17.9249 13 13 17.9249 13 24C13 30.0751 17.9249 35 24 35C30.0751 35 35 30.0751 35 24C35 20.3713 32.8107 17.2215 29.6997 15.6511"
                stroke="#F4F2F0"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              ></path>
            </svg>
            <h1 className="font-ojuju text-4xl font-bold tracking-tighter">Buka</h1>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      </div>
    </main>
  );
};

export default Layout;
