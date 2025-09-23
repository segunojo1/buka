import React from "react";
import { Card, CardContent } from "../ui/card";
import { MapPin, Phone, Star, Utensils } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface SpotCardProps {
  spot: {
    id: string;
    name: string;
    address: string;
    distanceKm: number;
    rating: number;
    reviewCount: number;
    priceRange: string;
    isOpen: boolean;
    specialties: string[];
    image?: string;
    phoneNumber?: string;
    averageRating?: number;
  };
  onViewDetails: (id: string) => void;
}
const SpotCard = ({ spot, onViewDetails }: SpotCardProps) => {
  return (
    <Card className="clean-card overflow-hidden hover:shadow-xl cursor-pointer group border-0 py-0">
      <div onClick={() => onViewDetails(spot.id)}>
        <div className="relative h-48 bg-gradient-to-br bg-[#e5e5e5] flex items-center justify-center overflow-hidden">
          {spot.image ? (
            <img
              src={spot.image}
              alt={spot.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Utensils className="w-16 h-16 text-primary/40" />
          )}

          <Badge
            variant={spot.isOpen ? "default" : "destructive"}
            className="absolute top-4 right-4 shadow-sm"
          >
            {spot.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>

        <CardContent className="p-6 bg-white">

          <div className="flex justify-between items-start mb-4">
            <h3 className="font-display font-semibold text-xl text-card-foreground group-hover:text-primary transition-colors text-balance">
              {spot.name}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-base">{spot.averageRating}</span>
              <span className="text-sm text-muted-foreground">({spot.reviewCount})</span>
            </div>
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm flex-1 font-medium">{spot.address}</span>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{spot.distanceKm.toFixed(4)}km</span>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <Badge variant="secondary" className="font-medium text-sm">
              {spot.priceRange}
            </Badge>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-6">
            {spot.specialties.slice(0, 3).map((specialty, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs font-medium rounded-full"
              >
                {specialty}
              </Badge>
            ))}
            {spot.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs font-medium rounded-full">
                +{spot.specialties.length - 3} more
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-border/30">
            <Button
              variant="default" 
              size="sm" 
              className="flex-1 rounded-full font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(spot.id);
              }}
            >
              View Details
            </Button>
            
            {spot.phoneNumber && (
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${spot.phoneNumber}`, '_self');
                }}
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent> 

      </div>
    </Card>
  );
};

export default SpotCard;
