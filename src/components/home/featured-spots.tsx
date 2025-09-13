import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { featuredSpots } from "@/constants";
import { MapPin, Star, Users } from "lucide-react";
import { Badge } from "../ui/badge";

const FeaturedSpots = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Featured Amala Spots
          </h2>
          <Button variant="outline">View All Spots</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {spot.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{spot.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {spot.location} • {spot.distance}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="font-medium">
                      {spot.priceRange}
                    </Badge>
                    
                    <div className="flex flex-wrap gap-1">
                      {spot.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {spot.reviews} reviews
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

      </div>
    </section>
  );
};

export default FeaturedSpots;
