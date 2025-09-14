"use client";

import useAppStore from "@/store/app.store";
import { MapPin } from "lucide-react";
import React, { useState } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";

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
  const { searchSpotsResult } = useAppStore();
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

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

  // Center map around first spot
  const center = {
    lat: searchSpotsResult.spots[0].location.latitude,
    lng: searchSpotsResult.spots[0].location.longitude,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
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
        {searchSpotsResult.spots.map((spot: any) => (
          <Marker
            key={spot.id}
            position={{
              lat: spot.location.latitude,
              lng: spot.location.longitude,
            }}
            onClick={() => setSelectedSpot(spot)}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ))}

        {/* Info window when a spot is clicked */}
        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.location.latitude,
              lng: selectedSpot.location.longitude,
            }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedSpot.name}</h3>
              <p className="text-sm">
                {selectedSpot.address || "No address provided"}
              </p>
              {selectedSpot.rating && (
                <p className="text-yellow-500">⭐ {selectedSpot.rating}/5</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Maps;
