"use client"

import SearchAmalaForm from "@/components/search-amala-form";
import SpotCard from "@/components/spots/spot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchResults } from "@/constants";
import { Filter, List, MapIcon, SortAsc } from "lucide-react";
import React, { useState } from "react";

const Search = () => {
  // const [searchResults, setSearchResults] = useState([]);
  
  return (
    <div className="min-h-screen bg-background" >

      <div className="bg-gradient-to-r from-primary to-secondary bg-contain text-primary-foreground py-8 px-4" style={{
          backgroundImage: `url("/test-bg.jpg")`,
        }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Amala Spots Near You
          </h1>
          <p className="text-lg opacity-90">
            Found {searchResults.length} spots in Lagos, Nigeria
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
  const [activeFilters, setActiveFilters] = useState<string[]>(["Open Now", "Under ₦1,500", "Rating 4+"]);
  // const [searchResults, setSearchResults] = useState([]);

    const handleViewDetails = (id: string) => {
    
    console.log("View details for spot:", id);
  };
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
        {viewMode === "list" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
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

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      </div>
  )
}

