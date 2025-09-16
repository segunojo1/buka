"use client";
import Navbar from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="[font-family:var(--font-jakarta)]">
      <Navbar />
      {children}
    </main>
  );
}
