import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Edit3, Plus, Minus, Check, X, Flame, Award } from 'lucide-react';
import { useCalorieTracking } from '../hooks/useCalorieTracking';
import type { User } from '../types';

interface CalorieTrackerProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const CalorieTracker: React.FC<CalorieTrackerProps> = ({ user, onUpdateUser }) => {
  const { dailyTotals, getGoalProgress, addCalorieEntry, getWeeklyAverage } = useCalorieTracking(user);
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState({
    calories: user.dailyCalorieGoal,
    protein: user.dailyProteinGoal,
    carbs: user.dailyCarbGoal,
    fat: user.dailyFatGoal
  });

  const progress = getGoalProgress();
  const weeklyAvg = getWeeklyAverage();

  const saveGoals = () => {
    onUpdateUser({
      dailyCalorieGoal: tempGoals.calories,
      dailyProteinGoal: tempGoals.protein,
      dailyCarbGoal: tempGoals.carbs,
      dailyFatGoal: tempGoals.fat
    });
    setEditingGoals(false);
  };

  const cancelEdit = () => {
    setTempGoals({
      calories: user.dailyCalorieGoal,
      protein: user.dailyProteinGoal,
      carbs: user.dailyCarbGoal,
      fat: user.dailyFatGoal
    });
    setEditingGoals(false);
  };

  const adjustGoal = (field: keyof typeof tempGoals, amount: number) => {
    setTempGoals(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + amount)
    }));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 100) return 'Goal achieved! 🎉';
    if (percentage >= 80) return 'Almost there!';
    if (percentage >= 60) return 'Good progress';
    return 'Keep going!';
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Today's Progress</h2>
              <p className="text-green-700">{getProgressText(progress.calories)}</p>
            </div>
          </div>
          <button
            onClick={() => setEditingGoals(true)}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Calories</span>
              <span className="text-xs text-gray-500">
                {dailyTotals.calories}/{user.dailyCalorieGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress.calories)}`}
                style={{ width: `${Math.min(progress.calories, 100)}%` }}
              />
            </div>
            <div className="text-lg font-bold text-purple-600">{progress.calories}%</div>
          </div>

          {/* Protein */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Protein</span>
              <span className="text-xs text-gray-500">
                {dailyTotals.protein}g/{user.dailyProteinGoal}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress.protein)}`}
                style={{ width: `${Math.min(progress.protein, 100)}%` }}
              />
            </div>
            <div className="text-lg font-bold text-green-600">{progress.protein}%</div>
          </div>

          {/* Carbs */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Carbs</span>
              <span className="text-xs text-gray-500">
                {dailyTotals.carbs}g/{user.dailyCarbGoal}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress.carbs)}`}
                style={{ width: `${Math.min(progress.carbs, 100)}%` }}
              />
            </div>
            <div className="text-lg font-bold text-blue-600">{progress.carbs}%</div>
          </div>

          {/* Fat */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Fat</span>
              <span className="text-xs text-gray-500">
                {dailyTotals.fat}g/{user.dailyFatGoal}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress.fat)}`}
                style={{ width: `${Math.min(progress.fat, 100)}%` }}
              />
            </div>
            <div className="text-lg font-bold text-orange-600">{progress.fat}%</div>
          </div>
        </div>

        {/* Streak and Achievement */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-900">{user.streak} day streak</span>
          </div>
          {progress.calories >= 100 && (
            <div className="flex items-center space-x-2 text-green-600">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Goal achieved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Average</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{weeklyAvg.calories}</div>
            <div className="text-sm text-gray-600">Calories/day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{weeklyAvg.protein}g</div>
            <div className="text-sm text-gray-600">Protein/day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weeklyAvg.carbs}g</div>
            <div className="text-sm text-gray-600">Carbs/day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{weeklyAvg.fat}g</div>
            <div className="text-sm text-gray-600">Fat/day</div>
          </div>
        </div>
      </div>

      {/* Goal Editing Modal */}
      {editingGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-md w-full m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Daily Goals</h3>
              <button
                onClick={cancelEdit}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Calories Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calories</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('calories', -50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={tempGoals.calories}
                    onChange={(e) => setTempGoals({...tempGoals, calories: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('calories', 50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Protein Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Protein (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('protein', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={tempGoals.protein}
                    onChange={(e) => setTempGoals({...tempGoals, protein: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('protein', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carbs Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Carbs (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('carbs', -10)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={tempGoals.carbs}
                    onChange={(e) => setTempGoals({...tempGoals, carbs: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('carbs', 10)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fat Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Fat (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('fat', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={tempGoals.fat}
                    onChange={(e) => setTempGoals({...tempGoals, fat: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('fat', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={cancelEdit}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveGoals}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Goals</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Calories */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Calories</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[100, 200, 300, 500].map((calories) => (
            <button
              key={calories}
              onClick={() => addCalorieEntry({
                calories,
                protein: Math.round(calories * 0.15 / 4), // Rough estimate
                carbs: Math.round(calories * 0.5 / 4),
                fat: Math.round(calories * 0.35 / 9),
                mealType: 'snack',
                source: 'manual'
              })}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div className="font-bold text-purple-600">+{calories}</div>
              <div className="text-xs text-gray-600">calories</div>
            </button>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Calorie Consistency</div>
              <div className="text-sm text-gray-600">
                You're averaging {weeklyAvg.calories} calories per day this week
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.abs(weeklyAvg.calories - user.dailyCalorieGoal) <= 100 ? '🎯' : '📊'}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Protein Intake</div>
              <div className="text-sm text-gray-600">
                {progress.protein >= 80 ? 'Great protein intake!' : 'Consider adding more protein'}
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {progress.protein >= 80 ? '💪' : '🥩'}
            </div>
          </div>

          {dailyTotals.calories > user.dailyCalorieGoal * 1.2 && (
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Calorie Alert</div>
                <div className="text-sm text-gray-600">
                  You're {dailyTotals.calories - user.dailyCalorieGoal} calories over your goal
                </div>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};