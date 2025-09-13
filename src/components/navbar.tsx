"use client";

import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const route = usePathname();
console.log(route);

  return (
    <nav className=" bg-white shadow-md">
      <div className="max-w-7xl flex items-center justify-between p-7 mx-auto">
        <Logo />
        <ul className="flex space-x-16">
          <li>
            <Link href="/" className={`font-semibold text-lg ${route === "/" ? "text-[#ea9462]" : "text-black"}`}>
              Home 
            </Link>
          </li>
          <li>
            <Link href="/search" className={`font-semibold text-lg ${route === "/search" ? "text-[#ea9462]" : "text-black"}`}>
              Search
            </Link>
          </li>
          <li>
            <Link href="/chat" className={`font-semibold text-lg ${route === "/chat" ? "text-[#ea9462]" : "text-black"}`}>
              Chat
            </Link>
          </li>
          <li>
            <Link href="/spots" className={`font-semibold text-lg ${route === "/spots" ? "text-[#ea9462]" : "text-black"}`}>
              Spots
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
