import React, { useState } from 'react';
import { X, Activity, Save, Zap, User as UserIcon, Dumbbell, Bike, Mountain } from 'lucide-react';
import { calculateBMR, calculateTDEE } from '../utils/helpers';
import type { User } from '../types';

interface ActivityLevelSelectorProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

const activityLevels = [
  {
    id: 'sedentary',
    name: 'Sedentary',
    description: 'Little to no exercise',
    details: 'Desk job, minimal physical activity',
    icon: <UserIcon className="w-6 h-6" />,
    multiplier: 1.2,
    color: 'bg-gray-50 border-gray-200 text-gray-700'
  },
  {
    id: 'light',
    name: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: 'Light workouts, walking, yoga',
    icon: <Activity className="w-6 h-6" />,
    multiplier: 1.375,
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    id: 'moderate',
    name: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: 'Regular gym sessions, sports',
    icon: <Dumbbell className="w-6 h-6" />,
    multiplier: 1.55,
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    id: 'active',
    name: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: 'Daily intense workouts',
    icon: <Bike className="w-6 h-6" />,
    multiplier: 1.725,
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  },
  {
    id: 'very_active',
    name: 'Extremely Active',
    description: 'Very hard exercise, physical job',
    details: 'Athlete level activity, manual labor',
    icon: <Mountain className="w-6 h-6" />,
    multiplier: 1.9,
    color: 'bg-red-50 border-red-200 text-red-700'
  }
];

export const ActivityLevelSelector: React.FC<ActivityLevelSelectorProps> = ({ user, onClose, onUpdateUser }) => {
  const [selectedLevel, setSelectedLevel] = useState(user.activityLevel);

  const calculateCalorieNeeds = (activityLevel: string) => {
    if (!user.currentWeight || !user.height || !user.age) {
      return 2000; // Default fallback
    }

    const bmr = calculateBMR(
      user.currentWeight * 0.453592, // Convert lbs to kg
      user.height,
      user.age,
      'male' // Would need gender field
    );
    
    return Math.round(calculateTDEE(bmr, activityLevel));
  };

  const handleSave = () => {
    const newCalorieGoal = calculateCalorieNeeds(selectedLevel);
    
    onUpdateUser({
      activityLevel: selectedLevel,
      dailyCalorieGoal: newCalorieGoal
    });
    onClose();
  };

  const selectedLevelData = activityLevels.find(level => level.id === selectedLevel);
  const estimatedCalories = calculateCalorieNeeds(selectedLevel);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Activity Level</h2>
              <p className="text-sm text-gray-600">How active are you on a typical day?</p>
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
          {/* Activity Level Options */}
          <div className="space-y-3">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id as any)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  selectedLevel === level.id 
                    ? `${level.color} border-current shadow-md` 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={selectedLevel === level.id ? level.color.split(' ')[2] : 'text-gray-600'}>
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{level.name}</h3>
                      <span className="text-sm font-medium text-gray-600">
                        {calculateCalorieNeeds(level.id)} cal/day
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{level.details}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Calorie Estimate */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Your Estimated Daily Needs</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{estimatedCalories}</div>
              <div className="text-green-600 font-medium">calories per day</div>
              <p className="text-sm text-green-700 mt-2">
                Based on your {selectedLevelData?.name.toLowerCase()} lifestyle
              </p>
            </div>
          </div>

          {/* Impact Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">This will update your daily calorie goal</p>
                <p>
                  Your current goal of {user.dailyCalorieGoal} calories will be updated to {estimatedCalories} calories 
                  based on your selected activity level.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Update Activity Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};