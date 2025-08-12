import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Clock, User as UserIcon, Flag, Copy, Send, Eye, Star, Grid, List, Lock, Filter, ChevronDown, Bookmark, Zap, TrendingUp, Calendar } from 'lucide-react';
import { Stories } from './Stories';
import { SuggestedUsers } from './SuggestedUsers';
import { ActivityFeed } from './ActivityFeed';
import { TrendingSection } from './TrendingSection';
import { SocialShare } from './SocialShare';
import { MealDetail } from './MealDetail';
import { FoodCategoryFilter } from './FoodCategoryFilter';
import { HashtagFeed } from './HashtagFeed';
import { AllSuggestions } from './AllSuggestions';
import { MealActions } from './MealActions';
import { GuestBanner } from './GuestBanner';
import { useMeals } from '../hooks/useMeals';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { useFollowing } from '../hooks/useFollowing';
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
  isGuest?: boolean;
  onAuthRequired?: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onViewProfile, currentUser, onUpdateCurrentUser, isGuest, onAuthRequired }) => {
  const { meals: userMeals, toggleLike, toggleBookmark, deleteMeal } = useMeals(currentUser);
  const { areFriends } = useFriendRequests(currentUser);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shareModal, setShareModal] = useState<Meal | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'trending'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [showHashtagFeed, setShowHashtagFeed] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { isFollowing } = useFollowing(currentUser);

  // Combine user meals with mock feed meals
  const publicUserMeals = userMeals.filter(meal => meal.visibility === 'public');
  
  // Filter meals based on privacy settings
  let visibleMeals = [...publicUserMeals, ...mockFeedMeals.map(meal => ({
    ...meal,
    user: {
      ...meal.user,
      isFollowing: isFollowing(meal.user.id)
    }
  })).filter(meal => {
    // If the meal owner has a private account
    if (meal.user.isPrivate) {
      // Only show if they're friends or it's the current user
      return areFriends(meal.user.id) || meal.user.id === currentUser.id;
    }
    // Public accounts - show all public meals
    return meal.visibility === 'public';
  })];

  // Apply feed filter
  if (feedFilter === 'following') {
    visibleMeals = visibleMeals.filter(meal => 
      meal.userId === currentUser.id || isFollowing(meal.user.id)
    );
  } else if (feedFilter === 'trending') {
    // Sort by engagement score (likes + comments + shares)
    visibleMeals = visibleMeals.sort((a, b) => {
      const aEngagement = a.likes + a.comments.length + a.shares;
      const bEngagement = b.likes + b.comments.length + b.shares;
      return bEngagement - aEngagement;
    });
  }

  // Filter meals by selected categories
  const filteredMeals = selectedCategories.length === 0 
    ? visibleMeals 
    : visibleMeals.filter(meal => 
        selectedCategories.includes(meal.mealType) ||
        meal.tags.some(tag => selectedCategories.includes(tag)) ||
        (selectedCategories.includes('protein') && meal.protein > 25) ||
        (selectedCategories.includes('healthy') && meal.calories < 500) ||
        (selectedCategories.includes('vegan') && meal.tags.includes('vegan')) ||
        (selectedCategories.includes('keto') && meal.tags.includes('keto'))
      );

  return (
    <div className="lg:flex lg:space-x-4 xl:space-x-6 max-w-none pb-20 lg:pb-0">
      {/* Main Feed */}
      <div className="lg:flex-1 lg:max-w-none xl:max-w-4xl">
        {/* Guest Banner */}
        {isGuest && (
          <div className="p-4">
            <GuestBanner onSignUp={() => onAuthRequired?.()} />
          </div>
        )}

        {/* Stories */}
        {!isGuest && currentUser && <Stories currentUser={currentUser} />}

        {/* Feed Filter */}
        <div className="bg-white border-b border-gray-200 p-3 lg:p-4 sticky top-14 lg:top-16 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">Your Feed</h2>
              <div className="hidden sm:flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              {selectedCategories.length > 0 && (
                <div className="hidden sm:flex items-center space-x-2">
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
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => setShowCategoryFilter(true)}
                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedCategories.length > 0
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="capitalize">{feedFilter}</span>
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
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

        {/* Quick Stats Bar */}
        <div className="bg-white border-b border-gray-200 p-3 lg:p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-3 lg:space-x-6 text-xs lg:text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{filteredMeals.length} posts</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-pink-500" />
                <span className="text-gray-700">Trending: #mealprep</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Today: {Math.floor(Math.random() * 15) + 5} meals</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <button 
                  onClick={() => alert('Location Activity! 📍\n\n47 check-ins today across the community:\n• Green Bowl Cafe: 12 check-ins\n• Protein Palace: 8 check-ins\n• Fresh & Fit: 6 check-ins\n• And 21 more locations...')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  47 check-ins today
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Live feed</span>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        <div className={viewMode === 'grid' ? 'p-3 lg:p-4' : 'space-y-4 lg:space-y-6 p-3 lg:p-4'}>
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
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-4">
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className="aspect-square relative group cursor-pointer">
                    <img 
                      src={meal.image} 
                      alt="Meal"
                      className="w-full h-full object-cover rounded-xl"
                      onClick={() => setSelectedMeal(meal)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-xl flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 text-center">
                        <div className="font-bold text-sm lg:text-lg mb-1">{meal.calories} cal</div>
                        <div className="text-xs lg:text-sm flex items-center justify-center space-x-2 lg:space-x-3">
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
                    <div className="absolute top-2 lg:top-3 left-2 lg:left-3">
                      <img 
                        src={meal.user.avatar} 
                        alt={meal.user.displayName}
                        className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                      {meal.user.isPrivate && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Lock className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Calorie Badge */}
                    <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {meal.calories} cal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <article key={meal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Post Header */}
                  <div className="p-3 lg:p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => onViewProfile && onViewProfile(meal.user)}>
                        <img 
                          src={meal.user.avatar} 
                          alt={meal.user.displayName}
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                        />
                      </button>
                      <div>
                        <button 
                          onClick={() => onViewProfile && onViewProfile(meal.user)}
                          className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                          {meal.user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                          {meal.user.isPrivate && <Lock className="w-4 h-4 text-yellow-500" />}
                        </button>
                        <div className="flex items-center text-xs lg:text-sm text-gray-500 space-x-2">
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
                    <MealActions
                      meal={meal}
                      isOwner={meal.userId === currentUser.id}
                      onDelete={deleteMeal}
                      onShare={setShareModal}
                    />
                  </div>

                  {/* Food Image */}
                  <div className="relative">
                    <img 
                      src={meal.image} 
                      alt="Food"
                      className="w-full h-64 lg:h-80 object-cover cursor-pointer"
                      onClick={() => setSelectedMeal(meal)}
                    />
                    <div className="absolute top-3 lg:top-4 right-3 lg:right-4 bg-black bg-opacity-50 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                      {meal.calories} cal
                    </div>
                    <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 flex items-center space-x-1 text-white text-xs lg:text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{meal.views}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 lg:p-4">
                    {/* Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <button 
                          onClick={() => toggleLike(meal.id)}
                          className={`flex items-center space-x-2 ${
                            meal.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          } transition-colors`}
                        >
                          <Heart className={`w-6 h-6 ${meal.isLiked ? 'fill-current' : ''}`} />
                          <span className="font-medium text-sm lg:text-base">{meal.likes}</span>
                        </button>
                        <button 
                          onClick={() => setSelectedMeal(meal)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-medium text-sm lg:text-base">{meal.comments.length}</span>
                        </button>
                        <button 
                          onClick={() => setShareModal(meal)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <Send className="w-6 h-6" />
                          <span className="font-medium text-sm lg:text-base">{meal.shares}</span>
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
                      <span className="ml-2">
                        {meal.description.split(/(\s|^)(#\w+)/g).map((part, index) => {
                          if (part.match(/^#\w+/)) {
                            return (
                              <button
                                key={index}
                                onClick={() => setShowHashtagFeed(part.slice(1))}
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                              >
                                {part}
                              </button>
                            );
                          }
                          return <span key={index}>{part}</span>;
                        })}
                      </span>
                    </div>

                    {/* Tags */}
                    {meal.tags && meal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {meal.tags.map((tag) => (
                          <button 
                            key={tag} 
                            onClick={() => setShowHashtagFeed(tag)}
                            className="px-2 lg:px-3 py-1 bg-blue-50 text-blue-700 text-xs lg:text-sm rounded-full cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all duration-200 font-medium"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* View Comments */}
                    {meal.comments.length > 0 && (
                      <button 
                        onClick={() => setSelectedMeal(meal)}
                        className="text-gray-600 hover:text-gray-900 text-xs lg:text-sm font-medium"
                      >
                        View all {meal.comments.length} comments
                      </button>
                    )}
                  </div>
                </article>
              ))
            )
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80 xl:w-96 space-y-4 lg:space-y-6 p-4">
        <SuggestedUsers 
          currentUser={currentUser}
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
          onViewProfile={onViewProfile} 
          onViewAllSuggestions={() => setShowAllSuggestions(true)}
          onUpdateCurrentUser={onUpdateCurrentUser}
        />
        <TrendingSection onHashtagClick={setShowHashtagFeed} />
        <TrendingSection
          onHashtagClick={setShowHashtagFeed}
          onLocationClick={(location) => {
            // Show location-based content
            alert(`Showing meals from ${location}! 📍\n\nThis would normally show all meals logged at this location.`);
          }}
          onTrendingClick={(item) => {
            if (item.type === 'meal') {
              alert(`Trending meal: ${item.name}! 🔥\n\nThis viral meal has ${item.count} likes and is trending +${item.trend}% this week!`);
            } else if (item.type === 'location') {
              alert(`Popular location: ${item.name}! 📍\n\n${item.count} check-ins this week with ${item.engagement}% engagement rate.`);
            }
          }}
          onViewAllTrending={() => {
            alert('View All Trending! 📈\n\nThis would show a comprehensive trending page with:\n• Top hashtags\n• Popular locations\n• Viral meals\n• Rising creators\n• Weekly challenges');
          }}
        />
        <ActivityFeed 
          onHashtagClick={setShowHashtagFeed}
          onLocationClick={(location) => {
            console.log('Location clicked from activity:', location);
            // Could implement location-based content here
          }}
          onActivityClick={(activity) => {
            if (activity.type === 'meal_logged' && activity.data.mealId) {
              // Navigate to the specific meal
              const meal = filteredMeals.find(m => m.id === activity.data.mealId);
              if (meal) {
                setSelectedMeal(meal);
              }
            } else if (activity.type === 'location_checkin') {
              // Could show location details or meals from that location
              console.log('Location check-in clicked:', activity.data.location);
            } else if (activity.type === 'goal_achieved') {
              // Navigate to calorie tracker
              setCurrentView('calories');
            } else if (activity.type === 'badge_earned') {
              // Navigate to profile to see badges
              setCurrentView('profile');
            } else if (activity.type === 'challenge_joined') {
              // Navigate to challenges
              setCurrentView('challenges');
            } else if (activity.type === 'streak_milestone') {
              // Navigate to profile
              setCurrentView('profile');
            } else if (activity.type === 'weight_milestone') {
              // Navigate to profile weight section
              setCurrentView('profile');
            }
          }}
        />
      </div>

      {/* Modals */}
      {selectedMeal && (
        <MealDetail 
          meal={selectedMeal} 
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
          onClose={() => setSelectedMeal(null)} 
          onHashtagClick={setShowHashtagFeed}
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
      
      {/* Hashtag Feed Modal */}
      {showHashtagFeed && (
        <HashtagFeed
          hashtag={showHashtagFeed}
          onClose={() => setShowHashtagFeed(null)}
          allMeals={filteredMeals}
        />
      )}
    </div>
  );
};