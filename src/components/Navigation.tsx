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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 mobile-nav mobile-tap-highlight safe-area-pb">
      <div className="flex items-center justify-around py-3">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 enhanced-touch-target ${
            currentView === 'feed' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-xs font-medium truncate">Home</span>
        </button>

        <button
          onClick={() => onViewChange('discover')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 enhanced-touch-target ${
            currentView === 'discover' 
              ? 'text-pink-600 bg-pink-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs font-medium truncate">Search</span>
        </button>

        <button
          onClick={() => {
            if (isGuest) {
              onAuthRequired?.();
            } else {
              onViewChange('log');
            }
          }}
          className="flex flex-col items-center space-y-1 py-2 px-2 rounded-lg bg-green-600 text-white min-w-0 enhanced-touch-target"
        >
          <div className="w-8 h-8 bg-green-700 rounded-xl flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium truncate">{isGuest ? 'Join' : 'Add'}</span>
        </button>

        <button
          onClick={() => {
            if (isGuest) {
              onAuthRequired?.();
            } else {
              onViewChange('friend-requests');
            }
          }}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 enhanced-touch-target ${
            currentView === 'friend-requests' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <UserPlus className="w-4 h-4" />
            {!isGuest && incomingRequests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {incomingRequests.length}
              </span>
            )}
          </div>
          <span className="text-xs font-medium truncate">People</span>
        </button>

        {!isGuest ? (
          <button
            onClick={() => onViewChange('profile')}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 enhanced-touch-target ${
              currentView === 'profile' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <img 
              src={currentUser.avatar} 
              alt="Profile"
              className="w-5 h-5 rounded-full object-cover border border-gray-300"
            />
            <span className="text-xs font-medium truncate">Me</span>
          </button>
        ) : (
          <button
            onClick={() => onAuthRequired?.()}
            className="flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 text-blue-600 enhanced-touch-target"
          >
            <User className="w-4 h-4" />
            <span className="text-xs font-medium truncate">Join</span>
          </button>
        )}
      </div>
    </nav>
  );
};