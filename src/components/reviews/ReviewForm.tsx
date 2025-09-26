'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import AppService from '@/services/app.service';

interface ReviewFormProps {
  spotId: string;
  onReviewSubmitted: () => void;
  initialData?: {
    id?: string;
    rating: number;
    comment: string;
  };
}

export function ReviewForm({ spotId, onReviewSubmitted, initialData }: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter your review');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        spotId,
      };

      if (initialData?.id) {
        // Update existing review
        await AppService.updateReview(initialData.id, reviewData);
        toast.success('Review updated successfully');
      } else {
        // Create new review
        await AppService.postReview(reviewData);
        toast.success('Review submitted successfully');
      }
      
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <Textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience at this spot..."
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
