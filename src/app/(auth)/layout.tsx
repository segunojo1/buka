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
      className={`${geistSans.variable} ${geistMono.variable} antialiased auth-container`}
    >
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <Logo />
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/test-bg.jpg"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout;
