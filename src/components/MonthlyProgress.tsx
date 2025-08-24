import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Target, Flame, Award, BarChart3, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ProgressChart } from './ProgressChart';
import { useMonthlyProgress } from '../hooks/useMonthlyProgress';
import type { User } from '../types';

interface MonthlyProgressProps {
  user: User;
  onClose: () => void;
}

export const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ user, onClose }) => {
  const { monthlyStats, weeklyStats, getCurrentMonthStats, getGoalTrends, getCalorieConsistency } = useMonthlyProgress(user);
  const [selectedMonth, setSelectedMonth] = useState(0); // Index of selected month
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const currentMonth = getCurrentMonthStats();
  const goalTrends = getGoalTrends();
  const consistencyScore = getCalorieConsistency();

  const selectedStats = monthlyStats[selectedMonth];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedMonth < monthlyStats.length - 1) {
      setSelectedMonth(selectedMonth + 1);
    } else if (direction === 'next' && selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const getGoalStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Progress Analytics</h2>
              <p className="text-sm text-gray-600">Track your monthly nutrition journey</p>
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
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly View
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'weekly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weekly View
              </button>
            </div>
            
            {viewMode === 'monthly' && monthlyStats.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  disabled={selectedMonth >= monthlyStats.length - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-gray-900 min-w-[120px] text-center">
                  {selectedStats?.month} {selectedStats?.year}
                </span>
                <button
                  onClick={() => navigateMonth('next')}
                  disabled={selectedMonth <= 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {viewMode === 'monthly' ? (
            /* Monthly View */
            <>
              {/* Current Month Overview */}
              {currentMonth && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(goalTrends.trend)}
                      <span className="text-sm font-medium text-gray-700">
                        {goalTrends.trend === 'improving' ? `+${goalTrends.change}%` : 
                         goalTrends.trend === 'declining' ? `-${goalTrends.change}%` : 'Stable'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentMonth.daysLogged}</div>
                      <div className="text-sm text-gray-600">Days Logged</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentMonth.goalPercentage}%</div>
                      <div className="text-sm text-gray-600">Goals Hit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{currentMonth.avgCalories}</div>
                      <div className="text-sm text-gray-600">Avg Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{consistencyScore}%</div>
                      <div className="text-sm text-gray-600">Consistency</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Month Details */}
              {selectedStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedStats.month} {selectedStats.year} Summary
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Days Logged</span>
                        <span className="font-bold text-gray-900">{selectedStats.daysLogged}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Goals Achieved</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">{selectedStats.goalsHit}/{selectedStats.totalGoals}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(selectedStats.goalPercentage)}`}>
                            {selectedStats.goalPercentage}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Longest Streak</span>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-bold text-gray-900">{selectedStats.streakDays} days</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Calories</span>
                        <span className="font-bold text-gray-900">{selectedStats.totalCalories.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Averages</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Calories</span>
                          <span className="font-medium">{selectedStats.avgCalories} / {user.dailyCalorieGoal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((selectedStats.avgCalories / user.dailyCalorieGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Protein</span>
                          <span className="font-medium">{selectedStats.avgProtein}g / {user.dailyProteinGoal}g</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((selectedStats.avgProtein / user.dailyProteinGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Carbs</span>
                          <span className="font-medium">{selectedStats.avgCarbs}g / {user.dailyCarbGoal}g</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((selectedStats.avgCarbs / user.dailyCarbGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Fat</span>
                          <span className="font-medium">{selectedStats.avgFat}g / {user.dailyFatGoal}g</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((selectedStats.avgFat / user.dailyFatGoal) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Progress Chart */}
              {monthlyStats.length > 1 && (
                <ProgressChart
                  data={monthlyStats.slice().reverse().map(stat => ({
                    date: `${stat.month.slice(0, 3)} ${stat.year}`,
                    value: stat.goalPercentage,
                    goal: 90
                  }))}
                  title="Monthly Goal Achievement"
                  unit="%"
                  color="#3b82f6"
                />
              )}

              {/* Insights */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Goal Consistency</div>
                      <div className="text-sm text-gray-600">
                        You hit your goals {currentMonth?.goalPercentage || 0}% of the time this month.
                        {(currentMonth?.goalPercentage || 0) >= 80 ? 
                          ' Excellent consistency! Keep it up!' : 
                          ' Try meal prepping to improve consistency.'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Calorie Consistency</div>
                      <div className="text-sm text-gray-600">
                        Your consistency score is {consistencyScore}%.
                        {consistencyScore >= 80 ? 
                          ' Great job maintaining steady intake!' : 
                          ' Try to keep daily calories more consistent.'
                        }
                      </div>
                    </div>
                  </div>

                  {goalTrends.trend !== 'stable' && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getTrendIcon(goalTrends.trend)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Progress Trend</div>
                        <div className="text-sm text-gray-600">
                          Your goal achievement is {goalTrends.trend} by {goalTrends.change}% compared to last month.
                          {goalTrends.trend === 'improving' ? 
                            ' You\'re on the right track!' : 
                            ' Consider adjusting your approach.'
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Weekly View */
            <>
              {/* Weekly Overview */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{weeklyStats.length}</div>
                    <div className="text-sm text-gray-600">Weeks Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {weeklyStats.length > 0 ? Math.round(weeklyStats.reduce((sum, week) => sum + week.goalPercentage, 0) / weeklyStats.length) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Goal Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {weeklyStats.length > 0 ? Math.round(weeklyStats.reduce((sum, week) => sum + week.avgCalories, 0) / weeklyStats.length) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Avg Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {weeklyStats.length > 0 ? Math.round(weeklyStats.reduce((sum, week) => sum + week.daysLogged, 0) / weeklyStats.length) : 0}
                    </div>
                    <div className="text-sm text-gray-600">Avg Days/Week</div>
                  </div>
                </div>
              </div>

              {/* Weekly Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Breakdown</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {weeklyStats.map((week, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{week.week}</div>
                        <div className="text-sm text-gray-600">{week.daysLogged} days logged</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{week.avgCalories} cal/day</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${getGoalStatusColor(week.goalPercentage)}`}>
                          {week.goalPercentage}% goals
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Chart */}
              {weeklyStats.length > 1 && (
                <ProgressChart
                  data={weeklyStats.map(week => ({
                    date: week.week.replace('Week of ', ''),
                    value: week.avgCalories,
                    goal: user.dailyCalorieGoal
                  }))}
                  title="Weekly Average Calories"
                  unit="cal"
                  color="#8b5cf6"
                />
              )}
            </>
          )}

          {/* No Data State */}
          {monthlyStats.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Progress Data Yet</h3>
              <p className="text-gray-600 mb-4">Start logging your meals to see detailed progress analytics</p>
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Logging Meals
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};