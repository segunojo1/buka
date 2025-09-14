"use client";

import useAppStore, { Spot } from "@/store/app.store";
import { MapPin } from "lucide-react";
import React, { useEffect, useRef } from "react";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const Maps = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { searchSpotsResult } = useAppStore();

  useEffect(() => {
    if (!mapContainer.current || !searchSpotsResult?.spots?.length) return;

    // Initialize map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [
          searchSpotsResult.spots[0].location.longitude,
          searchSpotsResult.spots[0].location.latitude
        ],
        zoom: 12
      });

      // Add navigation control (the +/- zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Add markers for each spot
    searchSpotsResult.spots.forEach((spot) => {
      if (!map.current) return;
      
      // Create a marker
      new mapboxgl.Marker({
        color: "#FF6B6B"
      })
        .setLngLat([spot.location.longitude, spot.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${spot.name}</h3>
                <p class="text-sm">${spot.address || 'No address provided'}</p>
                ${spot.rating ? `<p class="text-yellow-500">⭐ ${spot.rating}/5</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [searchSpotsResult]);

  if (!searchSpotsResult?.spots?.length) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No locations to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="h-[600px] w-full rounded-lg overflow-hidden"
    />
  );
};

export default Maps;
