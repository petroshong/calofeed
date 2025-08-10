import React, { useState } from 'react';
import { Settings, UserPlus, UserCheck, MapPin, Calendar, Target, Flame, Trophy, Star, Grid, List } from 'lucide-react';
import type { User, Meal } from '../App';

interface ProfileProps {
  user: User;
}

const userMeals: Meal[] = [
  {
    id: '1',
    userId: '1',
    user: {} as User,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Grilled salmon with quinoa',
    calories: 520,
    protein: 42,
    carbs: 35,
    fat: 22,
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: '2',
    userId: '1',
    user: {} as User,
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Greek yogurt with berries',
    calories: 340,
    protein: 20,
    carbs: 45,
    fat: 8,
    timestamp: '1 day ago',
    likes: 18,
    comments: 3,
    isLiked: true
  },
  {
    id: '3',
    userId: '1',
    user: {} as User,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Buddha bowl',
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 16,
    timestamp: '2 days ago',
    likes: 31,
    comments: 12,
    isLiked: false
  }
];

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 lg:h-48 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          
          {/* Profile Info */}
          <div className="px-4 lg:px-8 pb-6">
            <div className="relative -mt-16 lg:-mt-20">
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white object-cover mx-auto lg:mx-0"
              />
            </div>
            
            <div className="text-center lg:text-left lg:flex lg:items-start lg:justify-between mt-4">
              <div className="lg:flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{user.displayName}</h1>
                <p className="text-gray-600 text-lg">@{user.username}</p>
                <p className="text-gray-700 mt-2 max-w-md mx-auto lg:mx-0">{user.bio}</p>
                
                {/* Stats */}
                <div className="flex justify-center lg:justify-start space-x-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{user.mealsLogged}</div>
                    <div className="text-sm text-gray-600">Meals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{user.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{user.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600 flex items-center">
                      <Flame className="w-5 h-5 mr-1" />
                      {user.streak}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center lg:justify-end space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={toggleFollow}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Message
                </button>
                <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 lg:p-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{Math.round((user.caloriesConsumed / user.dailyCalorieGoal) * 100)}%</span>
          </div>
          <p className="text-sm font-medium text-green-800">Goal Progress</p>
          <p className="text-xs text-green-600">Daily average</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700">{user.streak}</span>
          </div>
          <p className="text-sm font-medium text-orange-800">Current Streak</p>
          <p className="text-xs text-orange-600">Days logging</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">{user.badges.length}</span>
          </div>
          <p className="text-sm font-medium text-purple-800">Badges Earned</p>
          <p className="text-xs text-purple-600">Achievements</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">4.8</span>
          </div>
          <p className="text-sm font-medium text-blue-800">Nutrition Score</p>
          <p className="text-xs text-blue-600">This week</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="px-4 lg:px-8 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Badges</h2>
        <div className="flex space-x-3">
          {user.badges.map((badge, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-2xl mb-1">{badge}</div>
              <p className="text-xs text-gray-600">Week Goal</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center space-x-8 p-4">
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex items-center space-x-2 py-2 px-4 border-b-2 transition-colors ${
              activeTab === 'grid' 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-2 py-2 px-4 border-b-2 transition-colors ${
              activeTab === 'list' 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="font-medium">List</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {activeTab === 'grid' ? (
          <div className="grid grid-cols-3 gap-1 lg:gap-4">
            {userMeals.map((meal) => (
              <div key={meal.id} className="aspect-square relative group cursor-pointer">
                <img 
                  src={meal.image} 
                  alt="Meal"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 text-center">
                    <div className="font-bold">{meal.calories} cal</div>
                    <div className="text-sm">{meal.likes} likes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {userMeals.map((meal) => (
              <div key={meal.id} className="bg-white border border-gray-200 rounded-lg p-4 flex space-x-4">
                <img 
                  src={meal.image} 
                  alt="Meal"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{meal.description}</p>
                  <p className="text-sm text-gray-600 mt-1">{meal.timestamp}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                    <span>{meal.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};