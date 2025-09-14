'use client'

import { Search, MapPin, Filter, Star, Mic } from 'lucide-react'
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import appService from '@/services/app.service'
import { useRouter } from 'next/navigation'
import useAppStore from '@/store/app.store'

const SearchAmalaForm = () => {
  const router = useRouter()
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const { searchQuery, setSearchQuery, setSearchSpotsResult } = useAppStore()

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error accessing geolocation:', error)
        }
      )
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) {
      toast('Please enter a search query')
      return
    }

    if (!location) {
      toast('Please get your location first')
      return
    }

    const payload = {
      message: searchQuery,
      sessionId: '', 
      userLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      language: 'en',
    }

    try {
      setLoading(true)
      const result = await appService.chatText(payload)
      setSearchSpotsResult(result)
      router.push('/search')
      
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto shadow-lg border-0 bg-card/95 backdrop-blur">
      <div className="space-y-4">

        {/* Location Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter location (or use GPS)"
              value={
                location
                  ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
                  : ''
              }
              readOnly
              className="pl-10 h-12 text-lg border-2"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-4"
            onClick={handleLocationAccess}
          >
            <MapPin className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Query Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for amala spots, price range, etc."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2"
            />
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="h-12 px-4"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="hero"
            size="lg"
            className="flex-1 h-12 text-lg"
            onClick={handleSearch}
            disabled={loading}
          >
            <Search className="w-5 h-5 mr-2" />
            {loading ? 'Searching...' : 'Search Amala Spots'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Quick searches:</span>
          {['Cheap amala near me', '24-hour spots', 'Best rated', 'Under ₦1000'].map(
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
