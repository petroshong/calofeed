import React from 'react';
import { Filter, X } from 'lucide-react';

interface FoodCategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  onClose: () => void;
}

const foodCategories = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🌅', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'lunch', name: 'Lunch', emoji: '☀️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'dinner', name: 'Dinner', emoji: '🌙', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'snack', name: 'Snacks', emoji: '🍎', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'protein', name: 'High Protein', emoji: '💪', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'keto', name: 'Keto', emoji: '🥑', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'healthy', name: 'Healthy', emoji: '🥗', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'comfort', name: 'Comfort Food', emoji: '🍕', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'international', name: 'International', emoji: '🌍', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'homemade', name: 'Homemade', emoji: '🏠', color: 'bg-purple-50 text-purple-700 border-purple-200' }
];

export const FoodCategoryFilter: React.FC<FoodCategoryFilterProps> = ({ 
  selectedCategories, 
  onCategoryChange, 
  onClose 
}) => {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  const selectAll = () => {
    onCategoryChange(foodCategories.map(cat => cat.id));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto m-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Filter by Food Category</h2>
              <p className="text-sm text-gray-600">{selectedCategories.length} categories selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 lg:p-6">
          {/* Quick Actions */}
          <div className="flex space-x-3 mb-6">
            <button
              onClick={selectAll}
              className="px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm lg:text-base"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="px-3 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              Clear All
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-3 lg:p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedCategories.includes(category.id)
                    ? `${category.color} border-current shadow-md transform scale-105`
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <div className="font-medium text-sm lg:text-base">{category.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Apply Button */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 lg:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 lg:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};