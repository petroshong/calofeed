import React, { useState } from 'react';
import { X, Plus, Scale, TrendingUp, TrendingDown, Calendar, Target, Edit3, Trash2, Save, Minus } from 'lucide-react';
import { ProgressChart } from './ProgressChart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { WeightEntry, User } from '../types';

interface WeightTrackerProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({ user, onClose, onUpdateUser }) => {
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('weight_entries', []);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    bodyFat: '',
    muscleMass: '',
    mood: 'neutral' as 'great' | 'good' | 'neutral' | 'tired' | 'stressed'
  });
  const [tempGoals, setTempGoals] = useState({
    currentWeight: user.currentWeight || 0,
    goalWeight: user.goalWeight || 0
  });

  const addWeightEntry = () => {
    if (!newEntry.weight) return;

    const entry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newEntry.weight),
      date: newEntry.date,
      note: newEntry.note,
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
      mood: newEntry.mood
    };

    setWeightEntries(prev => [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    // Update current weight in user profile
    onUpdateUser({ currentWeight: entry.weight });
    
    setNewEntry({
      weight: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      bodyFat: '',
      muscleMass: '',
      mood: 'neutral'
    });
    setShowAddEntry(false);
  };

  const deleteEntry = (entryId: string) => {
    setWeightEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const saveGoals = () => {
    onUpdateUser({
      currentWeight: tempGoals.currentWeight,
      goalWeight: tempGoals.goalWeight
    });
    setEditingGoals(false);
  };

  const getWeightTrend = () => {
    if (weightEntries.length < 2) return { trend: 'stable', change: 0 };
    
    const latest = weightEntries[weightEntries.length - 1];
    const previous = weightEntries[weightEntries.length - 2];
    const change = latest.weight - previous.weight;
    
    return {
      trend: change > 0.5 ? 'gaining' : change < -0.5 ? 'losing' : 'stable',
      change: Math.abs(change)
    };
  };

  const getProgressToGoal = () => {
    if (!user.currentWeight || !user.goalWeight) return 0;
    const totalChange = Math.abs(user.goalWeight - (weightEntries[0]?.weight || user.currentWeight));
    const currentChange = Math.abs(user.currentWeight - (weightEntries[0]?.weight || user.currentWeight));
    return totalChange > 0 ? (currentChange / totalChange) * 100 : 0;
  };

  const weightTrend = getWeightTrend();
  const progressToGoal = getProgressToGoal();

  const chartData = weightEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: entry.weight,
    goal: user.goalWeight
  }));

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'tired': return '😴';
      case 'stressed': return '😰';
      default: return '😐';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Weight Tracking</h2>
              <p className="text-sm text-gray-600">Monitor your progress over time</p>
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
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Scale className="w-6 h-6 text-blue-600" />
                <button
                  onClick={() => setEditingGoals(true)}
                  className="p-1 text-blue-600 hover:text-blue-700 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-2xl font-bold text-blue-700">{user.currentWeight || 0} lbs</div>
              <div className="text-sm text-blue-600">Current Weight</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-green-600" />
                <div className={`flex items-center space-x-1 text-sm ${
                  weightTrend.trend === 'losing' ? 'text-green-600' : 
                  weightTrend.trend === 'gaining' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {weightTrend.trend === 'losing' && <TrendingDown className="w-4 h-4" />}
                  {weightTrend.trend === 'gaining' && <TrendingUp className="w-4 h-4" />}
                  <span>{weightTrend.change.toFixed(1)} lbs</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700">{user.goalWeight || 0} lbs</div>
              <div className="text-sm text-green-600">Goal Weight</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="text-sm text-purple-600">{progressToGoal.toFixed(0)}%</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {Math.abs((user.currentWeight || 0) - (user.goalWeight || 0)).toFixed(1)} lbs
              </div>
              <div className="text-sm text-purple-600">To Goal</div>
            </div>
          </div>

          {/* Progress Chart */}
          {weightEntries.length > 1 && (
            <ProgressChart
              data={chartData}
              title="Weight Progress"
              unit="lbs"
              color="#3b82f6"
            />
          )}

          {/* Quick Add Weight */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Log Weight</h3>
              <button
                onClick={() => setShowAddEntry(!showAddEntry)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>

            {showAddEntry && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                      placeholder="Enter weight"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat % (optional)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.bodyFat}
                      onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                      placeholder="e.g., 15.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Muscle Mass (optional)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.muscleMass}
                      onChange={(e) => setNewEntry({...newEntry, muscleMass: e.target.value})}
                      placeholder="e.g., 140"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['great', 'good', 'neutral', 'tired', 'stressed'] as const).map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setNewEntry({...newEntry, mood})}
                        className={`p-3 rounded-lg border transition-colors ${
                          newEntry.mood === mood 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                        <div className="text-xs capitalize">{mood}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={newEntry.note}
                    onChange={(e) => setNewEntry({...newEntry, note: e.target.value})}
                    placeholder="How are you feeling? Any observations?"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEntry(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addWeightEntry}
                    disabled={!newEntry.weight}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Weight History */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight History</h3>
            {weightEntries.length === 0 ? (
              <div className="text-center py-8">
                <Scale className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No weight entries yet</p>
                <p className="text-sm text-gray-500">Start tracking to see your progress</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {weightEntries.slice().reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{entry.weight} lbs</div>
                        <div className="text-xs text-gray-600">{new Date(entry.date).toLocaleDateString()}</div>
                      </div>
                      {entry.mood && (
                        <div className="text-xl">{getMoodEmoji(entry.mood)}</div>
                      )}
                      <div className="flex-1">
                        {entry.note && (
                          <p className="text-sm text-gray-700">{entry.note}</p>
                        )}
                        <div className="flex space-x-3 text-xs text-gray-500">
                          {entry.bodyFat && <span>BF: {entry.bodyFat}%</span>}
                          {entry.muscleMass && <span>Muscle: {entry.muscleMass} lbs</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insights */}
          {weightEntries.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {weightTrend.trend === 'losing' && <TrendingDown className="w-5 h-5 text-green-600" />}
                    {weightTrend.trend === 'gaining' && <TrendingUp className="w-5 h-5 text-red-600" />}
                    {weightTrend.trend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
                    <span className="font-medium text-gray-900">Recent Trend</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {weightTrend.trend === 'losing' && `You've lost ${weightTrend.change.toFixed(1)} lbs recently`}
                    {weightTrend.trend === 'gaining' && `You've gained ${weightTrend.change.toFixed(1)} lbs recently`}
                    {weightTrend.trend === 'stable' && 'Your weight has been stable'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Goal Progress</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressToGoal, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{progressToGoal.toFixed(0)}% to goal</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Goal Editing Modal */}
        {editingGoals && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
            <div className="bg-white rounded-2xl max-w-md w-full m-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Weight Goals</h3>
                <button
                  onClick={() => setEditingGoals(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempGoals.currentWeight}
                    onChange={(e) => setTempGoals({...tempGoals, currentWeight: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempGoals.goalWeight}
                    onChange={(e) => setTempGoals({...tempGoals, goalWeight: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setEditingGoals(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveGoals}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};