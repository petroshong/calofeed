import React, { useState } from 'react';
import { X, Search, UserPlus, UserCheck, Star, Crown } from 'lucide-react';
import type { User } from '../types';

interface FollowersModalProps {
  user: User;
  type: 'followers' | 'following';
  onClose: () => void;
}

const mockFollowers: User[] = [
  {
    id: '1',
    username: 'fitnessguru',
    displayName: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Fitness coach helping you reach your goals 💪',
    isFollowing: true,
    followers: 12500,
    following: 234,
    mealsLogged: 892,
    streak: 45,
    isVerified: true,
    isPremium: true,
    isInfluencer: false
  } as User,
  {
    id: '2',
    username: 'plantbased_chef',
    displayName: 'Emma Green',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Plant-based recipes for a healthier you 🌱',
    isFollowing: false,
    followers: 8900,
    following: 156,
    mealsLogged: 567,
    streak: 23,
    isVerified: false,
    isPremium: false,
    isInfluencer: true
  } as User,
  {
    id: '3',
    username: 'ketowarrior',
    displayName: 'Jessica Kim',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Keto lifestyle advocate 🥑 Down 50lbs!',
    isFollowing: true,
    followers: 5600,
    following: 89,
    mealsLogged: 445,
    streak: 67,
    isVerified: true,
    isPremium: true,
    isInfluencer: false
  } as User
];

export const FollowersModal: React.FC<FollowersModalProps> = ({ user, type, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockFollowers);

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, isFollowing: !u.isFollowing }
        : u
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'followers' ? `${user.followers.toLocaleString()} Followers` : `${user.following.toLocaleString()} Following`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
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
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-96">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((follower) => (
                <div key={follower.id} className="p-4 flex items-center space-x-3">
                  <img 
                    src={follower.avatar} 
                    alt={follower.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">{follower.displayName}</h3>
                      {follower.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current flex-shrink-0" />}
                      {follower.isPremium && (
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex-shrink-0">PRO</span>
                      )}
                      {follower.isInfluencer && (
                        <Crown className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">@{follower.username}</p>
                    <p className="text-xs text-gray-500 truncate">{follower.bio}</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(follower.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      follower.isFollowing 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {follower.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span className="hidden sm:inline">{follower.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};