"use client";

import SearchAmala from "@/components/home/search-amala";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle } from "lucide-react";
import FeaturedSpots from "@/components/home/featured-spots";
import WhyChoose from "@/components/home/why-choose";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans ">
      <div
        className="flex min-h-screen flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-center justify-center p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("/test-bg.jpg")`,
        }}
      >
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-white text-5xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-bold @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
            Discover the Best Amala Spots Near You
          </h1>
          <h2 className="text-stone-200 text-lg font-normal leading-normal @[480px]:text-xl @[480px]:font-normal @[480px]:leading-normal">
            Find your favorite amala joints and explore new ones across Nigeria.
          </h2>

        </div>
        <div className="flex items-center gap-5 mt-10">
          <Button
            variant="hero"
            size="lg"
            className="text-lg font-semibold px-10 py-5 h-auto rounded-full"
          >
            <MapPin className="w-5 h-5 mr-3" />
            Find Spots Near Me
          </Button>
          <Link href="/chat">
          <Button
            variant="outline"
            size="lg"
            className="text-lg font-semibold px-10 py-5 h-auto rounded-full border-2 border-primary-foreground/80 text-[#000000] hover:bg-primary-foreground/10 hover:border-primary-foreground backdrop-blur-sm"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Ask Buka Chat
          </Button>
          </Link>
        </div>
      </div>

      <SearchAmala />
      
      <FeaturedSpots />

      <WhyChoose />
    </div>
  );
}
