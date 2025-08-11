import React, { useState } from 'react';
import { X, Search, Filter, UserPlus, UserCheck, Star, Crown, MapPin, Flame, Trophy, Users, TrendingUp } from 'lucide-react';
import type { User } from '../types';
import { useFollowing } from '../hooks/useFollowing';

interface AllSuggestionsProps {
  onClose: () => void;
  onViewProfile: (user: User) => void;
  currentUser: User;
  onUpdateCurrentUser: (updates: Partial<User>) => void;
}

const allSuggestedUsers: User[] = [
  {
    id: '1',
    username: 'chef_maria',
    displayName: 'Chef Maria Rodriguez',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Professional chef sharing healthy restaurant-quality meals 👩‍🍳',
    isFollowing: false,
    followers: 45623,
    following: 234,
    mealsLogged: 1247,
    streak: 89,
    badges: [],
    location: 'New York, NY',
    isVerified: true,
    isPremium: true,
    isInfluencer: true,
    level: 25,
    socialScore: 98,
    mutualFollowers: 12,
    commonInterests: ['healthy-cooking', 'meal-prep']
  } as User,
  {
    id: '2',
    username: 'macro_master',
    displayName: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Bodybuilder sharing macro-friendly recipes 💪',
    isFollowing: false,
    followers: 23456,
    following: 145,
    mealsLogged: 892,
    streak: 156,
    badges: [],
    location: 'Los Angeles, CA',
    isVerified: false,
    isPremium: true,
    isInfluencer: false,
    level: 18,
    socialScore: 87,
    mutualFollowers: 8,
    commonInterests: ['protein', 'bodybuilding']
  } as User,
  {
    id: '3',
    username: 'wellness_warrior',
    displayName: 'Lisa Chen',
    avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Wellness coach helping you find balance 🧘‍♀️',
    isFollowing: false,
    followers: 18934,
    following: 567,
    mealsLogged: 654,
    streak: 45,
    badges: [],
    location: 'Austin, TX',
    isVerified: true,
    isPremium: false,
    isInfluencer: false,
    level: 15,
    socialScore: 91,
    mutualFollowers: 15,
    commonInterests: ['wellness', 'mindful-eating']
  } as User,
  {
    id: '4',
    username: 'keto_queen',
    displayName: 'Amanda Davis',
    avatar: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Keto lifestyle advocate 🥑 Down 50lbs and counting!',
    isFollowing: false,
    followers: 12789,
    following: 234,
    mealsLogged: 445,
    streak: 67,
    badges: [],
    location: 'Miami, FL',
    isVerified: false,
    isPremium: true,
    isInfluencer: false,
    level: 12,
    socialScore: 85,
    mutualFollowers: 6,
    commonInterests: ['keto', 'weight-loss']
  } as User,
  {
    id: '5',
    username: 'plant_power',
    displayName: 'Jordan Martinez',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Plant-based athlete proving plants = power 🌱💚',
    isFollowing: false,
    followers: 34567,
    following: 123,
    mealsLogged: 789,
    streak: 123,
    badges: [],
    location: 'Portland, OR',
    isVerified: true,
    isPremium: true,
    isInfluencer: true,
    level: 20,
    socialScore: 94,
    mutualFollowers: 23,
    commonInterests: ['plant-based', 'athletics']
  } as User,
  {
    id: '6',
    username: 'fitness_foodie',
    displayName: 'Ryan Thompson',
    avatar: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Combining fitness and food for optimal performance 🏋️‍♂️',
    isFollowing: false,
    followers: 9876,
    following: 345,
    mealsLogged: 567,
    streak: 34,
    badges: [],
    location: 'Chicago, IL',
    isVerified: false,
    isPremium: false,
    isInfluencer: false,
    level: 14,
    socialScore: 78,
    mutualFollowers: 4,
    commonInterests: ['fitness', 'meal-timing']
  } as User
];

export const AllSuggestions: React.FC<AllSuggestionsProps> = ({ onClose, onViewProfile, currentUser, onUpdateCurrentUser }) => {
  const { followUser, unfollowUser, isFollowing } = useFollowing(currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'premium' | 'influencer' | 'nearby'>('all');
  const [sortBy, setSortBy] = useState<'followers' | 'streak' | 'level' | 'mutual'>('followers');

  const toggleFollow = (userId: string) => {
    const currentlyFollowing = isFollowing(userId);
    
    if (currentlyFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
    
    // Update current user's following count
    onUpdateCurrentUser({
      following: currentlyFollowing ? currentUser.following - 1 : currentUser.following + 1
    });
  };

  // Filter out users that are already being followed
  const availableUsers = allSuggestedUsers.filter(user => !isFollowing(user.id));

  const filteredAndSortedUsers = availableUsers
    .filter(user => {
      // Search filter
      const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Category filter
      switch (filterBy) {
        case 'verified':
          return user.isVerified;
        case 'premium':
          return user.isPremium;
        case 'influencer':
          return user.isInfluencer;
        case 'nearby':
          return user.location && currentUser.location && 
                 user.location.split(',')[1]?.trim() === currentUser.location.split(',')[1]?.trim();
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'followers':
          return b.followers - a.followers;
        case 'streak':
          return b.streak - a.streak;
        case 'level':
          return b.level - a.level;
        case 'mutual':
          return (b.mutualFollowers || 0) - (a.mutualFollowers || 0);
        default:
          return 0;
      }
    });

  return (
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suggested for You</h1>
          <p className="text-gray-600">{filteredAndSortedUsers.length} users found</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="premium">Premium Users</option>
              <option value="influencer">Influencers</option>
              <option value="nearby">Nearby</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="followers">Most Followers</option>
            <option value="streak">Longest Streak</option>
            <option value="level">Highest Level</option>
            <option value="mutual">Mutual Connections</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <button onClick={() => onViewProfile(user)}>
                    <img 
                      src={user.avatar} 
                      alt={user.displayName}
                      className="w-16 h-16 rounded-full object-cover hover:ring-2 hover:ring-green-500 transition-all"
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <button 
                        onClick={() => onViewProfile(user)}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
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
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{user.followers.toLocaleString()} followers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{user.streak} day streak</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Level {user.level}</span>
                      </div>
                      {user.mutualFollowers && user.mutualFollowers > 0 && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Users className="w-4 h-4" />
                          <span>{user.mutualFollowers} mutual</span>
                        </div>
                      )}
                    </div>

                    {user.commonInterests && user.commonInterests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {user.commonInterests.map((interest) => (
                          <span key={interest} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
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
                        isFollowing(user.id)
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isFollowing(user.id) ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{isFollowing(user.id) ? 'Following' : 'Follow'}</span>
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
        )}
      </div>
      </div>
    </div>
  );
};