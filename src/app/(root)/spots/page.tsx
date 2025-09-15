"use client";

import Maps from "@/components/maps";
import SpotCardNew from "@/components/spots/spot-card-new";
import useAppStore from "@/store/app.store";
import React, { useEffect } from "react";
import { toast } from "sonner";

const Spots = () => {
  const {location, setLocation} = useAppStore();
  const onLocationSuccess = (coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
  };

  const onLocationError = (error: GeolocationPositionError) => {
    console.error('Error accessing geolocation:', error);
    toast.error('Failed to access your location');
  };

  useEffect(() => {
    
  }, [])
  return (
    <div className="w-full flex-1">
      <div className="flex p-6 ">
        <div className="w-2/3">
          <Maps />
        </div>
        <div className=" hidden lg:block w-1/3 bg-white p-6 overflow-y-auto h-[calc(100vh-68px)]">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-xl font-bold text-stone-800">Nearby Spots</h2>
              <div className="flex-1 border-t border-stone-200"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center justify-center gap-x-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200">
                <span>Price Range</span>
                <span className="material-symbols-outlined text-base">
                  {" "}
                  expand_more{" "}
                </span>
              </button>
              <button className="flex items-center justify-center gap-x-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200">
                <span>Rating</span>
                <span className="material-symbols-outlined text-base">
                  {" "}
                  expand_more{" "}
                </span>
              </button>
              <button className="flex items-center justify-center gap-x-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200">
                <span>Verified</span>
                <span className="material-symbols-outlined text-base">
                  {" "}
                  expand_more{" "}
                </span>
              </button>
            </div>  
          </div>

          <div className="space-y-4 mt-4 ">
            <SpotCardNew />
            <SpotCardNew />
            <SpotCardNew />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spots;
