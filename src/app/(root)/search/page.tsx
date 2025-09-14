"use client"

import SearchAmalaForm from "@/components/search-amala-form";
import SpotCard from "@/components/spots/spot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, List, MapIcon, SortAsc } from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import React, { useState } from "react";
import useAppStore, { Spot } from "@/store/app.store";
import { useRouter } from "next/navigation";


const Search = () => {
  // const [searchResults, setSearchResults] = useState([]);
  const { searchSpotsResult } = useAppStore();

  
  return (
    <div className="min-h-screen bg-background">
      <div 
        className="bg-gradient-to-r from-primary to-secondary bg-contain text-primary-foreground py-8 px-4" 
        style={{
          backgroundImage: `url("/test-bg.jpg")`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Amala Spots Near You
          </h1>
          <p className="text-lg opacity-90">
            Found {searchSpotsResult?.spots?.length || 0} spots in Lagos, Nigeria
          </p>
        </div>
      </div>

      <div className="py-6 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SearchAmalaForm />
        </div>
      </div>

      <SearchResults />
    </div>
  );
};

export default Search;


export const SearchResults = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { searchSpotsResult } = useAppStore();
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/spot/${id}`);
  };

  if (!searchSpotsResult) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="bg-muted rounded-lg p-8 max-w-2xl mx-auto">
          <SearchIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Search for Amala Spots</h3>
          <p className="text-muted-foreground">
            Enter a location or use your current position to find the best amala spots near you.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>

        {/* Sort and Filter */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort: Distance
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer">
              {filter} ×
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
            Clear all
          </Button>
        </div>
      )}

      {/* Results */}
      {viewMode === 'list' ? (
        searchSpotsResult?.spots?.length > 0 ? (
          <>
            <div className="mb-6 p-4 rounded-md bg-green-50 text-green-800">
              <p>{searchSpotsResult.reply}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchSpotsResult.spots.map((spot: Spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onViewDetails={() => handleViewDetails(spot.id)}
                />
              ))}
            </div>

            {searchSpotsResult.mapUrl && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => window.open(searchSpotsResult.mapUrl!, '_blank')}
                  className="flex items-center mx-auto"
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  View All on Map
                </Button>
              </div>
            )}
          </> 
        ) : searchSpotsResult ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg inline-block">
              <p className="text-lg font-medium mb-2">No spots found</p>
              <p className="mb-4">{searchSpotsResult.reply}</p>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Try a different search
              </Button>
            </div>
          </div>
        ) : null
      ) : (
        <Card className="h-[600px] flex items-center justify-center">
          <CardContent>
            <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-center text-muted-foreground">
              Map view coming soon! For now, enjoy the list view above.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Load More Button - Only show if there are results */}
      {searchSpotsResult?.spots?.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}
