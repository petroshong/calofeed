import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Clock, Bookmark, Star, ChevronDown, Filter, Send, Eye } from 'lucide-react';
import { Stories } from './Stories';
import { SuggestedUsers } from './SuggestedUsers';
import { ActivityFeed } from './ActivityFeed';
import { TrendingSection } from './TrendingSection';
import { SocialShare } from './SocialShare';
import { MealDetail } from './MealDetail';
import { FoodCategoryFilter } from './FoodCategoryFilter';
import { AllSuggestions } from './AllSuggestions';
import { MealActions } from './MealActions';
import { useMeals } from '../hooks/useMeals';
import type { Meal, User } from '../types';

// Mock meals for demonstration
const mockFeedMeals: Meal[] = [
  {
    id: 'mock-1',
    userId: 'mock-user-1',
    user: {
      id: 'mock-user-1',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: true,
      isPremium: false,
      isInfluencer: false
    } as User,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Perfect post-workout meal! Grilled salmon with quinoa and roasted vegetables 🐟🥗 #postworkout #protein #healthyeating',
    calories: 520,
    protein: 42,
    carbs: 35,
    fat: 22,
    timestamp: '2 hours ago',
    mealType: 'lunch',
    likes: 156,
    comments: [],
    isLiked: false,
    isBookmarked: false,
    shares: 23,
    views: 892,
    tags: ['postworkout', 'protein', 'healthyeating'],
    visibility: 'public'
  },
  {
    id: 'mock-2',
    userId: 'mock-user-2',
    user: {
      id: 'mock-user-2',
      username: 'fitnessguru',
      displayName: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: false,
      isPremium: true,
      isInfluencer: false
    } as User,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Meal prep Sunday! Buddha bowl with chickpeas, avocado, and tahini dressing 🌱 #mealprep #plantbased #vegan',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    timestamp: '4 hours ago',
    mealType: 'lunch',
    likes: 234,
    comments: [],
    isLiked: true,
    isBookmarked: true,
    shares: 45,
    views: 1247,
    tags: ['mealprep', 'plantbased', 'vegan'],
    visibility: 'public'
  }
];

interface FeedProps {
  onViewProfile?: (user: User) => void;
  currentUser: User;
  onUpdateCurrentUser: (updates: Partial<User>) => void;
}

export const Feed: React.FC<FeedProps> = ({ onViewProfile, currentUser, onUpdateCurrentUser }) => {
  const { meals: userMeals, toggleLike, toggleBookmark, deleteMeal } = useMeals(currentUser);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shareModal, setShareModal] = useState<Meal | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'trending'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Combine user meals with mock feed meals
  const publicUserMeals = userMeals.filter(meal => meal.visibility === 'public');
  const allMeals = [...publicUserMeals, ...mockFeedMeals];

  // Filter meals by selected categories
  const filteredMeals = selectedCategories.length === 0 
    ? allMeals 
    : allMeals.filter(meal => 
        selectedCategories.includes(meal.mealType) ||
        meal.tags.some(tag => selectedCategories.includes(tag)) ||
        (selectedCategories.includes('protein') && meal.protein > 25) ||
        (selectedCategories.includes('healthy') && meal.calories < 500) ||
        (selectedCategories.includes('vegan') && meal.tags.includes('vegan')) ||
        (selectedCategories.includes('keto') && meal.tags.includes('keto'))
      );

  return (
    <div className="lg:flex lg:space-x-8 max-w-6xl mx-auto pb-20 lg:pb-0">
      {/* Main Feed */}
      <div className="lg:flex-1 max-w-2xl lg:max-w-none">
        {/* Stories */}
        <Stories currentUser={currentUser} />

        {/* Feed Filter */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-14 lg:top-16 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Feed</h2>
              {selectedCategories.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 font-medium">
                    {selectedCategories.length} filter{selectedCategories.length !== 1 ? 's' : ''} active
                  </span>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCategoryFilter(true)}
                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedCategories.length > 0
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Categories</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
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
        </div>

        {/* Feed Posts */}
        <div className="space-y-6 p-4">
          {filteredMeals.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
              <p className="text-gray-600 mb-4">
                {selectedCategories.length > 0 
                  ? 'Try adjusting your category filters or follow more people'
                  : 'Follow some users to see their posts in your feed'
                }
              </p>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredMeals.map((meal) => (
              <article key={meal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => onViewProfile && onViewProfile(meal.user)}>
                      <img 
                        src={meal.user.avatar} 
                        alt={meal.user.displayName}
                        className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                      />
                    </button>
                    <div>
                      <button 
                        onClick={() => onViewProfile && onViewProfile(meal.user)}
                        className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                        {meal.user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                      </button>
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
                    className="w-full h-80 object-cover cursor-pointer"
                    onClick={() => setSelectedMeal(meal)}
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {meal.calories} cal
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{meal.views}</span>
                  </div>
                </div>
                <MealActions
                  meal={meal}
                  isOwner={meal.userId === currentUser.id}
                  onDelete={deleteMeal}
                  onShare={setShareModal}
                />
                
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
                        onClick={() => setSelectedMeal(meal)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-medium">{meal.comments.length}</span>
                      </button>
                      <button 
                        onClick={() => setShareModal(meal)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <Send className="w-6 h-6" />
                        <span className="font-medium">{meal.shares}</span>
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
                  <div className="text-gray-900 mb-3">
                    <span className="font-semibold">{meal.user.displayName}</span>
                    <span className="ml-2">{meal.description}</span>
                  </div>

                  {/* Tags */}
                  {meal.tags && meal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {meal.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View Comments */}
                  {meal.comments.length > 0 && (
                    <button 
                      onClick={() => setSelectedMeal(meal)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      View all {meal.comments.length} comments
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80 space-y-6 p-4">
        <SuggestedUsers 
          onViewProfile={onViewProfile} 
          onViewAllSuggestions={() => setShowAllSuggestions(true)}
        />
        <TrendingSection />
        <ActivityFeed />
      </div>

      {/* Modals */}
      {selectedMeal && (
        <MealDetail 
          meal={selectedMeal} 
          onClose={() => setSelectedMeal(null)} 
        />
      )}
      
      {shareModal && (
        <SocialShare 
          meal={shareModal} 
          onClose={() => setShareModal(null)} 
        />
      )}
      
      {/* Category Filter Modal */}
      {showCategoryFilter && (
        <FoodCategoryFilter
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          onClose={() => setShowCategoryFilter(false)}
        />
      )}
      
      {/* All Suggestions Modal */}
      {showAllSuggestions && (
        <AllSuggestions
          onClose={() => setShowAllSuggestions(false)}
          onViewProfile={onViewProfile}
          currentUser={currentUser}
          onUpdateCurrentUser={onUpdateCurrentUser}
        />
      )}
    </div>
  );
};