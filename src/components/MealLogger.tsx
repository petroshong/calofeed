import React, { useState } from 'react';
import { Camera, X, Upload, MapPin, Clock, Plus, Minus, Search, Scan, Hash, Users } from 'lucide-react';

interface MealLoggerProps {
  onClose: () => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    image: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    location: '',
    mealType: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    tags: [] as string[],
    visibility: 'public' as 'public' | 'friends' | 'private'
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle meal logging logic here
    console.log('Logging meal:', formData);
    onClose();
  };

  const adjustMacro = (field: 'calories' | 'protein' | 'carbs' | 'fat', increment: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: String(Math.max(0, parseInt(prev[field] || '0') + increment))
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Log Your Meal</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Meal Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, mealType: type})}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    formData.mealType === type 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Meal Photo</label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Meal preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Add a photo of your meal</p>
                    <p className="text-sm text-gray-600">Share what you're eating with the community</p>
                  </div>
                  <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Scan className="w-5 h-5" />
                    <span>Scan Barcode</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What did you eat? Add details about your meal..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Nutrition Information */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nutrition Information</h3>
              <button
                type="button"
                onClick={() => setShowFoodSearch(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <Search className="w-4 h-4" />
                <span>Search Foods</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Calories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustMacro('calories', -50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    type="button"
                    onClick={() => adjustMacro('calories', 50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Protein */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustMacro('protein', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    type="button"
                    onClick={() => adjustMacro('protein', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carbs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustMacro('carbs', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    type="button"
                    onClick={() => adjustMacro('carbs', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustMacro('fat', -2)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.fat}
                    onChange={(e) => setFormData({...formData, fat: e.target.value})}
                    placeholder="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    type="button"
                    onClick={() => adjustMacro('fat', 2)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Hash className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (e.g., healthy, protein)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Who can see this meal?</label>
            <div className="grid grid-cols-3 gap-2">
              {(['public', 'friends', 'private'] as const).map((visibility) => (
                <button
                  key={visibility}
                  type="button"
                  onClick={() => setFormData({...formData, visibility})}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    formData.visibility === visibility 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {visibility === 'public' && <Users className="w-4 h-4" />}
                  {visibility === 'friends' && <Users className="w-4 h-4" />}
                  {visibility === 'private' && <User className="w-4 h-4" />}
                  <span className="capitalize">{visibility}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Where did you eat this meal?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Share Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};