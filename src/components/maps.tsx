"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { 
  GoogleMap, 
  Marker, 
  useJsApiLoader, 
  InfoWindow, 
  OverlayView, 
  MarkerClusterer, 
  HeatmapLayer,
  useLoadScript,
  Libraries
} from "@react-google-maps/api";
import { Loader2, MapPin, Filter, Search, Star } from "lucide-react";
import useAppStore, { Spot, BusynessInfo } from "@/store/app.store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
  overflow: "hidden",
};

// Default center (Lagos)
const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

// Define the shape of a cluster
interface Cluster {
  position: {
    lat: () => number;
    lng: () => number;
  };
  getMarkers: () => Array<{
    position: {
      lat: () => number;
      lng: () => number;
    };
  }>;
}

// Custom cluster icon with better styling
const createClusterIcon = (count: number, size: number) => {
  // Calculate size based on the number of markers in the cluster
  const baseSize = Math.min(50, 30 + Math.sqrt(count) * 5);
  const fontSize = Math.min(16, 10 + Math.sqrt(count) * 2);
  
  return {
    url: `data:image/svg+xml;base64,${btoa(`
      <svg width="${baseSize}" height="${baseSize}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#3b82f6" fill-opacity="0.8" stroke="white" stroke-width="3" />
        <text x="50" y="50" text-anchor="middle" dy=".35em" fill="white" font-size="${fontSize}" font-weight="bold">
          ${count}
        </text>
      </svg>
    `)}`,
    size: new window.google.maps.Size(baseSize, baseSize),
    anchor: new window.google.maps.Point(baseSize / 2, baseSize / 2),
  };
};

// Custom pulsing user location marker
const UserLocationMarker = () => {
  const { location } = useAppStore();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  if (!location?.latitude || !location?.longitude) return null;

  return (
    <OverlayView
      position={{
        lat: location.latitude,
        lng: location.longitude,
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="relative">
        <div 
          className={`absolute -left-3 -top-3 h-6 w-6 rounded-full bg-blue-500 opacity-20 ${
            pulse ? 'animate-ping' : ''
          }`}
          style={{
            animationDuration: '1.5s',
          }}
        />
        <div className="relative z-10">
          <MapPin className="h-8 w-8 text-blue-600" fill="currentColor" />
        </div>
      </div>
    </OverlayView>
  );
};

// Custom spot marker component using google.maps Marker so it can be clustered
const SpotMarker = React.memo(
  ({ spot, onClick, clusterer }: { spot: Spot; onClick: (spot: Spot) => void; clusterer?: any }) => {
    const busynessLevel = spot.busyness?.currentLevel ?? 0; // 0-4
    // Map busyness to a colored dot using Marker label
    const busynessColorMap: Record<number, string> = {
      0: '#16a34a', // green
      1: '#3b82f6', // blue
      2: '#eab308', // yellow
      3: '#f97316', // orange
      4: '#ef4444', // red
    };
    const labelColor = busynessColorMap[Math.min(4, Math.max(0, busynessLevel))] || '#16a34a';

    // Icon config for your custom image
    const icon: google.maps.Icon = {
      url: '/amala-icon.png',
      scaledSize: new google.maps.Size(30, 30),
      anchor: new google.maps.Point(15, 15),
      labelOrigin: new google.maps.Point(26, 26), // bottom-right corner for the dot
    };

    return (
      <Marker
        position={{ lat: spot.latitude, lng: spot.longitude }}
        onClick={() => onClick(spot)}
        icon={icon}
        clusterer={clusterer}
        label={{ text: '•', color: labelColor, fontWeight: '700', fontSize: '18px' }}
        // Slightly raise zIndex with busyness so higher busyness draws on top
        zIndex={100 + busynessLevel}
      />
    );
  }
)

// Main Maps component with clustering and heatmap support
const Maps: React.FC = () => {
  const { searchSpotsResult, loadingSearchedSpots, location, setSelectedSpot, selectedSpot } = useAppStore();
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 10, // km
    showBusyOnly: false,
    categories: [] as string[],
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["places", "visualization"],
  });
  
  // Extract all unique categories when spots data changes
  useEffect(() => {
    if (searchSpotsResult?.data) {
      const categories = new Set<string>();
      searchSpotsResult.data.forEach(spot => {
        if (spot.categories) {
          spot.categories.forEach(cat => categories.add(cat));
        }
      });
      setAvailableCategories(Array.from(categories));
    }
  }, [searchSpotsResult]);

    // Calculate distance between two coordinates in km
    const getDistance = (coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}) => {
      const R = 6371; // Earth's radius in km
      const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
      const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

  // Filter spots based on current filters and search query
  const filteredSpots = useMemo(() => {
    if (!searchSpotsResult?.data) return [];
    
    return searchSpotsResult.data.filter((spot: Spot) => {
      
      
      // Filter by search query
      if (searchQuery && !spot.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        console.log('search query');
        
        return false;
      }
      
      // Filter by rating
      if ((spot.averageRating || 0) < filters.minRating) {
        console.log('rating');
        return false;
      } 
        
      
      // Filter by distance - API returns distance in meters, convert to km for comparison
      if (spot.distanceKm !== undefined) {
        // Use the distance from API response (converting meters to km)
        const distanceInKm = spot.distanceKm / 1000;
        if (distanceInKm > filters.maxDistance) {
          console.log('distance filter -', distanceInKm, 'km >', filters.maxDistance, 'km');
          return false;
        }
      } else if (location?.latitude && location?.longitude) {
        // Fallback to haversine calculation if distance not provided by API
        const distanceInKm = getDistance(
          { lat: location.latitude, lng: location.longitude },
          { lat: spot.latitude, lng: spot.longitude }
        );
        
        if (distanceInKm > filters.maxDistance) {
          console.log('distance fallback -', distanceInKm, 'km >', filters.maxDistance, 'km');
          return false;
        }
      }
      
      // Filter by busyness
      if (filters.showBusyOnly && (!spot.busyness || spot.busyness.currentLevel < 2)) {
        console.log('busyness');
        return false;
      }
      
      // Filter by categories
      if (filters.categories.length > 0 && spot.specialties) {
        const hasMatchingCategory = spot.specialties.some((cat: string) => 
          filters.categories.includes(cat)
        );
        if (!hasMatchingCategory) {
          console.log('category');
          return false;
        }
      }
      
      return true;
    });
  }, [searchSpotsResult, filters, location, searchQuery]);
  console.log(filteredSpots);
  
  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    return filteredSpots
      .filter(spot => spot.busyness?.currentLevel !== undefined)
      .map(spot => ({
        location: new google.maps.LatLng(spot.latitude, spot.longitude),
        weight: (spot.busyness?.currentLevel || 0) + 1
      }));
  }, [filteredSpots]);
  

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

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="h-full w-full relative">
      {/* Search and Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-2">
        {/* Search Bar */}
        <div className="relative flex-1 bg-white rounded-lg shadow-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search spots..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border-0 focus-visible:ring-2 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Toggle Button */}
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        
        {/* Heatmap Toggle Button */}
        <Button 
          variant={heatmapVisible ? "default" : "outline"}
          onClick={() => setHeatmapVisible(!heatmapVisible)}
          className="bg-white"
        >
          {heatmapVisible ? 'Hide Heatmap' : 'Show Heatmap'}
        </Button>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-20 left-4 z-10 bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-medium mb-3">Filter Spots</h3>
          
          {/* Rating Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating: {filters.minRating.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
              className="w-full"
            />
          </div>
          
          {/* Distance Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Distance: {filters.maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={filters.maxDistance}
              onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>
          
          {/* Busyness Filter */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showBusyOnly}
                onChange={(e) => setFilters({...filters, showBusyOnly: e.target.checked})}
                className="h-4 w-4 text-primary rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show busy places only</span>
            </label>
          </div>
          
          {/* Categories Filter */}
          {availableCategories.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      filters.categories.includes(category)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="absolute bottom-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
        Showing {filteredSpots.length} of {searchSpotsResult?.data?.length || 0} spots
      </div>
      
      {/* Map Container */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={map => setMap(map)}
        onZoomChanged={() => {
          if (map) setZoom(map.getZoom() || 12);
        }}
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
        {/* User's current location with pulsing effect */}
        <UserLocationMarker />
        
        {/* Heatmap Layer */}
        {heatmapVisible && heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 20,
              opacity: 0.6,
              gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 165, 0, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        )}

        {/* Marker Clustering */}
        <MarkerClusterer
          options={{
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            gridSize: 60,
            maxZoom: 15,
          }}
        >
          {(clusterer) => (
            <>
              {filteredSpots.map((spot) => (
                <SpotMarker
                  key={spot.id}
                  spot={spot}
                  onClick={(s) => setSelectedSpot(s)}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {/* Info window when a spot is clicked */}
        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.latitude,
              lng: selectedSpot.longitude,
            }}
            onCloseClick={() => setSelectedSpot(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40)
            }}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-medium text-base">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedSpot.address}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-medium">
                    {selectedSpot.averageRating?.toFixed(1) || 'N/A'}
                    <span className="text-gray-500 text-xs ml-1">({selectedSpot.reviewCount || 0})</span>
                  </span>
                </div>
                {selectedSpot.priceRange && (
                  <span className="ml-2 text-sm text-gray-600">
                    • {selectedSpot.priceRange}
                  </span>
                )}
              </div>
              {selectedSpot.busyness && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Current busyness:</span>
                    <span className={`font-medium ${
                      selectedSpot.busyness.currentLevel >= 3 ? 'text-red-600' : 
                      selectedSpot.busyness.currentLevel === 2 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {['Not busy', 'A little busy', 'Busy', 'Very busy', 'Extremely busy'][selectedSpot.busyness.currentLevel]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        selectedSpot.busyness.currentLevel >= 3 ? 'bg-red-500' : 
                        selectedSpot.busyness.currentLevel === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(selectedSpot.busyness.currentLevel + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {selectedSpot.specialties?.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedSpot.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // Handle view details
                    const win = window.open(`/spots/${selectedSpot.id}`, '_blank');
                    win?.focus();
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Maps;
