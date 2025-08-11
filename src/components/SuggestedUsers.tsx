import React, { useState } from 'react';
import { UserPlus, X, Star, Crown, Flame, Trophy } from 'lucide-react';
import { useFollowing } from '../hooks/useFollowing';
import type { User } from '../types';

const suggestedUsers: User[] = [
  {
    id: '1',
    username: 'chef_maria',
    displayName: 'Chef Maria',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Professional chef sharing healthy restaurant-quality meals 👩‍🍳',
    isFollowing: false,
    followers: 45623,
    following: 234,
    mealsLogged: 1247,
    streak: 89,
    isVerified: true,
    isPremium: true,
    isInfluencer: true,
    level: 25,
    socialScore: 98
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
    isVerified: false,
    isPremium: true,
    isInfluencer: false,
    level: 18,
    socialScore: 87
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
    isVerified: true,
    isPremium: false,
    isInfluencer: false,
    level: 15,
    socialScore: 91
  } as User
];

interface SuggestedUsersProps {
  currentUser: User;
  onViewProfile?: (user: User) => void;
  onViewAllSuggestions?: () => void;
  onUpdateCurrentUser?: (updates: Partial<User>) => void;
}

export const SuggestedUsers: React.FC<SuggestedUsersProps> = ({ currentUser, onViewProfile, onViewAllSuggestions, onUpdateCurrentUser }) => {
  const [users, setUsers] = useState<User[]>(suggestedUsers);
  const [dismissedUsers, setDismissedUsers] = useState<string[]>([]);
  const { followUser, unfollowUser, isFollowing } = useFollowing(currentUser);

  const toggleFollow = (userId: string) => {
    const currentlyFollowing = isFollowing(userId);
    
    if (currentlyFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
    
    // Update the user's following state in the UI
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !currentlyFollowing, 
            followers: currentlyFollowing ? user.followers - 1 : user.followers + 1 
          }
        : user
    ));
    
    // Update current user's following count
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser({
        following: currentlyFollowing ? currentUser.following - 1 : currentUser.following + 1
      });
    }
  };

  const dismissUser = (userId: string) => {
    setDismissedUsers(prev => [...prev, userId]);
  };

  const visibleUsers = users.filter(user => !dismissedUsers.includes(user.id));

  if (visibleUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested for You</h2>
      <div className="space-y-4">
        {visibleUsers.slice(0, 3).map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <button onClick={() => onViewProfile && onViewProfile(user)}>
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
              />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onViewProfile && onViewProfile(user)}
                  className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors"
                >
                  {user.displayName}
                </button>
                {user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                {user.isInfluencer && <Crown className="w-4 h-4 text-yellow-500 fill-current" />}
              </div>
              <p className="text-sm text-gray-600 truncate">@{user.username}</p>
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                <span>{user.followers.toLocaleString()} followers</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{user.streak}d</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <span>L{user.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => dismissUser(user.id)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isFollowing(user.id) || user.isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <UserPlus className="w-3 h-3" />
                <span>{isFollowing(user.id) || user.isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => onViewAllSuggestions && onViewAllSuggestions()}
        className="w-full mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
      >
        See All Suggestions
      </button>
    </div>
  );
};