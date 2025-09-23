"use client";

import React, { useState, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import useAppStore, { Spot } from "@/store/app.store";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "0.5rem",
  overflow: "hidden",
};

// Default center (Lagos)
const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

const Maps: React.FC = () => {
  const { searchSpotsResult, loadingSearchedSpots, location } = useAppStore();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["places"],
  });

  // Determine the center of the map
  const center = useMemo(() => {
    if (searchSpotsResult?.data?.length) {
      return {
        lat: searchSpotsResult.data[0].latitude,
        lng: searchSpotsResult.data[0].longitude,
      };
    }
    if (location?.latitude && location?.longitude) {
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    return defaultCenter;
  }, [searchSpotsResult, location]);

  // Show loading state while map is loading
  if (!isLoaded || loadingSearchedSpots) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* Only render markers if we have spots */}
        {searchSpotsResult?.data?.map((spot) => (
          <Marker
            key={spot.id}
            position={{
              lat: spot.latitude,
              lng: spot.longitude,
            }}
            onClick={() => setSelectedSpot(spot)}
            icon={{
              url: "/amala-icon.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {/* Info window when a spot is clicked */}
        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.latitude,
              lng: selectedSpot.longitude,
            }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2">
              <h3 className="font-medium">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-600">{selectedSpot.address}</p>
              <p className="text-sm text-gray-600">
                Rating: {selectedSpot.averageRating} ({selectedSpot.reviewCount} reviews)
              </p>
              {selectedSpot.specialties && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Specialties: </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedSpot.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Maps;
