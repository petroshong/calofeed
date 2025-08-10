import React from 'react';
import { Home, Trophy, Plus, Target, User, Search, Users } from 'lucide-react';
import type { User as UserType } from '../types';

interface NavigationProps {
  currentView: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover';
  onViewChange: (view: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover') => void;
  currentUser: UserType;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentUser }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around py-1">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            currentView === 'feed' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Feed</span>
        </button>

        <button
          onClick={() => onViewChange('discover')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            currentView === 'discover' 
              ? 'text-pink-600 bg-pink-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs font-medium">Discover</span>
        </button>

        <button
          onClick={() => onViewChange('log')}
          className="flex flex-col items-center space-y-1 py-1 px-2 rounded-lg bg-green-600 text-white"
        >
          <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">Log</span>
        </button>

        <button
          onClick={() => onViewChange('challenges')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            currentView === 'challenges' 
              ? 'text-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-medium">Challenges</span>
        </button>

        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
            currentView === 'profile' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <img 
            src={currentUser.avatar} 
            alt="Profile"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};