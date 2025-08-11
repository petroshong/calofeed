import React, { useState } from 'react';
import { TrendingUp, Hash, MapPin, Clock, Heart, MessageCircle, Bookmark, Star, Filter, Users, Flame } from 'lucide-react';
import type { Meal, User } from '../types';

interface DiscoverProps {
  onHashtagClick?: (hashtag: string) => void;
}
const trendingHashtags = [
  { tag: 'mealprep', count: 2847 },
  { tag: 'keto', count: 1923 },
  { tag: 'plantbased', count: 1654 },
  { tag: 'proteinpacked', count: 1432 },
  { tag: 'healthyeating', count: 1287 },
  { tag: 'weightloss', count: 1156 },
  { tag: 'bulking', count: 987 },
  { tag: 'vegan', count: 876 }
];

const featuredUsers: User[] = [
  {
    id: '1',
    username: 'chefmaria',
    displayName: 'Maria Rodriguez',
    email: '',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Professional chef sharing healthy restaurant-quality meals 👩‍🍳',
    isFollowing: false,
    followers: 45623,
    following: 234,
    mealsLogged: 1247,
    streak: 89,
    badges: [],
    dailyCalorieGoal: 0,
    dailyProteinGoal: 0,
    dailyCarbGoal: 0,
    dailyFatGoal: 0,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
    activityLevel: 'moderate',
    dietaryPreferences: [],
    allergies: [],
    joinedDate: '',
    isVerified: true,
    isPremium: true,
    privacySettings: {} as any,
    notificationSettings: {} as any
  },
  {
    id: '2',
    username: 'fitnesscoach_sam',
    displayName: 'Sam Wilson',
    email: '',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Certified nutritionist helping you reach your goals 💪',
    isFollowing: true,
    followers: 23456,
    following: 145,
    mealsLogged: 892,
    streak: 156,
    badges: [],
    dailyCalorieGoal: 0,
    dailyProteinGoal: 0,
    dailyCarbGoal: 0,
    dailyFatGoal: 0,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
    activityLevel: 'very_active',
    dietaryPreferences: [],
    allergies: [],
    joinedDate: '',
    isVerified: true,
    isPremium: true,
    privacySettings: {} as any,
    notificationSettings: {} as any
  }
];

const trendingMeals: Meal[] = [
  {
    id: '1',
    userId: '1',
    user: featuredUsers[0],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Viral salmon bowl that everyone is making! 🔥 #mealprep #proteinpacked',
    calories: 520,
    protein: 42,
    carbs: 35,
    fat: 22,
    timestamp: '2 hours ago',
    mealType: 'lunch',
    likes: 1247,
    comments: [],
    isLiked: false,
    isBookmarked: false,
    tags: ['mealprep', 'proteinpacked', 'salmon'],
    visibility: 'public'
  },
  {
    id: '2',
    userId: '2',
    user: featuredUsers[1],
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'The Buddha bowl that broke the internet 🌱 #plantbased #vegan',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    timestamp: '4 hours ago',
    mealType: 'lunch',
    likes: 892,
    comments: [],
    isLiked: true,
    isBookmarked: true,
    tags: ['plantbased', 'vegan', 'buddhabowl'],
    visibility: 'public'
  }
];

export const Discover: React.FC<DiscoverProps> = ({ onHashtagClick }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'hashtags' | 'users' | 'nearby'>('trending');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('week');

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Discover</h1>
            <p className="text-pink-100">Explore trending meals and find inspiration</p>
          </div>
          <TrendingUp className="w-12 h-12 text-pink-200" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'trending' 
              ? 'bg-white text-pink-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'hashtags' 
              ? 'bg-white text-pink-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hashtags
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'users' 
              ? 'bg-white text-pink-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'nearby' 
              ? 'bg-white text-pink-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Nearby
        </button>
      </div>

      {/* Time Filter */}
      <div className="px-4 pb-4 bg-gray-50">
        <div className="flex space-x-2">
          {['all', 'today', 'week', 'month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter === 'all' ? 'All Time' : `This ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {activeTab === 'trending' && (
          <div className="space-y-6">
            {/* Viral Meals */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                Viral Meals
              </h2>
              <div className="grid gap-6">
                {trendingMeals.map((meal) => (
                  <div key={meal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={meal.user.avatar} 
                          alt={meal.user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                            {meal.user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{meal.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-pink-500" />
                        <span className="font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-full">Viral</span>
                      </div>
                    </div>

                    <img 
                      src={meal.image} 
                      alt="Food"
                      className="w-full h-80 object-cover"
                    />

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{meal.protein}g</div>
                          <div className="text-xs text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{meal.carbs}g</div>
                          <div className="text-xs text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{meal.fat}g</div>
                          <div className="text-xs text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{meal.calories}</div>
                          <div className="text-xs text-gray-600">Calories</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <button className={`flex items-center space-x-2 ${
                            meal.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          } transition-colors`}>
                            <Heart className={`w-6 h-6 ${meal.isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{meal.likes.toLocaleString()}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageCircle className="w-6 h-6" />
                            <span className="font-medium">{meal.comments.length}</span>
                          </button>
                          <button className={`${
                            meal.isBookmarked ? 'text-yellow-600' : 'text-gray-600 hover:text-yellow-600'
                          } transition-colors`}>
                            <Bookmark className={`w-6 h-6 ${meal.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div className="text-gray-900">
                        <span className="font-semibold">{meal.user.displayName}</span>
                        <span className="ml-2">{meal.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Hashtags</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingHashtags.map((hashtag, index) => (
                  <button 
                    key={hashtag.tag} 
                    onClick={() => onHashtagClick && onHashtagClick(hashtag.tag)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-5 h-5 text-pink-500" />
                        <span className="font-semibold text-pink-600 hover:text-pink-700">#{hashtag.tag}</span>
                      </div>
                      <div className="text-sm font-medium text-pink-600">#{index + 1}</div>
                    </div>
                    <div className="text-sm text-gray-600">{hashtag.count.toLocaleString()} posts</div>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>+{Math.floor(Math.random() * 50 + 10)}% this week</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Creators</h2>
              <div className="grid gap-4">
                {featuredUsers.map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={user.avatar} 
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{user.displayName}</h3>
                          {user.isVerified && <Star className="w-5 h-5 text-blue-500 fill-current" />}
                          {user.isPremium && <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">@{user.username}</p>
                        <p className="text-gray-700 mb-3">{user.bio}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{user.followers.toLocaleString()} followers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4" />
                            <span>{user.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        user.isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-pink-600 text-white hover:bg-pink-700'
                      }`}>
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Popular Spots Near You</h2>
              </div>
              <div className="grid gap-4">
                {[
                  { name: 'Green Bowl Cafe', meals: 47, rating: 4.8, distance: '0.3 mi', checkins: 156, trending: true },
                  { name: 'Protein Palace', meals: 32, rating: 4.6, distance: '0.7 mi', checkins: 89, trending: false },
                  { name: 'Fresh & Fit', meals: 28, rating: 4.9, distance: '1.2 mi', checkins: 67, trending: true }
                ].map((spot) => (
                  <div key={spot.name} className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                          {spot.trending && (
                            <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Hot</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{spot.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{spot.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{spot.meals} meals logged</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{spot.checkins} check-ins</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Location
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};