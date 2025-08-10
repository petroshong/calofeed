import React from 'react';
import { Crown, Star, Verified } from 'lucide-react';

interface InfluencerBadgeProps {
  type: 'verified' | 'premium' | 'influencer';
  size?: 'sm' | 'md' | 'lg';
}

export const InfluencerBadge: React.FC<InfluencerBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const iconSize = sizeClasses[size];

  switch (type) {
    case 'verified':
      return <Star className={`${iconSize} text-blue-500 fill-current`} />;
    case 'premium':
      return (
        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center space-x-1">
          <Crown className="w-3 h-3" />
          <span>PRO</span>
        </span>
      );
    case 'influencer':
      return <Crown className={`${iconSize} text-yellow-500 fill-current`} />;
    default:
      return null;
  }
};