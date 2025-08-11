import React, { useState } from 'react';
import { Share2, Instagram, Twitter, Facebook, MessageCircle, Copy, Check, X, Download, Camera, ExternalLink } from 'lucide-react';
import type { Meal } from '../types';

interface SocialShareProps {
  meal: Meal;
  onClose: () => void;
}

export const SocialShare: React.FC<SocialShareProps> = ({ meal, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState(`Check out this amazing ${meal.mealType}! 🍽️ ${meal.calories} calories of pure deliciousness. #EatSocial #${meal.mealType} #HealthyEating`);

  const shareUrl = `https://eatsocial.app/meal/${meal.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy the text and image
        navigator.clipboard.writeText(`${shareText}\n\nView full post: ${shareUrl}`);
        alert('Caption and link copied! Open Instagram and paste in your story or post.');
        return;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(meal.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `eatsocial-meal-${meal.user.username}-${meal.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const openMealLink = () => {
    // Update current page URL to show the meal
    window.history.pushState({}, '', `/meal/${meal.id}`);
    // Close the share modal and trigger meal view
    onClose();
    // Dispatch custom event to trigger meal view
    window.dispatchEvent(new CustomEvent('viewMeal', { detail: { mealId: meal.id } }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share Meal</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meal Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex space-x-3">
              <img 
                src={meal.image} 
                alt="Meal"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{meal.description}</p>
                <div className="flex space-x-3 text-xs text-gray-500 mt-1">
                  <span>{meal.calories} cal</span>
                  <span>{meal.protein}g protein</span>
                  <span>{meal.likes} likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Message
            </label>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Add your own message..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {shareText.length}/280 characters
            </div>
          </div>

          {/* Share Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Share to</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('instagram')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Instagram</div>
                  <div className="text-xs text-gray-600">Story or Post</div>
                </div>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Twitter</div>
                  <div className="text-xs text-gray-600">Tweet</div>
                </div>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Facebook</div>
                  <div className="text-xs text-gray-600">Post</div>
                </div>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-xs text-gray-600">Message</div>
                </div>
              </button>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="space-y-3">
            <button
              onClick={openMealLink}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open Meal Link</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
              <span className={copied ? 'text-green-600' : 'text-gray-700'}>
                {copied ? 'Link Copied!' : 'Copy Link'}
              </span>
            </button>

            <button
              onClick={downloadImage}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Download Image</span>
            </button>
          </div>

          {/* Share Stats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Share Impact</span>
            </div>
            <div className="text-xs text-blue-700">
              Sharing helps inspire others on their health journey! 
              Posts with photos get 3x more engagement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};