'use client'

import { Search, MapPin, Filter, Star, Mic } from 'lucide-react'
import React from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import appService from '@/services/app.service'
import { usePathname, useRouter } from 'next/navigation'
import useAppStore from '@/store/app.store'
import { handleLocationAccess } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SearchAmalaFormProps {
  className?: string;
}

const SearchAmalaForm: React.FC<SearchAmalaFormProps> = ({ className }) => {
  const router = useRouter();
  const path = usePathname();
  const {
    searchQuery,
    setSearchQuery,
    setSearchSpotsResult,
    location,
    setLocation,
    loadingSearchedSpots,
    setLoadingSearchedSpots
  } = useAppStore();

  const onLocationSuccess = (coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
  };

  const onLocationError = (errorMessage: string) => {
    console.error('Geolocation error:', errorMessage);
    toast.error(errorMessage);
  };

  const handleLocationRequest = () => {
    handleLocationAccess(onLocationSuccess, onLocationError);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    if (!location) {
      handleLocationRequest();
      return;
    }

    try {
      setLoadingSearchedSpots(true);
      
      if (path === '/') {
        router.push('/search');
      }
      
      const results = await appService.getNearbySpots({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      setSearchSpotsResult(results);
      
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setLoadingSearchedSpots(false);
    }
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto shadow-lg border-0 bg-card/95 backdrop-blur">
      <div className="space-y-4">
        {/* Location Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter location (or use GPS)"
              value={
                location
                  ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
                  : 'Location not set'
              }
              readOnly
              className="pl-10 h-12 text-base border-2"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-4"
            onClick={() => handleLocationAccess(onLocationSuccess, onLocationError)}
            type="button"
          >
            <MapPin className="w-5 h-5" />
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              placeholder='Search for amala spots, price range, etc.'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='pl-10 h-12 text-base border-2 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loadingSearchedSpots}
            className="h-12 px-6 text-base"
            type="button"
          >
            {loadingSearchedSpots ? 'Searching...' : 'Search'}
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-4 text-base"
            type="button"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Quick searches:</span>
          {['Amala near me', '24-hour spots', 'Best rated', 'Around ₦1000'].map(
            (suggestion) => (
              <Button
                key={suggestion}
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-3 border border-border"
                onClick={() => {
                  setSearchQuery(suggestion);
                  // Trigger search immediately when clicking a suggestion
                  if (location) {
                    handleSearch();
                  }
                }}
              >
                {suggestion}
              </Button>
            )
          )}
        </div>

      </div>
    </Card>
  )
}

export default SearchAmalaForm
