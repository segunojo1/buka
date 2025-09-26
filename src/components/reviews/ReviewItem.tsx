'use client';

import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AppService from '@/services/app.service';

interface ReviewItemProps {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  onReviewUpdated: () => void;
  onReviewDeleted: (id: string) => void;
}

export function ReviewItem({
  id,
  userName,
  rating,
  comment,
  createdAt,
  userId,
  onReviewUpdated,
  onReviewDeleted,
}: ReviewItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const isCurrentUser = user?.id === userId;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setIsDeleting(true);
    try {
      await AppService.deleteReview(id);
      toast.success('Review deleted successfully');
      onReviewDeleted(id);
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    setIsReporting(true);
    try {
      await AppService.reportReview(id, reportReason);
      toast.success('Review reported successfully');
      setShowReportForm(false);
      setReportReason('');
    } catch (error) {
      console.error('Failed to report review:', error);
      toast.error('Failed to report review');
    } finally {
      setIsReporting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{userName}</h4>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(rating)}
            <span className="text-xs text-gray-500 ml-2">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {isCurrentUser && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              disabled={isDeleting}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
        
        {!isCurrentUser && user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowReportForm(!showReportForm)}
            disabled={isReporting}
            className="text-gray-500 hover:text-gray-700"
          >
            Report
          </Button>
        )}
      </div>
      
      <p className="mt-2 text-gray-700">{comment}</p>
      
      {showReportForm && !isCurrentUser && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Report this review</h5>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Please explain the issue..."
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowReportForm(false)}
              disabled={isReporting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleReport}
              disabled={isReporting || !reportReason.trim()}
            >
              {isReporting ? 'Reporting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
