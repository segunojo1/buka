"use client";

import useAppStore from "@/store/app.store";
import { MapPin, Pin } from "lucide-react";
import React, { useState } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';
import { GoogleMap, InfoWindow, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";

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


const Maps = () => {
  const { searchSpotsResult, loadingSearchedSpots } = useAppStore();
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  if (!isLoaded) {
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
  }
  if (loadingSearchedSpots) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (!searchSpotsResult?.data?.length) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No locations to display on map</p>
        </div>
      </div>
    );
  }

  // Center map around first spot
  const center = {
    lat: searchSpotsResult.data[0].latitude,
    lng: searchSpotsResult.data[0].longitude,
  };

  return (
            <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || defaultCenter}
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
        {/* Render all spots */}
        {searchSpotsResult.data.map((spot) => (
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
              <p className="text-sm text-gray-600">Rating: {selectedSpot.averageRating} ({selectedSpot.reviewCount} reviews)</p>
              {selectedSpot.specialties && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Specialties: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSpot.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
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
  );
};

export default Maps;
