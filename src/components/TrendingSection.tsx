import React from 'react';
import { TrendingUp, Hash, MapPin, Users, Flame, Star, Clock, Eye, Heart, ExternalLink } from 'lucide-react';

interface TrendingItem {
  id: string;
  type: 'hashtag' | 'location' | 'user' | 'meal';
  name: string;
  count: number;
  trend: number;
  image?: string;
  description?: string;
  engagement?: number;
}

interface TrendingSectionProps {
  onHashtagClick?: (hashtag: string) => void;
  onLocationClick?: (location: string) => void;
  onTrendingClick?: (item: TrendingItem) => void;
  onViewAllTrending?: () => void;
}
const trendingData: TrendingItem[] = [
  {
    id: '1',
    type: 'hashtag',
    name: 'salmon',
    count: 2847,
    trend: 23,
    engagement: 89
  },
  {
    id: '2',
    type: 'hashtag',
    name: 'avocado',
    count: 1923,
    trend: 45,
    engagement: 92
  },
  {
    id: '3',
    type: 'location',
    name: 'Green Bowl Cafe',
    count: 156,
    trend: 12,
    description: 'Downtown • 4.8★',
    engagement: 76
  },
  {
    id: '4',
    type: 'hashtag',
    name: 'chicken',
    count: 1654,
    trend: 18,
    engagement: 85
  },
  {
    id: '5',
    type: 'hashtag',
    name: 'quinoa',
    count: 1543,
    trend: 34,
    engagement: 82
  },
  {
    id: '6',
    type: 'hashtag',
    name: 'smoothie',
    count: 1432,
    trend: 67,
    engagement: 88
  },
  {
    id: '7',
    type: 'hashtag',
    name: 'eggs',
    count: 1298,
    trend: 29,
    engagement: 91
  },
  {
    id: '8',
    type: 'hashtag',
    name: 'pasta',
    count: 1234,
    trend: 41,
    engagement: 86
  },
  {
    id: '9',
    type: 'hashtag',
    name: 'salad',
    count: 1187,
    trend: 15,
    engagement: 83
  },
  {
    id: '10',
    type: 'hashtag',
    name: 'broccoli',
    count: 1098,
    trend: 52,
    engagement: 79
  }
];

export const TrendingSection: React.FC<TrendingSectionProps> = ({ onHashtagClick, onLocationClick, onTrendingClick, onViewAllTrending }) => {
  const handleItemClick = (item: TrendingItem) => {
    if (item.type === 'hashtag' && onHashtagClick) {
      onHashtagClick(item.name);
    } else if (item.type === 'location' && onLocationClick) {
      onLocationClick(item.name);
    } else if (onTrendingClick) {
      onTrendingClick(item);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-500" />
        <h2 className="text-sm lg:text-base font-semibold text-gray-900">Trending Now</h2>
      </div>
      
      <div className="space-y-2">
        {trendingData.slice(0, 4).map((item, index) => (
          <button 
            key={item.id} 
            onClick={() => handleItemClick(item)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-500 w-4">#{index + 1}</div>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-6 h-6 rounded-md object-cover flex-shrink-0"
                  />
                )}
                {item.type === 'hashtag' && <Hash className="w-3 h-3 text-pink-500" />}
                {item.type === 'location' && <MapPin className="w-3 h-3 text-blue-500" />}
                {item.type === 'user' && <Users className="w-3 h-3 text-green-500" />}
                {item.type === 'meal' && <Flame className="w-3 h-3 text-orange-500" />}
                <div className="min-w-0 flex-1">
                  <div className={`font-medium text-xs lg:text-sm ${item.type === 'hashtag' ? 'text-pink-600 hover:text-pink-700' : item.type === 'location' ? 'text-blue-600 hover:text-blue-700' : 'text-gray-900'}`}>
                    {item.type === 'hashtag' ? `#${item.name}` : item.name.length > 12 ? `${item.name.substring(0, 12)}...` : item.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.count.toLocaleString()} {item.type === 'hashtag' ? 'posts' : item.type === 'location' ? 'check-ins' : item.type === 'meal' ? 'likes' : 'followers'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">+{item.trend}%</span>
            </div>
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => onViewAllTrending && onViewAllTrending()}
        className="w-full mt-3 text-pink-600 hover:text-pink-700 font-medium text-xs lg:text-sm flex items-center justify-center space-x-1 py-2 hover:bg-pink-50 rounded-lg transition-colors"
      >
        <span>View All Trending</span>
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};