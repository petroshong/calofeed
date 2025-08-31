import React, { useState } from 'react';
import { Search, X, Scan, Clock, Star, Plus } from 'lucide-react';
import type { FoodItem } from '../types';

interface FoodSearchProps {
  onClose: () => void;
  onSelectFood: (food: FoodItem) => void;
}

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    brand: 'Generic',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '2',
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    calories: 112,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '100',
    servingUnit: 'g',
    barcode: '123456789',
    verified: true
  },
  {
    id: '3',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    sugar: 0.7,
    sodium: 7,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 4,
    sodium: 60,
    servingSize: '170',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '5',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '6',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    fiber: 2.8,
    sugar: 0.9,
    sodium: 7,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '7',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    sodium: 5,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '8',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sugar: 0.4,
    sodium: 79,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '9',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    servingSize: '100',
    servingUnit: 'g',
    verified: true
  },
  {
    id: '10',
    name: 'Oatmeal',
    brand: 'Quaker',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    sugar: 0.3,
    sodium: 49,
    servingSize: '40',
    servingUnit: 'g',
    verified: true
  }
];

export const FoodSearch: React.FC<FoodSearchProps> = ({ onClose, onSelectFood }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['chicken breast', 'quinoa', 'salmon', 'greek yogurt']);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(mockFoodItems);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockFoodItems.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(mockFoodItems);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col mobile-modal-overlay"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        {/* Mobile drag handle */}
        <div className="lg:hidden absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
        
        <div className="flex items-center justify-between pt-4 lg:pt-0">
        <h2 className="text-xl font-bold text-gray-900">Search Foods</h2>
        <button
          onClick={onClose}
          className="p-3 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors enhanced-touch-target"
        >
          <X className="w-6 h-6" />
        </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search foods, brands, or scan barcode..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Scan className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Custom</span>
          </button>
        </div>
      </div>

      {/* Recent Searches */}
      {!searchQuery && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => handleSearch(search)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              onClick={() => onSelectFood(food)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{food.name}</h3>
                    {food.verified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                  </div>
                  {food.brand && (
                    <p className="text-sm text-gray-600 mb-2">{food.brand}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g protein</span>
                    <span>per {food.servingSize}{food.servingUnit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{food.calories}</div>
                  <div className="text-xs text-gray-600">calories</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-medium text-green-600">{food.protein}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600">{food.carbs}g</div>
                  <div className="text-xs text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-orange-600">{food.fat}g</div>
                  <div className="text-xs text-gray-600">Fat</div>
                </div>
                {food.fiber && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-purple-600">{food.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};