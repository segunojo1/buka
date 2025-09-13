'use client'

import { Filter, MapPin, Mic, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'

const SearchAmalaForm = () => {
    const [searchQuery, setSearchQuery] = useState();
    const [location, setLocation] = useState('');

    const handleLocationAccess = () => {
        
    }
  return (
    <Card className="p-6 max-w-4xl mx-auto shadow-lg border-0 bg-card/95 backdrop-blur">
      <div className="space-y-4">
        {/* Location Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter location (e.g., Yaba, Lagos)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for amala spots, price range, etc."
              value={searchQuery}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="hero" 
            size="lg" 
            className="flex-1 h-12 text-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Amala Spots
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
          {["Cheap amala near me", "24-hour spots", "Best rated", "Under ₦1000"].map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-3 border border-border"
              onClick={() => setSearchQuery(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default SearchAmalaForm