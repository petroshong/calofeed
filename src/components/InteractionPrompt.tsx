import React from 'react';
import { Heart, MessageCircle, UserPlus, Bookmark, Share2, X } from 'lucide-react';

interface InteractionPromptProps {
  action: 'like' | 'comment' | 'follow' | 'bookmark' | 'share';
  onSignUp: () => void;
  onClose: () => void;
}

export const InteractionPrompt: React.FC<InteractionPromptProps> = ({ action, onSignUp, onClose }) => {
  const getActionDetails = () => {
    switch (action) {
      case 'like':
        return {
          icon: <Heart className="w-8 h-8 text-red-500" />,
          title: 'Like Posts',
          description: 'Show appreciation for meals that inspire you'
        };
      case 'comment':
        return {
          icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
          title: 'Join Conversations',
          description: 'Comment on posts and connect with the community'
        };
      case 'follow':
        return {
          icon: <UserPlus className="w-8 h-8 text-green-500" />,
          title: 'Follow Friends',
          description: 'Follow users to see their meals in your feed'
        };
      case 'bookmark':
        return {
          icon: <Bookmark className="w-8 h-8 text-yellow-500" />,
          title: 'Save Meals',
          description: 'Bookmark meals to try them later'
        };
      case 'share':
        return {
          icon: <Share2 className="w-8 h-8 text-purple-500" />,
          title: 'Share Content',
          description: 'Share amazing meals with your network'
        };
    }
  };

  const actionDetails = getActionDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {actionDetails.icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{actionDetails.title}</h2>
          <p className="text-gray-600">{actionDetails.description}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSignUp}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Sign Up Free
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
};