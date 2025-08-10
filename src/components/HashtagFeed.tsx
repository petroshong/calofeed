import React, { useState } from 'react';
import { Hash, TrendingUp, Clock, Heart, MessageCircle, Share2, Eye, Filter } from 'lucide-react';
import type { Meal } from '../types';

interface HashtagFeedProps {
  hashtag: string;
  onClose: () => void;
}

const mockHashtagMeals: Meal[] = [
  {
    id: '1',
    userId: '1',
    user: {
      id: '1',
      username: 'mealprep_master',
      displayName: 'Prep Master',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as any,
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sunday meal prep session! 5 days of balanced meals ready to go 💪 #mealprep #healthyeating',
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 18,
    timestamp: '2 hours ago',
    mealType: 'lunch',
    likes: 156,
    comments: [],
    isLiked: false,
    isBookmarked: false,
    shares: 23,
    views: 892,
    tags: ['mealprep', 'healthyeating', 'batchcooking'],
    visibility: 'public'
  },
  {
    id: '2',
    userId: '2',
    user: {
      id: '2',
      username: 'prep_queen',
      displayName: 'Sarah Prep',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as any,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Protein-packed containers for the week! Salmon, chicken, and tofu options 🐟🍗 #mealprep #protein',
    calories: 520,
    protein: 42,
    carbs: 35,
    fat: 22,
    timestamp: '5 hours ago',
    mealType: 'dinner',
    likes: 234,
    comments: [],
    isLiked: true,
    isBookmarked: true,
    shares: 45,
    views: 1247,
    tags: ['mealprep', 'protein', 'salmon'],
    visibility: 'public'
  }
];

export const HashtagFeed: React.FC<HashtagFeedProps> = ({ hashtag, onClose }) => {
  const [meals, setMeals] = useState<Meal[]>(mockHashtagMeals);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  const hashtagStats = {
    totalPosts: 2847,
    todayPosts: 156,
    weeklyGrowth: 23,
    topContributors: 45
  };

  const toggleLike = (mealId: string) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { 
            ...meal, 
            isLiked: !meal.isLiked,
            likes: meal.isLiked ? meal.likes - 1 : meal.likes + 1
          }
        : meal
    ));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <Hash className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">#{hashtag}</h1>
              <p className="text-pink-100">{hashtagStats.totalPosts.toLocaleString()} posts</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-pink-100">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+{hashtagStats.weeklyGrowth}% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900">{hashtagStats.todayPosts}</div>
              <div className="text-gray-600">Today</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{hashtagStats.topContributors}</div>
              <div className="text-gray-600">Contributors</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">+{hashtagStats.weeklyGrowth}%</div>
              <div className="text-gray-600">Growth</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {meals.map((meal) => (
            <article key={meal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={meal.user.avatar} 
                    alt={meal.user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{meal.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-pink-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </div>
              </div>

              {/* Food Image */}
              <div className="relative">
                <img 
                  src={meal.image} 
                  alt="Food"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {meal.calories} cal
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{meal.views}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                {/* Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(meal.id)}
                      className={`flex items-center space-x-2 ${
                        meal.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      } transition-colors`}
                    >
                      <Heart className={`w-6 h-6 ${meal.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{meal.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-medium">{meal.comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share2 className="w-6 h-6" />
                      <span className="font-medium">{meal.shares}</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="text-gray-900 mb-3">
                  <span className="font-semibold">{meal.user.displayName}</span>
                  <span className="ml-2">
                    {meal.description.split(/(\s#\w+)/g).map((part, index) => 
                      part.match(/^\s#\w+/) ? (
                        <span key={index} className="text-pink-600 font-medium cursor-pointer hover:underline">
                          {part}
                        </span>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                  </span>
                </div>

                {/* Nutrition Info */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600">{meal.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{meal.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-600">{meal.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-600">{meal.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};