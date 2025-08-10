import React, { useState } from 'react';
import { ArrowLeft, UserPlus, UserCheck, MessageCircle, Share2, MoreHorizontal, MapPin, Calendar, Target, Flame, Trophy, Star, Grid, List, Crown, Copy, X, Heart, Eye } from 'lucide-react';
import { FollowersModal } from './FollowersModal';
import { SocialShare } from './SocialShare';
import { useMeals } from '../hooks/useMeals';
import type { User, Meal } from '../types';

    isBookmarked: false,
    shares: 12,
    views: 456,
    tags: ['preworkout', 'protein'],
    visibility: 'public'
  }
];

export const UserProfile: React.FC<UserProfileProps> = ({ user, currentUser, onBack, onUpdateCurrentUser }) => {
  const { getUserMeals } = useMeals(currentUser);
  const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [showFollowersModal, setShowFollowersModal] = useState<'followers' | 'following' | null>(null);
  const [showShareProfile, setShowShareProfile] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followers);

  const userMeals = getUserMeals(user.id);

  const toggleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setFollowerCount(prev => newFollowingState ? prev + 1 : prev - 1);
    
    // Update current user's following count
    onUpdateCurrentUser({
      following: newFollowingState ? currentUser.following + 1 : currentUser.following - 1
    });
  };

  const shareProfile = () => {
    const shareText = `Check out ${user.displayName}'s profile on EatSocial! 🍽️\n\n${user.bio}\n\n${followerCount.toLocaleString()} followers • ${user.streak} day streak\n\nhttps://eatsocial.app/profile/${user.username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName} on EatSocial`,
        text: shareText,
        url: `https://eatsocial.app/profile/${user.username}`
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Mobile Back Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

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
                </div>
                <p className="text-gray-600 text-lg">@{user.username}</p>
                
                {user.location && (
                  <div className="flex items-center justify-center lg:justify-start space-x-1 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                <p className="text-gray-700 mt-2 max-w-md mx-auto lg:mx-0">{user.bio}</p>
                
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
                    <div className="text-xl font-bold text-gray-900">{followerCount.toLocaleString()}</div>
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
                    <div className="text-xl font-bold text-orange-600 flex items-center justify-center">
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
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
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
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meals Shared</h3>
              <p className="text-gray-600">This user hasn't shared any meals yet.</p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Meals Shared</h3>
              <p className="text-gray-600">This user hasn't shared any meals yet.</p>
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
                <p className="text-xs text-gray-500 mt-2">{followerCount.toLocaleString()} followers • {user.streak} day streak</p>
              </div>
              
              <button
                onClick={() => {
                  const shareText = `Check out ${user.displayName}'s profile on EatSocial! https://eatsocial.app/profile/${user.username}`;
                  navigator.clipboard.writeText(shareText);
                  alert('Profile link copied!');
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Copy Profile Link</span>
              </button>
              
              <button
                onClick={shareProfile}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};