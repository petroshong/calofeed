import React, { useState } from 'react';
import { X, Camera, Save, User, Mail, MapPin, Link, Instagram, Twitter, Youtube, Globe } from 'lucide-react';
import type { User as UserType } from '../types';

interface EditProfileProps {
  user: UserType;
  onClose: () => void;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ user, onClose, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    username: user.username,
    bio: user.bio,
    location: user.location || '',
    website: user.website || '',
    instagram: user.socialLinks?.instagram || '',
    twitter: user.socialLinks?.twitter || '',
    youtube: user.socialLinks?.youtube || '',
    dietaryPreferences: user.dietaryPreferences,
    allergies: user.allergies,
    activityLevel: user.activityLevel,
    dailyCalorieGoal: user.dailyCalorieGoal,
    dailyProteinGoal: user.dailyProteinGoal,
    dailyCarbGoal: user.dailyCarbGoal,
    dailyFatGoal: user.dailyFatGoal,
    currentWeight: user.currentWeight || 0,
    goalWeight: user.goalWeight || 0,
    height: user.height || 0,
    age: user.age || 0
  });

  const [newPreference, setNewPreference] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<UserType> = {
      displayName: formData.displayName,
      username: formData.username,
      bio: formData.bio,
      location: formData.location,
      website: formData.website,
      socialLinks: {
        instagram: formData.instagram,
        twitter: formData.twitter,
        youtube: formData.youtube,
        website: formData.website
      },
      dietaryPreferences: formData.dietaryPreferences,
      allergies: formData.allergies,
      activityLevel: formData.activityLevel,
      dailyCalorieGoal: formData.dailyCalorieGoal,
      dailyProteinGoal: formData.dailyProteinGoal,
      dailyCarbGoal: formData.dailyCarbGoal,
      dailyFatGoal: formData.dailyFatGoal,
      currentWeight: formData.currentWeight,
      goalWeight: formData.goalWeight,
      height: formData.height,
      age: formData.age
    };

    onUpdateUser(updates);
    onClose();
  };

  const addDietaryPreference = () => {
    if (newPreference.trim() && !formData.dietaryPreferences.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        dietaryPreferences: [...prev.dietaryPreferences, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removeDietaryPreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.filter(p => p !== preference)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              <img 
                src={user.avatar} 
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Click to change profile picture</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Tell people about yourself..."
            />
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
            <div className="space-y-4">
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Instagram username"
                />
              </div>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Twitter username"
                />
              </div>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="YouTube channel"
                />
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.dietaryPreferences.map((pref) => (
                <span key={pref} className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <span>{pref}</span>
                  <button
                    type="button"
                    onClick={() => removeDietaryPreference(pref)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryPreference())}
                placeholder="Add dietary preference"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addDietaryPreference}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.allergies.map((allergy) => (
                <span key={allergy} className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                placeholder="Add allergy"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Physical Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (lbs)</label>
                <input
                  type="number"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({...formData, currentWeight: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (lbs)</label>
                <input
                  type="number"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately Active (moderate exercise 3-5 days/week)</option>
              <option value="active">Very Active (hard exercise 6-7 days/week)</option>
              <option value="very_active">Extremely Active (very hard exercise, physical job)</option>
            </select>
          </div>

          {/* Daily Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={formData.dailyCalorieGoal}
                  onChange={(e) => setFormData({...formData, dailyCalorieGoal: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={formData.dailyProteinGoal}
                  onChange={(e) => setFormData({...formData, dailyProteinGoal: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.dailyCarbGoal}
                  onChange={(e) => setFormData({...formData, dailyCarbGoal: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  value={formData.dailyFatGoal}
                  onChange={(e) => setFormData({...formData, dailyFatGoal: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};