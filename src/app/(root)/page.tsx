"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import useAppStore, { Spot } from "@/store/app.store";
import { handleLocationAccess } from '@/lib/utils';
import Maps from "@/components/maps";
import appService from "@/services/app.service";
import Link from "next/link";
import SpotCard from "@/components/spots/spot-card";

export default function Home() {
  const { 
    user, 
    setLoadingSearchedSpots, 
    setSearchSpotsResult, 
    searchSpotsResult, 
    setLocation 
  } = useAppStore();
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchLocationAndSpots = async () => {
      try {
        setLoadingSearchedSpots(true);
        
        // First, try to get the current location
        try {
          const coords = await handleLocationAccess();
          if (!isMounted) return;
          
          setLocation(coords);
          
          // Only proceed with the API call if we have valid coordinates
          if (coords.latitude && coords.longitude) {
            const result = await appService.getNearbySpots({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
            
            if (isMounted) {
              setSearchSpotsResult(result);
            }
          }
        } catch (error) {
          console.error('Geolocation error:', error);
          if (isMounted) {
            toast.error(error instanceof Error ? error.message : 'Failed to access your location');
            // Set empty results on error with proper SearchResult type
            setSearchSpotsResult({ 
              data: [],
              page: 1,
              pageSize: 10,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false
            });
          }
        }
      } catch (error) {
        console.error('Failed to get nearby spots:', error);
        if (isMounted) {
          toast.error('Failed to get nearby spots. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoadingSearchedSpots(false);
        }
      }
    };

    fetchLocationAndSpots();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [setLocation, setLoadingSearchedSpots, setSearchSpotsResult]);
  
  return (
    <div> 
          

      <main className="px-6 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-12">
        <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
          <div className="px-4 pb-10 pt-5">
            <h2 className="text-[var(--brand-text-primary)] tracking-tight text-4xl md:text-5xl  ">
              Welcome back, <span className='font-ojuju font-bold'>{user?.firstName}</span>
            </h2> 
            <p className="text-[var(--brand-text-secondary)] mt-2 text-lg [font-family:var(--font-jakarta)]">
              Here's a snapshot of what's happening around you.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            <div className="lg:col-span-2 bg-[var(--surface-white)] rounded-2xl p-6 flex flex-col gap-6 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-[var(--brand-text-primary)] font-ojuju">
                  Your Location
                </h3>
                <div className="flex items-center gap-2 text-sm text-[var(--brand-text-secondary)]">
                  <span className="material-symbols-outlined text-lg text-[var(--brand-primary)]">
                    location_on
                  </span>
                  <span className="font-medium">Lagos, Nigeria</span>
                </div>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden aspect-video">
                <Maps />
              </div>
            </div>
            <div className="bg-[var(--surface-white)] rounded-2xl p-6 flex flex-col gap-6 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-[var(--brand-text-primary)] ">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-4">
                <Link
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--brand-secondary)] hover:bg-opacity-70 transition-colors"
                  href="/spots"  
                >
                  <span className="material-symbols-outlined text-2xl text-[var(--brand-primary)]">
                    near_me
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--brand-text-primary)]">
                      Nearby Spots
                    </h4>
                    <p className="text-sm text-[var(--brand-text-secondary)]">
                      Discover spots near you
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[var(--brand-text-secondary)] opacity-50">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--brand-secondary)] hover:bg-opacity-70 transition-colors"
                  href="/"
                >
                  <span className="material-symbols-outlined text-2xl text-[var(--brand-primary)]">
                    signal_cellular_alt
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--brand-text-primary)]">
                      Busyness Check
                    </h4>
                    <p className="text-sm text-[var(--brand-text-secondary)]">
                      Check how busy a spot is
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[var(--brand-text-secondary)] opacity-50">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--brand-secondary)] hover:bg-opacity-70 transition-colors"
                  href="/chat"
                >
                  <span className="material-symbols-outlined text-2xl text-[var(--brand-primary)]">
                    smart_toy
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--brand-text-primary)]">
                      AI Assistant
                    </h4>
                    <p className="text-sm text-[var(--brand-text-secondary)]">
                      Chat with Buka to get recommendations
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[var(--brand-text-secondary)] opacity-50">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="p-4 mt-8">
            <h3 className="text-2xl font-bold text-[var(--brand-text-primary)] mb-6">
              Trending Locations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {
                searchSpotsResult?.data?.length <= 0 && (
                  <p>No spots found</p>
                )
              }
            {searchSpotsResult?.data?.map((spot: Spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onViewDetails={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// export const TrendingLocation = () => {
//   return (
//     <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
//       <div
//         className="h-48 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url(https://lh3.googleusercontent.com/aida-public/AB6AXuD9PwtuwnNljxYw2NpQiwvtEUZbX31YE08r05gKVVyQ_-niksObeegl_KdEPInma3HA2un_sdqxiIEupX6nAkSro_9arQ749aXDYDl06Iu7LidGKQDXyDqkVam-fZID635gv2eIlfUPBRvK0Rbd2v4jc-OJaCuC56G0sLyQefnqMu9lIO3lYXtMtHRpCPucO6xKhOB7HPzEEWUaDbi1cIBCnBErLsox9U5Jt-LZPKfVMbUyzLQ9oBq8nPmcIyBg9PdvF5jLzklo1cXu)",
//         }}
//       ></div>
//       <div className="p-5">
//         <h4 className="font-bold text-lg text-[var(--brand-text-primary)]">
//           Nike Art Gallery
//         </h4>
//         <p className="text-sm text-[var(--brand-text-secondary)] mt-1">
//           Lekki, Lagos
//         </p>
//         <div className="flex items-center justify-between mt-4">
//           <div className="flex items-center gap-2 text-[var(--brand-primary)]">
//             <span className="material-symbols-outlined text-xl">
//               local_fire_department
//             </span>
//             <span className="font-bold text-sm">Busy</span>
//           </div>
//           <a
//             className="text-[var(--brand-primary)] text-sm font-semibold hover:underline"
//             href="#"
//           >
//             View Details
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

{
  /* <div className="font-sans ">
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
          <Link href="/spots">
          <Button
            variant="hero"
            size="lg"
            className="text-lg font-semibold px-10 py-5 h-auto rounded-full"
          >
            <MapPin className="w-5 h-5 mr-3" />
            Find Spots Near Me
          </Button>
          </Link>
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
    </div> */
}
