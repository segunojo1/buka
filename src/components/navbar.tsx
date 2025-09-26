"use client";

import React, { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown, Menu, X } from "lucide-react";
import ProfileDrop from "./profile-drop";
// import {
//   SimpleDropdown as DropdownMenu,
//   SimpleDropdownContent as DropdownMenuContent,
//   SimpleDropdownItem as DropdownMenuItem,
//   SimpleDropdownLabel as DropdownMenuLabel,
//   SimpleDropdownSeparator as DropdownMenuSeparator,
//   SimpleDropdownTrigger as DropdownMenuTrigger,
// } from "@/components/ui/simple-dropdown";



const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const links = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/spots", label: "Spots", icon: "explore" },
    { href: "/", label: "Reviews", icon: "reviews" },
    { href: "/chat", label: "Chat", icon: "smart_toy" },
  ];

  const linkClass = (href: string) =>
    `flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 ${
      pathname === href
        ? "bg-[var(--brand-secondary)] text-[var(--brand-text-primary)]"
        : "text-[var(--brand-text-secondary)] hover:bg-[var(--brand-secondary)]"
    }`;

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 rounded"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-20 w-full bg-[#FAF7F4]/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-7">
          <div className="flex items-center justify-between py-3">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <Logo />
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2 bg-white/60 rounded-full px-2 py-1" aria-label="Primary">
              {links.map((l) => (
                <Link key={l.label} href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right: Profile + mobile menu button */}
            <div className="flex items-center gap-2">
              <ProfileDrop />
              <button
                ref={menuButtonRef}
                className="lg:hidden inline-flex items-center justify-center rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-controls="mobile-menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-[max-height,opacity] duration-300 overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-7 pb-4" aria-label="Mobile Primary">
            <ul className="rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5 p-2">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`flex items-center rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 ${
                      pathname === l.href ? "bg-[var(--brand-secondary)]" : "hover:bg-stone-100"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
//currenly installing npm so takes some secs ..some time basicall
{
  /* <nav className=" sticky top-0 z-20 w-full bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <Logo />
        <div className="relative w-full max-w-[500px]">
          <Search className=" absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <Input
            className="w-full form-input max-w-[700px] rounded-full border-stone-200 bg-stone-100 py-2 pl-10 pr-4 text-stone-900 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500"
            placeholder="Spot Search"
          />
        </div>

        <User /> 
      </div>
    </nav> */
}
