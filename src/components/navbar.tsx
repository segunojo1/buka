"use client";

import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Search, User } from "lucide-react";

const Navbar = () => {
  const route = usePathname();
  console.log(route);

  return (
    <header className="flex items-center sticky top-0 z-20 w-full bg-[#FAF7F4] py-4 backdrop-blur-lg shadow-sm">
      <div className=" container mx-auto flex items-center justify-between ">
        <div className="flex items-center  gap-5">
          <Logo />
          <div className="flex-1 justify-center hidden lg:flex">
            <nav className="flex items-center gap-4 bg-white/50 rounded-full px-6 py-2">
              <Link
                className="flex items-center gap-2 text-[var(--brand-text-primary)] font-semibold text-sm px-4 py-2 rounded-full bg-[var(--brand-secondary)]"
                href="/"
              >
                <span className="material-symbols-outlined">home</span>
                <span>Home</span>
              </Link>
              <Link
                className="flex items-center gap-2 text-[var(--brand-text-secondary)] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[var(--brand-secondary)]"
                href="/"
              >
                <span className="material-symbols-outlined">explore</span>
                <span>Discovery</span>
              </Link>
              <Link
                className="flex items-center gap-2 text-[var(--brand-text-secondary)] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[var(--brand-secondary)]"
                href="/"
              >
                <span className="material-symbols-outlined">reviews</span>
                <span>Reviews</span>
              </Link>
              <Link
                className="flex items-center gap-2 text-[var(--brand-text-secondary)] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[var(--brand-secondary)]"
                href="/"
              >
                <span className="material-symbols-outlined">heatmap</span>
                <span>Heatmap</span>
              </Link>
            </nav>
          </div>
        </div>
      <User />
      </div>

    </header>
  );
};

export default Navbar;

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
