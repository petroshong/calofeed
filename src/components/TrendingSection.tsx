import React from 'react';
import { TrendingUp, Hash, MapPin, Users, Flame, Star } from 'lucide-react';

interface TrendingItem {
  id: string;
  type: 'hashtag' | 'location' | 'user' | 'meal';
  name: string;
  count: number;
  trend: number;
  image?: string;
}

interface TrendingSectionProps {
  onHashtagClick?: (hashtag: string) => void;
}
const trendingData: TrendingItem[] = [
  {
    id: '1',
    type: 'hashtag',
    name: 'mealprep',
    count: 2847,
    trend: 23
  },
  {
    id: '2',
    type: 'hashtag',
    name: 'proteinpacked',
    count: 1923,
    trend: 45
  },
  {
    id: '3',
    type: 'location',
    name: 'Green Bowl Cafe',
    count: 156,
    trend: 12
  },
  {
    id: '4',
    type: 'hashtag',
    name: 'plantbased',
    count: 1654,
    trend: 18
  },
  {
    id: '5',
    type: 'location',
    name: 'Protein Palace',
    count: 89,
    trend: 34
  }
];

export const TrendingSection: React.FC<TrendingSectionProps> = ({ onHashtagClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-500" />
        <h2 className="text-lg font-semibold text-gray-900">Trending Now</h2>
      </div>
      
      <div className="space-y-3">
        {trendingData.map((item, index) => (
          <button 
            key={item.id} 
            onClick={() => item.type === 'hashtag' && onHashtagClick && onHashtagClick(item.name)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="text-sm font-bold text-gray-500 w-6">#{index + 1}</div>
              <div className="flex items-center space-x-2">
                {item.type === 'hashtag' && <Hash className="w-4 h-4 text-pink-500" />}
                {item.type === 'location' && <MapPin className="w-4 h-4 text-blue-500" />}
                {item.type === 'user' && <Users className="w-4 h-4 text-green-500" />}
                <div>
                  <div className={`font-medium ${item.type === 'hashtag' ? 'text-pink-600 hover:text-pink-700' : 'text-gray-900'}`}>
                    {item.type === 'hashtag' ? `#${item.name}` : item.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.count.toLocaleString()} {item.type === 'hashtag' ? 'posts' : item.type === 'location' ? 'check-ins' : 'followers'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">+{item.trend}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <button className="w-full mt-4 text-pink-600 hover:text-pink-700 font-medium text-sm">
        View All Trending
      </button>
    </div>
  );
};