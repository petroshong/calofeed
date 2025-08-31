import React, { useState } from 'react';
import { Hash, TrendingUp, Clock, Heart, MessageCircle, Share2, Eye, Filter, X } from 'lucide-react';
import type { Meal, User } from '../types';
import { ImageViewer } from './ImageViewer';

interface HashtagFeedProps {
  hashtag: string;
  onClose: () => void;
  allMeals?: Meal[];
}

export const HashtagFeed: React.FC<HashtagFeedProps> = ({ hashtag, onClose, allMeals = [] }) => {
  // Filter meals that contain the hashtag
  const hashtagMeals = allMeals.filter(meal => 
    meal.tags.includes(hashtag.toLowerCase()) ||
    meal.description.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
  );
  
  const [meals, setMeals] = useState<Meal[]>(hashtagMeals);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [imageViewer, setImageViewer] = useState<{ url: string; alt: string } | null>(null);

  const hashtagStats = {
    totalPosts: hashtagMeals.length,
    todayPosts: hashtagMeals.filter(meal => {
      const today = new Date().toDateString();
      const mealDate = new Date(meal.timestamp).toDateString();
      return today === mealDate;
    }).length,
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
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col mobile-modal-overlay"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 lg:p-6">
        {/* Mobile drag handle */}
        <div className="lg:hidden absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white bg-opacity-30 rounded-full"></div>
        
        <div className="pt-4 lg:pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors enhanced-touch-target"
            >
              <X className="w-6 h-6" />
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
        <div className="max-w-4xl mx-auto">
          {meals.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-4">No meals have been tagged with #{hashtag} yet</p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Try these popular food hashtags:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['salmon', 'chicken', 'avocado', 'quinoa', 'eggs', 'smoothie', 'salad', 'pasta'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => window.location.hash = `#${tag}`}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 lg:gap-4">
              {meals.map((meal) => (
                <div key={meal.id} className="aspect-square relative group cursor-pointer">
                  <img 
                    src={meal.image} 
                    alt="Meal"
                    className="w-full h-full object-cover rounded-lg"
                    onClick={() => setImageViewer({ url: meal.image, alt: `Meal tagged with #${hashtag}` })}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 text-center">
                      <div className="font-bold text-lg mb-1">{meal.calories} cal</div>
                      <div className="text-sm flex items-center justify-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{meal.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{meal.comments.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{meal.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Avatar Overlay */}
                  <div className="absolute top-2 left-2">
                    <img 
                      src={meal.user.avatar} 
                      alt={meal.user.displayName}
                      className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  </div>
                  
                  {/* Calorie Badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {meal.calories} cal
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Image Viewer */}
      {imageViewer && (
        <ImageViewer
          imageUrl={imageViewer.url}
          alt={imageViewer.alt}
          onClose={() => setImageViewer(null)}
        />
      )}
      </div>
    </div>
  );
};