import React from 'react';
import { Home, Trophy, Plus, Target, User } from 'lucide-react';
import type { User as UserType } from '../App';

interface NavigationProps {
  currentView: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard';
  onViewChange: (view: 'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard') => void;
  currentUser: UserType;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentUser }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
            currentView === 'feed' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Feed</span>
        </button>

        <button
          onClick={() => onViewChange('challenges')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
            currentView === 'challenges' 
              ? 'text-purple-600 bg-purple-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="w-6 h-6" />
          <span className="text-xs font-medium">Challenges</span>
        </button>

        <button
          onClick={() => onViewChange('log')}
          className="flex flex-col items-center space-y-1 py-1 px-3 rounded-lg bg-green-600 text-white"
        >
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Log</span>
        </button>

        <button
          onClick={() => onViewChange('leaderboard')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
            currentView === 'leaderboard' 
              ? 'text-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-medium">Rankings</span>
        </button>

        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
            currentView === 'profile' 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <img 
            src={currentUser.avatar} 
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};