'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Star, Clock, MapPin, Phone, AlertCircle, Loader2 } from 'lucide-react';
import Maps from "@/components/maps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import appService from '@/services/app.service';

interface BusynessInfo {
  currentLevel: number;
  description: string;
  estimatedWaitMinutes: number;
  lastUpdated: string;
  source: number;
  popularityScore: number;
  checkInCount: number;
  recommendations: string[];
  weeklyPattern: Array<{
    dayOfWeek: number;
    hour: number;
    busynessPercentage: number;
    level: number;
  }>;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Spot {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  openingTime: string;
  closingTime: string;
  averageRating: number;
  reviewCount: number;
  priceRange: number;
  specialties: string[];
  isVerified: boolean;
  reviews: Review[];
  busynessInfo: BusynessInfo;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
}

const SpotId = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        setLoading(true);
        const data = await appService.getSpotById(id as string);
        setSpot(data);
      } catch (err) {
        console.error('Error fetching spot:', err);
        setError('Failed to load spot details');
        toast.error('Failed to load spot details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpot();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700">Error Loading Spot</h2>
          <p className="mt-2 text-red-600">{error || 'Spot not found'}</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <MainCard spot={spot} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SpotLocation spot={spot} />
              <SpotDetails spot={spot} />
              <ReviewsSection spot={spot} />
            </div>
            <div className="space-y-6">
              <BusynessInfo info={spot.busynessInfo} />
              <ReviewForm spotId={spot.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpotId;

interface MainCardProps {
  spot: Spot;
}

const MainCard = ({ spot }: MainCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-5 w-5 fill-amber-500/50 text-amber-500/50" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const getBusynessLevel = (level: number) => {
    switch (level) {
      case 1: return { text: 'Quiet', color: 'bg-green-100 text-green-800' };
      case 2: return { text: 'Normal', color: 'bg-blue-100 text-blue-800' };
      case 3: return { text: 'Busy', color: 'bg-yellow-100 text-yellow-800' };
      case 4: return { text: 'Very Busy', color: 'bg-orange-100 text-orange-800' };
      case 5: return { text: 'Packed', color: 'bg-red-100 text-red-800' };
      default: return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const busyness = spot.busynessInfo ? getBusynessLevel(spot.busynessInfo.currentLevel) : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full bg-gradient-to-r from-amber-100 to-amber-50">
        {spot.isVerified && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Verified
            </Badge>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{spot.name}</h1>
            <p className="text-gray-600 mt-1">{spot.specialties.join(' • ')}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
            <div className={`h-2.5 w-2.5 rounded-full ${busyness?.color.replace('bg-', 'bg-').split(' ')[0]}`} />
            <p className={`text-sm font-medium ${busyness?.color.replace('text-', 'text-').split(' ')[1]}`}>
              {busyness?.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center">
            <div className="flex items-center">
              {renderStars(spot.averageRating)}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {spot.averageRating.toFixed(1)}
            </span>
            <span className="mx-1.5 text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {spot.reviewCount} {spot.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center text-sm text-gray-600">
            <span>{'$'.repeat(Math.min(spot.priceRange, 5))}</span>
            <span className="text-gray-400 ml-1">• {spot.distanceKm.toFixed(1)} km</span>
          </div>
        </div>

        {spot.description && (
          <p className="text-gray-700 pt-2">{spot.description}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {spot.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-amber-700 bg-amber-50 border-amber-100">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const SpotLocation = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6 space-y-4">
      <h3 className="font-ojuju text-2xl font-bold text-stone-800">Location</h3>
      <div className="h-64 rounded-lg overflow-hidden relative">
        <Maps />
        <div className="absolute inset-0 bg-black/10 "></div>
      </div>
      <Button className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors">
        <span className="material-symbols-outlined text-base">near_me</span>
        <span>Open in Google Maps</span>
      </Button>
    </div>
  );
};

export const ReviewForm = () => {
  return (
    <div className="rounded-xl shadow-lg bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-ojuju text-2xl font-bold text-stone-800">
          Your Review
        </h3>
        <Button className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">delete</span>
          Delete
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-1 text-amber-500">
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <Button>
              <span className="material-symbols-outlined !text-3xl">star</span>
            </Button>
          ))}
        </div>
        <Textarea className="form-textarea w-full rounded-lg border-stone-200 bg-stone-50 p-3 text-stone-900 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500"></Textarea>
        <Button className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors">
          <span>Submit Review</span>
        </Button>
      </div>
    </div>
  );
};

export const AllReviews = () => {
  return (
    <div className="rounded-xl shadow-lg bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-ojuju text-2xl font-bold text-stone-800">
          Reviews
        </h3>
        <Button className="text-sm font-medium text-amber-600 hover:text-amber-800">
          View All
        </Button>
      </div>
      <div className="space-y-6">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2">
          <Button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50">
            <span className="material-symbols-outlined">chevron_left</span>
          </Button>
          {[1, 2, 3].map((star) => (
            <Button className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white text-sm font-bold">
              {star}
            </Button>
          ))}
          <Button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100">
            <span className="material-symbols-outlined">chevron_right</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ReviewCard = () => {
  return (
    <div>
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-black bg-cover bg-center flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-stone-800">Segun Ojo</h4>
            <div className="flex text-amber-500">
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <span className="material-symbols-outlined !text-base">
                  star
                </span>
              ))}
            </div>
          </div>
          <p>2 days ago</p>
          <p className="mt-2 text-stone-700">
            The best jollof rice in town! The atmosphere is so welcoming and the
            staff are incredibly friendly. A must-visit.
          </p>
        </div>
      </div>
    </div>
  );
};
