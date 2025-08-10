import React, { useState } from 'react';
import { X, Target, Save, Plus, Minus, Calculator, TrendingUp, Activity, Zap } from 'lucide-react';
import { calculateBMR, calculateTDEE, calculateMacroGoals } from '../utils/helpers';
import type { User } from '../types';

interface GoalsTargetsProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const GoalsTargets: React.FC<GoalsTargetsProps> = ({ user, onClose, onUpdateUser }) => {
  const [goals, setGoals] = useState({
    dailyCalorieGoal: user.dailyCalorieGoal,
    dailyProteinGoal: user.dailyProteinGoal,
    dailyCarbGoal: user.dailyCarbGoal,
    dailyFatGoal: user.dailyFatGoal
  });
  const [macroRatio, setMacroRatio] = useState<'balanced' | 'low_carb' | 'high_protein' | 'mediterranean'>('balanced');
  const [weightGoal, setWeightGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [weeklyWeightChange, setWeeklyWeightChange] = useState(1); // lbs per week

  const calculateRecommendedCalories = () => {
    if (!user.currentWeight || !user.height || !user.age) {
      return { calories: 2000, message: 'Please update your physical stats for personalized recommendations' };
    }

    const bmr = calculateBMR(
      user.currentWeight * 0.453592, // Convert lbs to kg
      user.height,
      user.age,
      'male' // Would need gender field in user profile
    );
    
    const tdee = calculateTDEE(bmr, user.activityLevel);
    
    let targetCalories = tdee;
    let message = '';

    switch (weightGoal) {
      case 'lose':
        targetCalories = tdee - (weeklyWeightChange * 500); // 500 cal deficit per lb
        message = `To lose ${weeklyWeightChange} lb/week`;
        break;
      case 'gain':
        targetCalories = tdee + (weeklyWeightChange * 500); // 500 cal surplus per lb
        message = `To gain ${weeklyWeightChange} lb/week`;
        break;
      default:
        message = 'To maintain current weight';
    }

    return { calories: Math.round(targetCalories), message };
  };

  const applyRecommendedCalories = () => {
    const { calories } = calculateRecommendedCalories();
    const macros = calculateMacroGoals(calories, macroRatio);
    
    setGoals({
      dailyCalorieGoal: calories,
      dailyProteinGoal: macros.protein,
      dailyCarbGoal: macros.carbs,
      dailyFatGoal: macros.fat
    });
  };

  const adjustGoal = (field: keyof typeof goals, amount: number) => {
    setGoals(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + amount)
    }));
  };

  const handleSave = () => {
    onUpdateUser(goals);
    onClose();
  };

  const recommended = calculateRecommendedCalories();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Goals & Targets</h2>
              <p className="text-sm text-gray-600">Set your daily nutrition goals</p>
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
          {/* Weight Goal Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your goal?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'lose', label: 'Lose Weight', emoji: '📉', color: 'text-red-600 bg-red-50 border-red-200' },
                { id: 'maintain', label: 'Maintain', emoji: '⚖️', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { id: 'gain', label: 'Gain Weight', emoji: '📈', color: 'text-green-600 bg-green-50 border-green-200' }
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setWeightGoal(goal.id as any)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    weightGoal === goal.id 
                      ? `${goal.color} border-current shadow-md` 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.emoji}</div>
                  <div className="font-medium text-sm">{goal.label}</div>
                </button>
              ))}
            </div>

            {weightGoal !== 'maintain' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target rate: {weeklyWeightChange} lb per week
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setWeeklyWeightChange(Math.max(0.5, weeklyWeightChange - 0.5))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.5"
                      value={weeklyWeightChange}
                      onChange={(e) => setWeeklyWeightChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5 lb</span>
                      <span>2 lb</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setWeeklyWeightChange(Math.min(2, weeklyWeightChange + 0.5))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Macro Ratio Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Macro Distribution</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'balanced', label: 'Balanced', desc: '45% carbs, 25% protein, 30% fat' },
                { id: 'low_carb', label: 'Low Carb', desc: '20% carbs, 35% protein, 45% fat' },
                { id: 'high_protein', label: 'High Protein', desc: '35% carbs, 40% protein, 25% fat' },
                { id: 'mediterranean', label: 'Mediterranean', desc: '50% carbs, 20% protein, 30% fat' }
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setMacroRatio(ratio.id as any)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    macroRatio === ratio.id 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{ratio.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Calories */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recommended Daily Calories</h3>
                <p className="text-sm text-blue-700">{recommended.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">{recommended.calories}</div>
                <div className="text-sm text-blue-600">calories per day</div>
              </div>
              <button
                onClick={applyRecommendedCalories}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Use This</span>
              </button>
            </div>
          </div>

          {/* Manual Goal Setting */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Goals</h3>
            <div className="space-y-4">
              {/* Calories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calories</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('dailyCalorieGoal', -50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={goals.dailyCalorieGoal}
                    onChange={(e) => setGoals({...goals, dailyCalorieGoal: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('dailyCalorieGoal', 50)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Protein */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Protein (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('dailyProteinGoal', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={goals.dailyProteinGoal}
                    onChange={(e) => setGoals({...goals, dailyProteinGoal: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('dailyProteinGoal', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carbs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Carbs (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('dailyCarbGoal', -10)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={goals.dailyCarbGoal}
                    onChange={(e) => setGoals({...goals, dailyCarbGoal: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('dailyCarbGoal', 10)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Fat (g)</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustGoal('dailyFatGoal', -5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={goals.dailyFatGoal}
                    onChange={(e) => setGoals({...goals, dailyFatGoal: parseInt(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                  <button
                    onClick={() => adjustGoal('dailyFatGoal', 5)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Daily Goal Summary</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-600">{goals.dailyCalorieGoal}</div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{goals.dailyProteinGoal}g</div>
                <div className="text-xs text-gray-600">Protein</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{goals.dailyCarbGoal}g</div>
                <div className="text-xs text-gray-600">Carbs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{goals.dailyFatGoal}g</div>
                <div className="text-xs text-gray-600">Fat</div>
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
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Goals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};