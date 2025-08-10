import React, { useState } from 'react';
import { MoreHorizontal, Edit3, Trash2, Share2, Flag, Copy, Eye, EyeOff, X } from 'lucide-react';
import type { Meal } from '../types';

interface MealActionsProps {
  meal: Meal;
  isOwner: boolean;
  onEdit?: (meal: Meal) => void;
  onDelete?: (mealId: string) => void;
  onShare?: (meal: Meal) => void;
}

export const MealActions: React.FC<MealActionsProps> = ({ 
  meal, 
  isOwner, 
  onEdit, 
  onDelete, 
  onShare 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(meal.id);
      setShowDeleteConfirm(false);
      setShowMenu(false);
    }
  };

  const copyMealLink = () => {
    const mealUrl = `https://eatsocial.app/meal/${meal.id}`;
    navigator.clipboard.writeText(mealUrl);
    alert('Meal link copied to clipboard!');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
            {isOwner ? (
              <>
                <button
                  onClick={() => {
                    onEdit && onEdit(meal);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Meal</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Meal</span>
                </button>
                <div className="border-t border-gray-100" />
              </>
            ) : (
              <button
                onClick={() => {
                  // Report functionality
                  alert('Meal reported. Thank you for helping keep our community safe.');
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            )}
            
            <button
              onClick={() => {
                onShare && onShare(meal);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Meal</span>
            </button>
            
            <button
              onClick={copyMealLink}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-sm w-full m-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Meal?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. Your meal and all its data will be permanently deleted.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};