'use client';

import { useState, useEffect } from 'react';
import { ReviewForm } from './ReviewForm';
import { ReviewItem } from './ReviewItem';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';
import AppService from '@/services/app.service';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  spotId: string;
}

export function ReviewsSection({ spotId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<{id: string; rating: number; comment: string} | null>(null);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  } | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        AppService.getSpotReviews(spotId),
        AppService.getSpotReviewStats(spotId)
      ]);
      
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [spotId]);

  const handleReviewSubmitted = () => {
    fetchReviews();
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview({
      id: review.id,
      rating: review.rating,
      comment: review.comment
    });
    setShowReviewForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleReviewDeleted = (deletedReviewId: string) => {
    setReviews(reviews.filter(review => review.id !== deletedReviewId));
    if (stats) {
      setStats({
        ...stats,
        totalReviews: Math.max(0, stats.totalReviews - 1)
      });
    }
  };

  const userReview = reviews.find(review => review.userId === user?.id);
  const canReview = user && !userReview;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews {stats && `(${stats.totalReviews})`}
        </h2>
        
        {canReview && !showReviewForm && (
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Write a Review
          </Button>
        )}
      </div>

      {stats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
                <span className="text-2xl text-gray-500">/5</span>
              </p>
              <div className="flex justify-center md:justify-start mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.averageRating) 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 max-w-md space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalReviews > 0 
                  ? (count / stats.totalReviews) * 100 
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-8 text-sm font-medium text-amber-700">{rating}</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-right text-sm text-gray-500">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(showReviewForm || editingReview) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <ReviewForm 
            spotId={spotId} 
            onReviewSubmitted={handleReviewSubmitted}
            initialData={editingReview || undefined}
          />
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              {...review}
              onReviewUpdated={fetchReviews}
              onReviewDeleted={handleReviewDeleted}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            {!showReviewForm && user && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="mt-4 bg-amber-600 hover:bg-amber-700"
              >
                Write a Review
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for star icon
function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}
