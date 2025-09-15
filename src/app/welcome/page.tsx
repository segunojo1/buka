import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-dark)]">
      <div className="max-w-md w-full p-6 md:p-8">
        <div className="flex flex-col items-center">
           <div className="mb-8">
            <svg
              className="h-24 w-24 text-[var(--primary-color)]"
              fill="none"
              height="96"
              viewBox="0 0 96 96"
              width="96"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
               d="M48 12C32.96 12 21 23.96 21 39C21 51.56 34.6 65.68 46.24 75.8C47.24 76.64 48.76 76.64 49.76 75.8C61.4 65.68 75 51.56 75 39C75 23.96 63.04 12 48 12Z"
                fill="url(#paint0_linear_1_2)"
              ></path>
              <path
                d="M48 48C52.9706 48 57 43.9706 57 39C57 34.0294 52.9706 30 48 30C43.0294 30 39 34.0294 39 39C39 43.9706 43.0294 48 48 48Z"
                fill="white"
              ></path>
              <path
                d="M60 63C60 61.3431 58.6569 60 57 60H39C37.3431 60 36 61.3431 36 63V63C36 64.6569 37.3431 66 39 66H57C58.6569 66 60 64.6569 60 63V63Z"
                fill="url(#paint1_linear_1_2)"
              ></path>
              <path
                d="M72 69C72 67.3431 70.6569 66 69 66H27C25.3431 66 24 67.3431 24 69V69C24 70.6569 25.3431 72 27 72H69C70.6569 72 72 70.6569 72 69V69Z"
                fill="url(#paint2_linear_1_2)"
              ></path>
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint0_linear_1_2"
                  x1="48"
                  x2="48"
                  y1="12"
                  y2="84"
                >
                  <stop stop-color="#E57A44"></stop>
                  <stop offset="1" stop-color="#F4A261"></stop>
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint1_linear_1_2"
                  x1="48"
                  x2="48"
                  y1="60"
                  y2="66"
                >
                  <stop stop-color="#D16A3D"></stop>
                  <stop offset="1" stop-color="#E58D48"></stop>
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint2_linear_1_2"
                  x1="48"
                  x2="48"
                  y1="66"
                  y2="72"
                >
                  <stop stop-color="#BC5F36"></stop>
                  <stop offset="1" stop-color="#D17C41"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-6xl font-bold tracking-tight text-[var(--text-dark)] [font-family:var(--font-ojuju)]">
            Buka
          </h1>
          <p className="mt-3 text-xl text-[var(--text-light)] text-center [font-family:var(--font-ojuju)]">
            Discover vibrant spaces, find your perfect crowd.
          </p>
        </div>
        <div className="mt-12 !space-y-4">
          <Link href="/auth/register" className="flex ">
            <Button className="flex w-full h-full bg-[var(--primary-color)] px-5 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--secondary-color)] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]">
              Register
            </Button>
          </Link>
          <Link href="/auth/login" className="flex">
            <Button className="flex w-full h-full bg-[var(--primary-color)] px-5 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--secondary-color)] focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]">
              Login
            </Button>
          </Link>{" "}
        </div>
      </div>
      <footer className="absolute bottom-6 text-center text-sm text-[var(--text-light)]">
        <p>© {new Date().getFullYear()} Buka. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
