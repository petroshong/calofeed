import React, { useState } from 'react';
import { X, Heart, MessageCircle, Share, Bookmark, MoreHorizontal, MapPin, Clock, User, Flag, Copy, Send, Eye, Star } from 'lucide-react';
import { MentionInput } from './MentionInput';
import { SocialShare } from './SocialShare';
import type { Meal, Comment } from '../types';

interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
}

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    user: {
      id: '2',
      username: 'alexfitness',
      displayName: 'Alex Fitness',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50',
    } as any,
    content: 'Looks amazing! What\'s your salmon seasoning secret? 🔥',
    timestamp: '2 hours ago',
    likes: 5,
    isLiked: false,
    mentions: [],
    isEdited: false
  },
  {
    id: '2',
    userId: '3',
    user: {
      id: '3',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50',
    } as any,
    content: '@alexfitness Just lemon, garlic, and herbs! Simple but delicious 😊',
    timestamp: '1 hour ago',
    likes: 3,
    isLiked: true,
    mentions: ['alexfitness'],
    isEdited: false
  }
];

export const MealDetail: React.FC<MealDetailProps> = ({ meal, onClose }) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(meal.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(meal.isBookmarked);
  const [likesCount, setLikesCount] = useState(meal.likes);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewsCount, setViewsCount] = useState(meal.views);

  // Increment views when modal opens
  React.useEffect(() => {
    setViewsCount(prev => prev + 1);
  }, []);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Extract mentions from comment
      const mentions = newComment.match(/@(\w+)/g)?.map(mention => mention.slice(1)) || [];
      
      const comment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user',
        user: {
          id: 'current-user',
          username: 'you',
          displayName: 'You',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50',
        } as any,
        content: newComment,
        timestamp: 'now',
        likes: 0,
        isLiked: false,
        mentions,
        isEdited: false
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
        <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-4xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={meal.user.avatar} 
                alt={meal.user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{meal.user.displayName}</h3>
                  {meal.user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{meal.timestamp}</span>
                  {meal.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{meal.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{viewsCount}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img 
                src={meal.image} 
                alt="Food"
                className="w-full h-80 lg:h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 flex flex-col">
              {/* Meal Info */}
              <div className="p-6 border-b border-gray-200">
                {/* Nutrition Info */}
                <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{meal.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{meal.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">{meal.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{meal.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={toggleLike}
                      className={`flex items-center space-x-2 ${
                        isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      } transition-colors`}
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{likesCount}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-medium">{comments.length}</span>
                    </button>
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Send className="w-6 h-6" />
                      <span className="font-medium">{meal.shares}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`${
                      isBookmarked ? 'text-yellow-600' : 'text-gray-600 hover:text-yellow-600'
                    } transition-colors`}
                  >
                    <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Description */}
                <div className="text-gray-900 mb-4">
                  <span className="font-semibold">{meal.user.displayName}</span>
                  <span className="ml-2">{meal.description}</span>
                </div>

                {/* Tags */}
                {meal.tags && meal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meal.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recipe Link */}
                {meal.recipe && (
                  <button className="w-full bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg font-medium hover:bg-green-100 transition-colors">
                    View Full Recipe
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Comments ({comments.length})</h3>
                </div>
              
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img 
                        src={comment.user.avatar} 
                        alt={comment.user.displayName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold text-sm text-gray-900">{comment.user.displayName}</div>
                              {comment.isEdited && <span className="text-xs text-gray-500">(edited)</span>}
                            </div>
                            <div className="text-xs text-gray-500">{comment.timestamp}</div>
                          </div>
                          <div className="text-sm text-gray-800">
                            {comment.content.split(/(@\w+)/g).map((part, index) => 
                              part.startsWith('@') ? (
                                <span key={index} className="text-blue-600 font-medium cursor-pointer hover:underline">
                                  {part}
                                </span>
                              ) : (
                                <span key={index}>{part}</span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => toggleCommentLike(comment.id)}
                            className={`flex items-center space-x-1 text-xs ${
                              comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            } transition-colors`}
                          >
                            <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleAddComment} className="flex space-x-3">
                    <img 
                      src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50"
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex space-x-2">
                      <MentionInput
                        value={newComment}
                        onChange={setNewComment}
                        placeholder="Add a comment... (use @ to mention)"
                        className="flex-1"
                        onSubmit={handleAddComment}
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <SocialShare 
          meal={meal} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </>
  );
};