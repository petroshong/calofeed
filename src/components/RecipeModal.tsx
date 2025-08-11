import React, { useState } from 'react';
import { X, Clock, Users, ChefHat, Star, Bookmark, Share, Heart, Printer as Print } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [servings, setServings] = useState(recipe.servings);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const adjustServings = (newServings: number) => {
    if (newServings > 0) {
      setServings(newServings);
    }
  };

  const multiplier = servings / recipe.servings;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-4xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime + recipe.cookTime} min total</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChefHat className="w-4 h-4" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <Print className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Servings Adjuster */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Adjust Servings</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => adjustServings(servings - 1)}
                  className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-lg text-gray-900 min-w-[2rem] text-center">{servings}</span>
                <button
                  onClick={() => adjustServings(servings + 1)}
                  className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {(ingredient.amount * multiplier).toFixed(1)} {ingredient.unit}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round(ingredient.calories * multiplier)} cal
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition per Serving</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(recipe.ingredients.reduce((sum, ing) => sum + ing.calories, 0) / recipe.servings)}
                </div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(recipe.ingredients.reduce((sum, ing) => sum + ing.protein, 0) / recipe.servings)}g
                </div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(recipe.ingredients.reduce((sum, ing) => sum + ing.carbs, 0) / recipe.servings)}g
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(recipe.ingredients.reduce((sum, ing) => sum + ing.fat, 0) / recipe.servings)}g
                </div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Log This Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};