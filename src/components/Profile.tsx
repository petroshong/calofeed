import React, { useState } from 'react';
import { Settings, UserPlus, UserCheck, MapPin, Calendar, Target, Flame, Trophy, Star, Grid, List, Link, Shield, Crown, MessageCircle, MoreHorizontal, Edit3, Instagram, Twitter, Youtube, ExternalLink, Share2, Copy, Heart, X, Camera, Eye } from 'lucide-react';
import { FollowersModal } from './FollowersModal';
import { SocialShare } from './SocialShare';
import { EditProfile } from './EditProfile';
import { MealActions } from './MealActions';
import { CalorieTracker } from './CalorieTracker';
import { useMeals } from '../hooks/useMeals';
import type { User, Meal, WeightEntry } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const mockMeals: Meal[] = [
  {
    id: '1',
    userId: 'user1',
    description: 'Healthy breakfast bowl',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400',
    timestamp: new Date().toISOString(),
    calories: 450,
    protein: 25,
    carbs: 35,
    fat: 18,
    fiber: 8,
    sugar: 12,
    sodium: 320,
    likes: 24,
    comments: [],
    views: 156,
    tags: [],
    visibility: 'public'
  }
];

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const { getUserMeals, deleteMeal } = useMeals(user);
  const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState<'followers' | 'following' | null>(null);
  const [showShareProfile, setShowShareProfile] = useState(false);
  const [showCalorieTracker, setShowCalorieTracker] = useState(false);

  const userMeals = getUserMeals(user.id);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative">
          {/* Cover Image */}
          <div 
            className="h-32 lg:h-48 relative bg-cover bg-center"
            style={{ 
              backgroundImage: user.coverImage 
                ? `url(${user.coverImage})` 
                : 'linear-gradient(to right, #10b981, #059669)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            {user.isPremium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Crown className="w-4 h-4" />
                <span>PRO</span>
              </div>
            )}
            {user.isInfluencer && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Crown className="w-4 h-4" />
                <span>CREATOR</span>
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="px-4 lg:px-8 pb-6">
            <div className="relative -mt-16 lg:-mt-20">
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white object-cover mx-auto lg:mx-0 shadow-lg"
              />
            </div>
            
            <div className="text-center lg:text-left lg:flex lg:items-start lg:justify-between mt-4">
              <div className="lg:flex-1">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{user.displayName}</h1>
                  {user.isVerified && <Star className="w-6 h-6 text-blue-500 fill-current" />}
                  {user.isInfluencer && <Crown className="w-6 h-6 text-yellow-500 fill-current" />}
                </div>
                <p className="text-gray-600 text-lg">@{user.username}</p>
                
                {/* Level and XP */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 mt-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Level {user.level}</span>
                  </div>
                  <div className="text-sm text-gray-600">{user.xp.toLocaleString()} XP</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">{user.socialScore}/100</span>
                  </div>
                </div>

                {user.location && (
                  <div className="flex items-center justify-center lg:justify-start space-x-1 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {/* Social Links */}
                {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mt-2">
                    {Object.entries(user.socialLinks).map(([platform, handle]) => (
                      <a
                        key={platform}
                        href={platform === 'website' ? `https://${handle}` : `https://${platform}.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {getSocialIcon(platform)}
                        <span>{handle}</span>
                      </a>
                    ))}
                  </div>
                )}
                
                <p className="text-gray-700 mt-2 max-w-md mx-auto lg:mx-0">{user.bio}</p>
                
                {/* Dietary Preferences */}
                {user.dietaryPreferences.length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-3">
                    {user.dietaryPreferences.map((pref) => (
                      <span key={pref} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex justify-center lg:justify-start space-x-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{user.mealsLogged}</div>
                    <div className="text-sm text-gray-600">Meals</div>
                  </div>
                  <button 
                    onClick={() => setShowFollowersModal('followers')}
                    className="text-center hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="text-xl font-bold text-gray-900">{user.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </button>
                  <button 
                    onClick={() => setShowFollowersModal('following')}
                    className="text-center hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="text-xl font-bold text-gray-900">{user.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </button>
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
                  onClick={() => setShowShareProfile(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setShowCalorieTracker(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Track Calories</span>
                </button>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
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
                  <MoreHorizontal className="w-5 h-5" />
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

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-2xl font-bold text-pink-700">{user.totalLikes}</span>
          </div>
          <p className="text-sm font-medium text-pink-800">Total Likes</p>
          <p className="text-xs text-pink-600">All time</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="px-4 lg:px-8 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Badges</h2>
        <div className="flex space-x-3 overflow-x-auto">
          {user.badges.map((badge, index) => (
            <div key={badge.id} className={`bg-white border rounded-lg p-3 text-center min-w-[100px] flex-shrink-0 ${
              badge.rarity === 'legendary' ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' :
              badge.rarity === 'epic' ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' :
              badge.rarity === 'rare' ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50' :
              'border-gray-200'
            }`}>
              <div className="text-2xl mb-1">{badge.emoji}</div>
              <p className="text-xs font-medium text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-600">{badge.description}</p>
              {badge.rarity !== 'common' && (
                <div className={`text-xs font-bold mt-1 ${
                  badge.rarity === 'legendary' ? 'text-yellow-600' :
                  badge.rarity === 'epic' ? 'text-purple-600' :
                  'text-blue-600'
                }`}>
                  {badge.rarity.toUpperCase()}
                </div>
              )}
            </div>
          ))}
          {user.badges.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center min-w-[200px]">
              <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No badges yet</p>
              <p className="text-xs text-gray-500">Complete challenges to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="px-4 lg:px-8 mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">6/7</div>
              <div className="text-sm text-gray-600">Goals Hit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">21</div>
              <div className="text-sm text-gray-600">Meals Logged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1,847</div>
              <div className="text-sm text-gray-600">Avg Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">142g</div>
              <div className="text-sm text-gray-600">Avg Protein</div>
            </div>
          </div>
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
          userMeals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meals Yet</h3>
              <p className="text-gray-600">Start logging your meals to see them here!</p>
            </div>
          ) : (
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
                      <div className="text-sm flex items-center justify-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{meal.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{meal.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Meal Actions for Owner */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MealActions
                      meal={meal}
                      isOwner={true}
                      onDelete={deleteMeal}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          userMeals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meals Yet</h3>
              <p className="text-gray-600">Start logging your meals to see them here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userMeals.map((meal) => (
                <div key={meal.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <img 
                      src={meal.image} 
                      alt="Meal"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{meal.description}</p>
                          <p className="text-sm text-gray-600 mt-1">{new Date(meal.timestamp).toLocaleDateString()}</p>
                          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                            <span>{meal.calories} cal</span>
                            <span>{meal.protein}g protein</span>
                            <span className="flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>{meal.likes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{meal.views}</span>
                            </span>
                          </div>
                        </div>
                        <MealActions
                          meal={meal}
                          isOwner={true}
                          onDelete={deleteMeal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Modals */}
      {showFollowersModal && (
        <FollowersModal 
          user={user} 
          type={showFollowersModal} 
          onClose={() => setShowFollowersModal(null)} 
        />
      )}
      
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          user={user}
          onClose={() => setShowEditProfile(false)}
          onUpdateUser={onUpdateUser}
        />
      )}
      
      {showShareProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share Profile</h2>
              <button
                onClick={() => setShowShareProfile(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <img 
                  src={user.avatar} 
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-xs text-gray-500 mt-2">{user.followers.toLocaleString()} followers • {user.streak} day streak</p>
              </div>
              
              <button
                onClick={() => navigator.clipboard.writeText(`Check out ${user.displayName}'s profile on EatSocial! https://eatsocial.app/profile/${user.username}`)}
                className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Copy Profile Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Calorie Tracker Modal */}
      {showCalorieTracker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Calorie Tracker</h2>
              <button
                onClick={() => setShowCalorieTracker(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <CalorieTracker user={user} onUpdateUser={onUpdateUser} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};