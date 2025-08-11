import React from 'react';
import { TrendingUp, Hash, MapPin, Users, Flame, Star, Clock, Eye, Heart } from 'lucide-react';

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
}
const trendingData: TrendingItem[] = [
  {
    id: '1',
    type: 'hashtag',
    name: 'mealprep',
    count: 2847,
    trend: 23,
    engagement: 89
  },
  {
    id: '2',
    type: 'hashtag',
    name: 'proteinpacked',
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
    name: 'plantbased',
    count: 1654,
    trend: 18,
    engagement: 85
  },
  {
    id: '5',
    type: 'location',
    name: 'Protein Palace',
    count: 89,
    trend: 34,
    description: 'Midtown • 4.6★',
    engagement: 82
  },
  {
    id: '6',
    type: 'meal',
    name: 'Viral Salmon Bowl',
    count: 1247,
    trend: 156,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Everyone is making this!',
    engagement: 94
  }
];

export const TrendingSection: React.FC<TrendingSectionProps> = ({ onHashtagClick, onLocationClick, onTrendingClick }) => {
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-500" />
        <h2 className="text-base lg:text-lg font-semibold text-gray-900">Trending Now</h2>
      </div>
      
      <div className="space-y-3">
        {trendingData.map((item, index) => (
          <button 
            key={item.id} 
            onClick={() => handleItemClick(item)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="text-xs lg:text-sm font-bold text-gray-500 w-4 lg:w-6">#{index + 1}</div>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                {item.type === 'hashtag' && <Hash className="w-4 h-4 text-pink-500" />}
                {item.type === 'location' && <MapPin className="w-4 h-4 text-blue-500" />}
                {item.type === 'user' && <Users className="w-4 h-4 text-green-500" />}
                {item.type === 'meal' && <Flame className="w-4 h-4 text-orange-500" />}
                <div className="min-w-0 flex-1">
                  <div className={`font-medium text-sm lg:text-base ${item.type === 'hashtag' ? 'text-pink-600 hover:text-pink-700' : 'text-gray-900'}`}>
                    {item.type === 'hashtag' ? `#${item.name}` : item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">
                    {item.count.toLocaleString()} {item.type === 'hashtag' ? 'posts' : item.type === 'location' ? 'check-ins' : item.type === 'meal' ? 'likes' : 'followers'}
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {item.engagement && (
                <div className="flex items-center space-x-1 text-purple-600">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs font-medium">{item.engagement}%</span>
                </div>
              )}
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">+{item.trend}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <button className="w-full mt-4 text-pink-600 hover:text-pink-700 font-medium text-xs lg:text-sm">
        View All Trending
      </button>
    </div>
  );
};