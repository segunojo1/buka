import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Button } from "../ui/button";
import { MapPin, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

interface SpotCardProps {
  spot: {
    id: string;
    name: string;
    address: string;
    averageRating: number;
    reviewCount: number;
    priceRange: number;
    specialties: string[];
    distanceKm: number;
  };
}

const SpotCard = ({ spot }: SpotCardProps) => {
  const router = useRouter();
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-border/50"
      onClick={() => router.push(`/spots/${spot.id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{spot.name}</h4>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{spot.address.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(spot.averageRating)}
            <span className="text-xs text-gray-500 ml-1">
              {spot.averageRating.toFixed(1)} ({spot.reviewCount})
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {spot.specialties.slice(0, 3).map((specialty, i) => (
              <Badge key={i} variant="outline" className="text-xs h-5">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-sm font-medium">
          {spot.distanceKm < 1 
            ? `${(spot.distanceKm * 1000).toFixed(0)}m` 
            : `${spot.distanceKm.toFixed(1)}km`}
        </div>
      </div>
    </Card>
  );
};

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    spots?: any[];
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasSpots = message.spots && message.spots.length > 0;

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "bg-card" : "bg-muted/20"
    )}>
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 bg-secondary/20 text-secondary-foreground">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none">
          {message.content}
        </div>
        
        {hasSpots && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-900">Recommended Spots:</h4>
            <div className="grid gap-3">
              {message.spots.slice(0, 3).map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
            {message.spots.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                And {message.spots.length - 3} more spots found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
