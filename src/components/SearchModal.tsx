import React, { useState } from 'react';
import { Search, X, Hash, TrendingUp, Clock, MapPin, Users, Star } from 'lucide-react';
import type { User, FoodItem } from '../types';

interface SearchModalProps {
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onSelectFood?: (food: FoodItem) => void;
}

const trendingHashtags = [
  '#mealprep', '#keto', '#plantbased', '#proteinpacked', 
  '#healthyeating', '#weightloss', '#bulking', '#vegan'
];

const recentSearches = [
  'chicken breast', 'quinoa bowl', 'protein shake', 'avocado toast'
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'fitnessguru',
    displayName: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Fitness coach helping you reach your goals 💪',
    isFollowing: false,
    followers: 12500,
    following: 234,
    mealsLogged: 892,
    streak: 45,
    badges: [],
    isVerified: true,
    isPremium: true
  } as User,
  {
    id: '2',
    username: 'plantbased_chef',
    displayName: 'Emma Green',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Plant-based recipes for a healthier you 🌱',
    isFollowing: true,
    followers: 8900,
    following: 156,
    mealsLogged: 567,
    streak: 23,
    badges: [],
    isVerified: false,
    isPremium: false
  } as User
];

const mockPlaces = [
  { id: '1', name: 'Green Bowl Cafe', location: 'Downtown', meals: 47, rating: 4.8 },
  { id: '2', name: 'Protein Palace', location: 'Midtown', meals: 32, rating: 4.6 },
  { id: '3', name: 'Fresh & Fit', location: 'Uptown', meals: 28, rating: 4.9 }
];

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    brand: 'Generic',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'protein'
  },
  {
    id: '2',
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    calories: 112,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'grains'
  },
  {
    id: '3',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    sugar: 0.7,
    sodium: 7,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'healthy fats'
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 4,
    sodium: 60,
    servingSize: '170',
    servingUnit: 'g',
    verified: true,
    category: 'dairy'
  },
  {
    id: '5',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'protein'
  },
  {
    id: '6',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    fiber: 2.8,
    sugar: 0.9,
    sodium: 7,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'grains'
  },
  {
    id: '7',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    sodium: 5,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'vegetables'
  },
  {
    id: '8',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4.4,
    sodium: 1,
    servingSize: '100',
    servingUnit: 'g',
    verified: true,
    category: 'nuts'
  }
];

export const SearchModal: React.FC<SearchModalProps> = ({ onClose, onViewProfile, onSelectFood }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'foods' | 'places'>('all');
  const [searchResults, setSearchResults] = useState<{
    users: User[];
    foods: FoodItem[];
    places: any[];
  }>({
    users: [],
    foods: [],
    places: []
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Simulate search results
      const filteredUsers = mockUsers.filter(user => 
        user.displayName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      const filteredPlaces = mockPlaces.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredFoods = mockFoodItems.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        (food.brand && food.brand.toLowerCase().includes(query.toLowerCase())) ||
        (food.category && food.category.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults({
        users: filteredUsers,
        foods: filteredFoods,
        places: filteredPlaces
      });
    } else {
      setSearchResults({ users: [], foods: [], places: [] });
    }
  };

  const hasResults = searchResults.users.length > 0 || searchResults.foods.length > 0 || searchResults.places.length > 0;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users, foods, or places..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            autoFocus
          />
        </div>
      </div>

      {/* Search Tabs */}
      {searchQuery && (
        <div className="flex space-x-1 p-4 bg-gray-50 border-b border-gray-200">
          {['all', 'users', 'foods', 'places'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                activeTab === tab 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!searchQuery ? (
          <div className="p-4 space-y-6">
            {/* Trending Hashtags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
                Trending Hashtags
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    onClick={() => handleSearch(hashtag)}
                    className="flex items-center space-x-1 px-3 py-2 bg-pink-50 text-pink-700 rounded-full text-sm hover:bg-pink-100 transition-colors"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{hashtag.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Places */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Popular Places
              </h3>
              <div className="space-y-3">
                {mockPlaces.map((place) => (
                  <div key={place.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                            <div className="font-semibold text-gray-900">{place.name}</div>
                            <div className="text-sm text-gray-600">{place.location}</div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span>{place.rating}</span>
                              </div>
                              <div className="text-gray-500">{place.meals} meals</div>
                            </div>
                          </div>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            View
                          </button>
                      </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {!hasResults ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">Try searching for something else</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Users Results */}
                {(activeTab === 'all' || activeTab === 'users') && searchResults.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Users ({searchResults.users.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <img 
                            src={user.avatar} 
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold text-gray-900">{user.displayName}</div>
                              {user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                              {user.isPremium && (
                                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">@{user.username}</div>
                            <div className="text-xs text-gray-500">{user.followers.toLocaleString()} followers</div>
                          </div>
                          <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            user.isFollowing 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}>
                            {user.isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Foods Results */}
                {(activeTab === 'all' || activeTab === 'foods') && searchResults.foods.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Foods ({searchResults.foods.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.foods.map((food) => (
                        <div 
                          key={food.id} 
                          onClick={() => onSelectFood && onSelectFood(food)}
                          className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">
                              {food.category === 'protein' && '🥩'}
                              {food.category === 'grains' && '🌾'}
                              {food.category === 'vegetables' && '🥬'}
                              {food.category === 'dairy' && '🥛'}
                              {food.category === 'healthy fats' && '🥑'}
                              {food.category === 'nuts' && '🥜'}
                              {!['protein', 'grains', 'vegetables', 'dairy', 'healthy fats', 'nuts'].includes(food.category || '') && '🍽️'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold text-gray-900">{food.name}</div>
                              {food.verified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                            </div>
                            {food.brand && (
                              <div className="text-sm text-gray-600">{food.brand}</div>
                            )}
                            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                              <span>{food.calories} cal</span>
                              <span>{food.protein}g protein</span>
                              <span>per {food.servingSize}{food.servingUnit}</span>
                              {food.category && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  {food.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{food.calories}</div>
                            <div className="text-xs text-gray-600">cal</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Places Results */}
                {(activeTab === 'all' || activeTab === 'places') && searchResults.places.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Places ({searchResults.places.length})
                    </h3>
                    <div className="space-y-3">
                      {searchResults.places.map((place) => (
                        <div key={place.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{place.name}</div>
                              <div className="text-sm text-gray-600">{place.location}</div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span>{place.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{place.meals} meals logged</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};