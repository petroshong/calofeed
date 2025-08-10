import React from 'react';
import { Heart, MessageCircle, Share2, Eye, TrendingUp, Users } from 'lucide-react';

interface SocialMetricsProps {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement?: number;
  variant?: 'default' | 'compact' | 'detailed';
}

export const SocialMetrics: React.FC<SocialMetricsProps> = ({ 
  likes, 
  comments, 
  shares, 
  views, 
  engagement,
  variant = 'default' 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{formatNumber(likes)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span>{formatNumber(comments)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-gray-500" />
          <span>{formatNumber(views)}</span>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Engagement Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-5 h-5 text-red-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{formatNumber(likes)}</span>
            </div>
            <div className="text-xs text-gray-600">Likes</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{formatNumber(comments)}</span>
            </div>
            <div className="text-xs text-gray-600">Comments</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Share2 className="w-5 h-5 text-green-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{formatNumber(shares)}</span>
            </div>
            <div className="text-xs text-gray-600">Shares</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-5 h-5 text-gray-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{formatNumber(views)}</span>
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
        </div>
        {engagement && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900">
                {engagement.toFixed(1)}% engagement rate
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="font-medium">{formatNumber(likes)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <MessageCircle className="w-4 h-4 text-blue-500" />
        <span className="font-medium">{formatNumber(comments)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Share2 className="w-4 h-4 text-green-500" />
        <span className="font-medium">{formatNumber(shares)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Eye className="w-4 h-4 text-gray-500" />
        <span className="font-medium">{formatNumber(views)}</span>
      </div>
    </div>
  );
};