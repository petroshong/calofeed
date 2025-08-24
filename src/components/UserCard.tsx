import React, { useState } from 'react';
import { UserPlus, UserCheck, MessageCircle, Star, Crown, MapPin, Flame, Trophy, Lock, Clock } from 'lucide-react';
import { useFriendRequests } from '../hooks/useFriendRequests';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact' | 'detailed';
  showFollowButton?: boolean;
  onViewProfile?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  variant = 'default', 
  showFollowButton = true,
  onViewProfile
}) => {
  const { sendFriendRequest, hasPendingRequest, areFriends } = useFriendRequests({} as User);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [requestSent, setRequestSent] = useState(user.followRequestSent || false);

  const handleFollowAction = () => {
    if (user.isPrivate && !areFriends(user.id)) {
      // Send friend request for private accounts
      sendFriendRequest(user);
      setRequestSent(true);
    } else {
      // Regular follow for public accounts
      setIsFollowing(!isFollowing);
    }
  };


  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <button onClick={() => onViewProfile && onViewProfile(user)}>
          <img 
            src={user.avatar} 
            alt={user.displayName}
            className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
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
          </div>
          <p className="text-sm text-gray-600 truncate">@{user.username}</p>
        </div>
        {showFollowButton && (
          <button
            onClick={handleFollowAction}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isFollowing || areFriends(user.id)
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : requestSent || hasPendingRequest(user.id)
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={requestSent || hasPendingRequest(user.id)}
          >
            {user.isPrivate && <Lock className="w-4 h-4" />}
            <span>
              {areFriends(user.id) ? 'Friends' :
               isFollowing ? 'Following' :
               requestSent || hasPendingRequest(user.id) ? 'Requested' :
               user.isPrivate ? 'Request' : 'Follow'}
            </span>
          </button>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <img 
            src={user.avatar} 
            alt={user.displayName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{user.displayName}</h3>
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

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">{user.followers.toLocaleString()}</span>
                <span>followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{user.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Level {user.level}</span>
              </div>
            </div>

            {user.dietaryPreferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {user.dietaryPreferences.slice(0, 3).map((pref) => (
                  <span key={pref} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {pref}
                  </span>
                ))}
                {user.dietaryPreferences.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{user.dietaryPreferences.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          {showFollowButton && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={toggleFollow}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <img 
        src={user.avatar} 
        alt={user.displayName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900 truncate">{user.displayName}</h3>
          {user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
          {user.isPremium && (
            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">@{user.username}</p>
        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
          <span>{user.followers.toLocaleString()} followers</span>
          <span>{user.streak} day streak</span>
        </div>
      </div>
      {showFollowButton && (
        <button
          onClick={handleFollowAction}
          className={\`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            isFollowing || areFriends(user.id)
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : requestSent || hasPendingRequest(user.id)
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          disabled={requestSent || hasPendingRequest(user.id)}
        >
          {user.isPrivate && <Lock className="w-4 h-4" />}
          <span>
            {areFriends(user.id) ? 'Friends' :
             isFollowing ? 'Following' :
             requestSent || hasPendingRequest(user.id) ? 'Requested' :
             user.isPrivate ? 'Request' : 'Follow'}
          </span>
        </button>
      )}
    </div>
  );
};