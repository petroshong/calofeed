import React from 'react';
import { Home, Trophy, Plus, Target, User, Search, Users, UserPlus } from 'lucide-react';
import { useFriendRequests } from '../hooks/useFriendRequests';
import type { User as UserType } from '../types';

interface NavigationProps {
  currentView: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover' | 'calories' | 'find-friends' | 'user-profile' | 'friend-requests';
  onViewChange: (view: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover' | 'calories' | 'find-friends' | 'user-profile' | 'friend-requests') => void;
  currentUser: UserType;
  isGuest?: boolean;
  onAuthRequired?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentUser, isGuest = false, onAuthRequired }) => {
  const { getIncomingRequests } = useFriendRequests(currentUser || {} as UserType);
  const incomingRequests = !isGuest ? getIncomingRequests() : [];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50 px-2">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg transition-colors min-w-0 ${
            currentView === 'feed' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-xs font-medium truncate">Feed</span>
        </button>

        <button
          onClick={() => onViewChange('discover')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg transition-colors min-w-0 ${
            currentView === 'discover' 
              ? 'text-pink-600 bg-pink-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs font-medium truncate">Discover</span>
        </button>

        <button
          onClick={() => {
            if (isGuest) {
              onAuthRequired?.();
            } else {
              onViewChange('log');
            }
          }}
          className="flex flex-col items-center space-y-1 py-1 px-1 rounded-lg bg-green-600 text-white min-w-0"
        >
          <div className="w-6 h-6 bg-green-700 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium truncate">{isGuest ? 'Sign Up' : 'Log'}</span>
        </button>

        <button
          onClick={() => {
            if (isGuest) {
              onAuthRequired?.();
            } else {
              onViewChange('friend-requests');
            }
          }}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg transition-colors min-w-0 ${
            currentView === 'friend-requests' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <UserPlus className="w-4 h-4" />
            {!isGuest && incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                {incomingRequests.length}
              </span>
            )}
          </div>
          <span className="text-xs font-medium truncate">Friends</span>
        </button>

        {!isGuest ? (
          <button
            onClick={() => onViewChange('profile')}
            className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg transition-colors min-w-0 ${
              currentView === 'profile' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <img 
              src={currentUser.avatar} 
              alt="Profile"
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-xs font-medium truncate">Profile</span>
          </button>
        ) : (
          <button
            onClick={() => onAuthRequired?.()}
            className="flex flex-col items-center space-y-1 py-1 px-2 rounded-lg transition-colors min-w-0 text-blue-600"
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-medium truncate">Sign Up</span>
          </button>
        )}
      </div>
    </nav>
  );
};