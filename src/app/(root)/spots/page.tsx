"use client";

import Maps from "@/components/maps";
import SpotCard from "@/components/spots/spot-card";
import useAppStore from "@/store/app.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import appService from "@/services/app.service";
import { Spot } from "@/store/app.store";
import { handleLocationAccess } from "@/lib/utils";
import Link from "next/link";

const Spots = () => {
  const router = useRouter();
  const { location, setLocation, setLoadingSearchedSpots, setSearchSpotsResult } = useAppStore();
  const [spots, setSpots] = React.useState<Spot[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([0, 0]);
  const [isListExpanded, setIsListExpanded] = React.useState(false);

  const toggleList = useCallback(() => {
    setIsListExpanded(prev => !prev);
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    // router.push(`/spots/${id}`);
    if (window.innerWidth < 768) {
      setIsListExpanded(false);
    }
  }, [router]);

  const fetchNearbySpots = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get user's current location first
      try {
        const coords = await handleLocationAccess();
        setLocation(coords);
        
        // Fetch nearby spots using the location
        const result = await appService.getNearbySpots({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        
        setSearchSpotsResult(result);
        setSpots(result.data || []);
      } catch (error) {
        console.error('Error getting location or spots:', error);
        toast.error('Failed to load nearby spots');
      }
    } catch (error) {
      console.error('Error in fetchNearbySpots:', error);
      toast.error('An error occurred while loading spots');
    } finally {
      setLoading(false);
      setLoadingSearchedSpots(false);
    }
  }, [setLocation, setSearchSpotsResult, setLoadingSearchedSpots]);

  useEffect(() => {
    fetchNearbySpots();
  }, [fetchNearbySpots]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Toggle button for mobile */}
      <button 
        onClick={toggleList}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-white p-3 rounded-full shadow-lg"
        aria-label={isListExpanded ? 'Hide list' : 'Show list'}
      >
        {isListExpanded ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar with spots list */}
      <div 
        className={`${isListExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                   fixed md:relative inset-y-0 left-0 z-40 w-full md:w-96 lg:w-1/3 xl:w-1/4 bg-white overflow-y-auto transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-800">Nearby Spots</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchNearbySpots}
                className="p-2 rounded-full hover:bg-stone-100"
                aria-label="Refresh spots"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={toggleList}
                className="md:hidden p-2 rounded-full hover:bg-stone-100"
                aria-label="Close list"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <button className="flex items-center justify-center gap-x-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200">
              <span>Price Range</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : spots.length > 0 ? (
              spots.map((spot) => (
                <Link key={spot.id} href={`/spots/${spot.id}`}>
                <SpotCard 
                  key={spot.id} 
                  spot={{
                    id: spot.id,
                    name: spot.name,
                    address: spot.address,
                    distanceKm: spot.distanceKm,
                    rating: spot.averageRating || 0,
                    reviewCount: spot.reviewCount || 0,
                    priceRange: spot.priceRange ? '$'.repeat(Math.min(spot.priceRange, 5)) : '$$',
                    isOpen: true,
                    specialties: spot.specialties || [],
                    phoneNumber: spot.phoneNumber || '',
                    averageRating: spot.averageRating || 0,
                  }} 
                  onViewDetails={handleViewDetails}
                />
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No spots found nearby</p>
                <button 
                  onClick={fetchNearbySpots}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map container */}
      <div className={`${isListExpanded ? 'hidden md:flex' : 'flex'} flex-1`}>
        <Maps />
      </div>
    </div>
  );
};

export default Spots;
