import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Clock, Bookmark, Star, ChevronDown, Filter } from 'lucide-react';
import type { Meal, User } from '../types';

const mockMeals: Meal[] = [
  {
    id: '1',
    userId: '2',
    user: {
      id: '2',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      email: '',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: '',
      isFollowing: true,
      followers: 0,
      following: 0,
      mealsLogged: 0,
      streak: 0,
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
      isVerified: false,
      isPremium: false,
      privacySettings: {} as any,
      notificationSettings: {} as any
    },
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Perfectly grilled salmon with quinoa and roasted vegetables 🐟🥗 Hitting my protein goals!',
    calories: 520,
    protein: 42,
    carbs: 35,
    fat: 22,
    location: 'Home Kitchen',
    timestamp: '2 hours ago',
    mealType: 'dinner',
    likes: 24,
    comments: [],
    isLiked: false,
    isBookmarked: false,
    tags: ['salmon', 'quinoa', 'healthy'],
    visibility: 'public'
  },
  {
    id: '2',
    userId: '3',
    user: {
      id: '3',
      username: 'fitnessguru',
      displayName: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: '',
      isFollowing: true,
      followers: 0,
      following: 0,
      mealsLogged: 0,
      streak: 0,
      badges: [],
      dailyCalorieGoal: 0,
      dailyProteinGoal: 0,
      caloriesConsumed: 0,
      proteinConsumed: 0
    },
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Pre-workout fuel! Greek yogurt with berries and granola 💪',
    calories: 340,
    protein: 20,
    carbs: 45,
    fat: 8,
    timestamp: '4 hours ago',
    likes: 18,
    comments: 3,
    isLiked: true
  },
  {
    id: '3',
    userId: '4',
    user: {
      id: '4',
      username: 'plantbased',
      displayName: 'Emma Green',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: '',
      isFollowing: false,
      followers: 0,
      following: 0,
      mealsLogged: 0,
      streak: 0,
      badges: [],
      dailyCalorieGoal: 0,
      dailyProteinGoal: 0,
      caloriesConsumed: 0,
      proteinConsumed: 0
    },
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Colorful Buddha bowl with chickpeas, avocado, and tahini dressing 🌱✨',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    location: 'Green Leaf Cafe',
    timestamp: '6 hours ago',
    likes: 31,
    comments: 12,
    isLiked: false
  }
];

export const Feed: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'trending'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const toggleLike = (mealId: string) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { 
            ...meal, 
            isLiked: !meal.isLiked,
            likes: meal.isLiked ? meal.likes - 1 : meal.likes + 1
          }
        : meal
    ));
  };

  const toggleBookmark = (mealId: string) => {
    setMeals(meals.map(meal => 
      meal.id === mealId 
        ? { ...meal, isBookmarked: !meal.isBookmarked }
        : meal
    ));
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      {/* Feed Filter */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-14 lg:top-16 z-30">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Feed</h2>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="capitalize">{feedFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[120px]">
                {['all', 'following', 'trending'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setFeedFilter(filter as any); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      feedFilter === filter ? 'text-green-600 bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Stories Section */}
      <div className="bg-white border-b border-gray-200 p-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto">
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-0.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
            </div>
            <span className="text-xs text-gray-600">Your Story</span>
          </div>
          {mockMeals.slice(0, 4).map((meal) => (
            <div key={meal.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-0.5">
                <img 
                  src={meal.user.avatar} 
                  alt={meal.user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">{meal.user.displayName.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
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
                    {meal.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{meal.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2">
                <MoreHorizontal className="w-5 h-5" />
              </button>
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
            </div>

            {/* Post Content */}
            <div className="p-4">
              {/* Nutrition Info */}
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
                  <button 
                    onClick={() => setShowComments(showComments === meal.id ? null : meal.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{meal.comments.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Share className="w-6 h-6" />
                  </button>
                </div>
                <button 
                  onClick={() => toggleBookmark(meal.id)}
                  className={`${
                    meal.isBookmarked ? 'text-yellow-600' : 'text-gray-600 hover:text-yellow-600'
                  } transition-colors`}
                >
                  <Bookmark className={`w-6 h-6 ${meal.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <div className="text-gray-900">
                <span className="font-semibold">{meal.user.displayName}</span>
                <span className="ml-2">{meal.description}</span>
              </div>

              {/* Comments */}
              {showComments === meal.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex space-x-3">
                    <img 
                      src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2"
                      alt="Commenter"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-sm">alexfitness</div>
                        <div className="text-sm text-gray-800">Looks amazing! What's your salmon seasoning secret? 🔥</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <img 
                      src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2"
                      alt="Commenter"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-sm">healthyeats</div>
                        <div className="text-sm text-gray-800">@alexfitness Just lemon, garlic, and herbs! Simple but delicious 😊</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};