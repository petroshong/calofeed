import React, { useState } from 'react';
import { Search, UserPlus, UserCheck, Users, MapPin, Star, Crown, Filter, Smartphone, Mail, Facebook, Instagram, Twitter, QrCode, Copy, Share2, X } from 'lucide-react';
import type { User } from '../types';

interface FindFriendsProps {
  currentUser: User;
  onViewProfile: (user: User) => void;
  onUpdateCurrentUser: (updates: Partial<User>) => void;
}

const mockUsers: User[] = [
  {
    id: '2',
    username: 'healthyeats',
    displayName: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Nutritionist sharing healthy meal ideas 🥗 Plant-based recipes & wellness tips',
    isFollowing: false,
    followers: 8934,
    following: 456,
    mealsLogged: 567,
    streak: 23,
    badges: [],
    location: 'Los Angeles, CA',
    isVerified: true,
    isPremium: false,
    isInfluencer: false,
    mutualFollowers: 12,
    commonInterests: ['plant-based', 'meal-prep']
  } as User,
  {
    id: '3',
    username: 'fitnessguru',
    displayName: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Personal trainer & nutrition coach 💪 Helping you reach your fitness goals',
    isFollowing: true,
    followers: 15623,
    following: 234,
    mealsLogged: 892,
    streak: 45,
    badges: [],
    location: 'New York, NY',
    isVerified: true,
    isPremium: true,
    isInfluencer: true,
    mutualFollowers: 8,
    commonInterests: ['protein', 'fitness']
  } as User,
  {
    id: '4',
    username: 'plantbased_chef',
    displayName: 'Emma Green',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Professional chef specializing in plant-based cuisine 🌱 Cookbook author',
    isFollowing: false,
    followers: 23456,
    following: 189,
    mealsLogged: 1247,
    streak: 67,
    badges: [],
    location: 'San Francisco, CA',
    isVerified: true,
    isPremium: true,
    isInfluencer: true,
    mutualFollowers: 15,
    commonInterests: ['vegan', 'cooking']
  } as User
];

export const FindFriends: React.FC<FindFriendsProps> = ({ currentUser, onViewProfile, onUpdateCurrentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeTab, setActiveTab] = useState<'discover' | 'contacts' | 'social' | 'nearby'>('discover');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newFollowingState = !user.isFollowing;
        // Update current user's following count
        onUpdateCurrentUser({
          following: newFollowingState ? currentUser.following + 1 : currentUser.following - 1
        });
        return {
          ...user,
          isFollowing: newFollowingState,
          followers: newFollowingState ? user.followers + 1 : user.followers - 1
        };
      }
      return user;
    }));
  };

  const inviteLink = `https://eatsocial.app/invite/${currentUser.username}`;

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 lg:pb-0 px-4 lg:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-xl lg:mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Find Friends</h1>
            <p className="text-blue-100">Connect with people who share your food journey</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentUser.following}</div>
            <div className="text-sm text-blue-200">Following</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, or interests..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'discover' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'contacts' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'social' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Social
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'nearby' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Nearby
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Invite Friends Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Invite Friends</h2>
                  <p className="text-green-700 text-sm">Share EatSocial with your friends</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Invite</span>
                </button>
              </div>
            </div>

            {/* Suggested Users */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested for You</h2>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <button onClick={() => onViewProfile(user)}>
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-16 h-16 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                        />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <button 
                            onClick={() => onViewProfile(user)}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {user.displayName}
                          </button>
                          {user.isVerified && <Star className="w-5 h-5 text-blue-500 fill-current" />}
                          {user.isPremium && (
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>
                          )}
                          {user.isInfluencer && <Crown className="w-5 h-5 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">@{user.username}</p>
                        <p className="text-gray-700 mb-3">{user.bio}</p>
                        
                        {user.location && (
                          <div className="flex items-center space-x-1 text-gray-600 text-sm mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>{user.followers.toLocaleString()} followers</span>
                          <span>{user.streak} day streak</span>
                          {user.mutualFollowers && user.mutualFollowers > 0 && (
                            <span className="text-blue-600">{user.mutualFollowers} mutual</span>
                          )}
                        </div>

                        {user.commonInterests && user.commonInterests.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {user.commonInterests.map((interest) => (
                              <span key={interest} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                #{interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => toggleFollow(user.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            user.isFollowing 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                        <button 
                          onClick={() => onViewProfile(user)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Contacts</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Smartphone className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Phone Contacts</div>
                    <div className="text-sm text-gray-600">Find friends from your phone contacts</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Email Contacts</div>
                    <div className="text-sm text-gray-600">Import from Gmail, Outlook, etc.</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect Social Accounts</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Facebook</div>
                      <div className="text-sm text-gray-600">Find friends from Facebook</div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Instagram</div>
                      <div className="text-sm text-gray-600">Connect your Instagram account</div>
                    </div>
                  </div>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                    Connect
                  </button>
                </button>

                <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-6 h-6 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Twitter</div>
                      <div className="text-sm text-gray-600">Find Twitter connections</div>
                    </div>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    Connect
                  </button>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">People Nearby</h2>
              </div>
              <p className="text-purple-700 text-sm mb-4">
                Find EatSocial users in your area who share similar food interests
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Enable Location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Invite Friends</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Invite Link</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-mono break-all">
                  {inviteLink}
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Join me on EatSocial! 🍽️\n\nI'm tracking my nutrition and sharing my food journey. Come follow my progress!\n\n${inviteLink}`);
                  alert('Invite link copied!');
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Copy Invite Link</span>
              </button>
              
              <button
                onClick={() => {
                  const shareText = `Join me on EatSocial! 🍽️\n\nI'm tracking my nutrition and sharing my food journey. Come follow my progress!\n\n${inviteLink}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join me on EatSocial!',
                      text: shareText
                    });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert('Invite message copied!');
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Invite</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};