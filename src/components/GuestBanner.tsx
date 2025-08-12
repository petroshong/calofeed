import React from 'react';
import { Flame, UserPlus, Heart, MessageCircle, Trophy } from 'lucide-react';

interface GuestBannerProps {
  onSignUp: () => void;
}

export const GuestBanner: React.FC<GuestBannerProps> = ({ onSignUp }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 lg:p-6 mb-4 lg:mb-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome to CaloFeed!</h2>
            <p className="text-green-100 text-sm">
              Join thousands tracking their nutrition and sharing their food journey
            </p>
          </div>
        </div>
        <button
          onClick={onSignUp}
          className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Join Free</span>
        </button>
      </div>
      
      <div className="flex items-center justify-center space-x-8 mt-4 pt-4 border-t border-green-500/30">
        <div className="flex items-center space-x-2 text-green-100">
          <Heart className="w-4 h-4" />
          <span className="text-sm">Like & Share Meals</span>
        </div>
        <div className="flex items-center space-x-2 text-green-100">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment & Connect</span>
        </div>
        <div className="flex items-center space-x-2 text-green-100">
          <Trophy className="w-4 h-4" />
          <span className="text-sm">Join Challenges</span>
        </div>
      </div>
    </div>
  );
};