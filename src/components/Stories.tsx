import React, { useState } from 'react';
import { Plus, X, Eye, Heart, MessageCircle, Send, Camera, Type, Palette, Sticker } from 'lucide-react';
import type { Story, User } from '../types';

interface StoriesProps {
  currentUser: User;
}

const mockStories: Story[] = [
  {
    id: '1',
    userId: '2',
    user: {
      id: '2',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: 'Meal prep Sunday! 💪 #mealprep #chicken #rice #vegetables',
    timestamp: '2 hours ago',
    expiresAt: '2024-02-02T10:00:00Z',
    views: 47,
    isViewed: false,
    type: 'meal'
  },
  {
    id: '2',
    userId: '3',
    user: {
      id: '3',
      username: 'fitnessguru',
      displayName: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: 'Hit my protein goal! 🎯 #protein #eggs #greek-yogurt #almonds',
    timestamp: '4 hours ago',
    expiresAt: '2024-02-02T08:00:00Z',
    views: 23,
    isViewed: true,
    type: 'achievement'
  }
];

export const Stories: React.FC<StoriesProps> = ({ currentUser }) => {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);

  const viewStory = (index: number) => {
    setCurrentStoryIndex(index);
    // Mark as viewed
    setStories(prev => prev.map((story, i) => 
      i === index ? { ...story, isViewed: true, views: story.views + 1 } : story
    ));
  };

  const nextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setCurrentStoryIndex(null);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const currentStory = currentStoryIndex !== null ? stories[currentStoryIndex] : null;

  return (
    <>
      {/* Stories Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {/* Add Story */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex flex-col items-center space-y-1 flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-0.5 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Your Story</span>
          </button>

          {/* User Stories */}
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => viewStory(index)}
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-br from-orange-400 to-pink-500'
              }`}>
                <img 
                  src={story.user.avatar} 
                  alt={story.user.displayName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">
                {story.user.displayName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {currentStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
              {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all duration-300 ${
                      index < currentStoryIndex! ? 'w-full' : 
                      index === currentStoryIndex ? 'w-full animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <img 
                  src={currentStory.user.avatar} 
                  alt={currentStory.user.displayName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <div className="text-white font-semibold text-sm">{currentStory.user.displayName}</div>
                  <div className="text-white text-xs opacity-80">{currentStory.timestamp}</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentStoryIndex(null)}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Content */}
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${currentStory.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              
              {/* Story Text */}
              {currentStory.text && (
                <div className="absolute bottom-20 left-4 right-4">
                  <div className="bg-black bg-opacity-50 rounded-lg p-3">
                    <p className="text-white text-lg font-medium">{currentStory.text}</p>
                  </div>
                </div>
              )}

              {/* Navigation Areas */}
              <button
                onClick={prevStory}
                className="absolute left-0 top-0 w-1/3 h-full"
              />
              <button
                onClick={nextStory}
                className="absolute right-0 top-0 w-1/3 h-full"
              />

              {/* Story Actions */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-white text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{currentStory.views}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Story</h2>
                <button
                  onClick={() => setShowCreateStory(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors">
                  <Camera className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Take Photo</div>
                    <div className="text-sm text-gray-600">Share your current meal</div>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Type className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Text Story</div>
                    <div className="text-sm text-gray-600">Share an update</div>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Sticker className="w-6 h-6 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Progress Update</div>
                    <div className="text-sm text-gray-600">Share your achievements</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};