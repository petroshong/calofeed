import React, { useState } from 'react';
import { Trophy, Users, Calendar, Target, Flame, Star, Clock, Medal, Gift, Zap, Crown, Filter } from 'lucide-react';
import type { Challenge } from '../types';

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Protein Challenge',
    description: 'Hit your daily protein goal for 7 consecutive days',
    type: 'streak',
    target: 7,
    participants: 1234,
    endDate: '2024-02-15',
    startDate: '2024-02-08',
    progress: 4,
    isJoined: true,
    reward: '🏆 Protein Master Badge',
    category: 'nutrition',
    difficulty: 'intermediate',
    rules: ['Log meals daily', 'Hit protein goal', 'No cheat days'],
    prize: '$50 supplement voucher'
  },
  {
    id: '2',
    title: 'January Calorie Champions',
    description: 'Stay within your daily calorie goals for the entire month',
    type: 'daily',
    target: 31,
    participants: 2156,
    endDate: '2024-01-31',
    startDate: '2024-01-01',
    progress: 12,
    isJoined: false,
    reward: '⭐ 500 XP + Special Badge',
    category: 'nutrition',
    difficulty: 'advanced',
    rules: ['Stay within calorie goals', 'Log all meals', 'Weekly check-ins'],
    prize: 'Premium subscription (3 months)'
  },
  {
    id: '3',
    title: 'Veggie Warrior Week',
    description: 'Include vegetables in every meal for one week',
    type: 'streak',
    target: 7,
    participants: 856,
    endDate: '2024-02-10',
    startDate: '2024-02-03',
    isJoined: false,
    reward: '🥬 Veggie Master Title',
    category: 'nutrition',
    difficulty: 'beginner',
    rules: ['Include vegetables in every meal', 'Photo proof required'],
    prize: 'Healthy cookbook'
  },
  {
    id: '4',
    title: '10K Steps + Healthy Meals',
    description: 'Combine 10,000 steps daily with balanced nutrition',
    type: 'daily',
    target: 14,
    participants: 3421,
    endDate: '2024-02-20',
    startDate: '2024-02-06',
    progress: 8,
    isJoined: true,
    reward: '🏃‍♀️ Fitness Foodie Badge',
    category: 'fitness',
    difficulty: 'advanced',
    rules: ['10,000+ steps daily', 'Balanced macros', 'Hydration tracking'],
    prize: 'Fitness tracker'
  }
];

export const Challenges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'discover'>('active');
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'nutrition' | 'fitness' | 'social' | 'lifestyle'>('all');

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: !challenge.isJoined, participants: challenge.isJoined ? challenge.participants - 1 : challenge.participants + 1 }
        : challenge
    ));
  };

  const activeChallenges = challenges.filter(c => c.isJoined);
  const availableChallenges = challenges.filter(c => !c.isJoined);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Challenges</h1>
            <p className="text-purple-100">Push your limits and earn rewards</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <div className="text-2xl font-bold">{activeChallenges.length}</div>
              <div className="text-sm text-purple-200">Active</div>
            </div>
            <div className="flex items-center space-x-1 text-purple-200">
              <Gift className="w-4 h-4" />
              <span className="text-sm">Rewards waiting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'active' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Challenges ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'discover' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discover New
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'completed' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Challenges</h3>
                <p className="text-gray-600 mb-4">Join a challenge to start earning rewards and building streaks!</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              activeChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                      <p className="text-gray-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getDaysRemaining(challenge.endDate)} days left</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl ml-4">{challenge.reward.split(' ')[0]}</div>
                  </div>

                  {challenge.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{challenge.progress}/{challenge.target} {challenge.type === 'streak' ? 'days' : 'goals'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(challenge.progress, challenge.target)}`}
                          style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {challenge.progress >= challenge.target && (
                        <div className="flex items-center space-x-2 mt-3 text-green-600">
                          <Medal className="w-5 h-5" />
                          <span className="font-medium">Challenge Completed! 🎉</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-purple-600 font-medium">
                      Reward: {challenge.reward}
                    </div>
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      Leave Challenge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Browse Challenges</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="fitness">Fitness</option>
                    <option value="social">Social</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Challenge */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Featured Challenge</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">New Year Transformation</h3>
              <p className="text-gray-700 mb-4">Complete 30 days of balanced nutrition and exercise tracking</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">$500 Prize Pool</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>5,847 joined</span>
                  </div>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Join Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                        <span className="text-2xl">{challenge.reward.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {challenge.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{challenge.participants}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{challenge.target} {challenge.type === 'streak' ? 'days' : 'goals'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{getDaysRemaining(challenge.endDate)} days</span>
                        </div>
                        {challenge.prize && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Gift className="w-3 h-3" />
                            <span>Prize</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-600 font-medium">{challenge.reward}</div>
                      {challenge.prize && (
                        <div className="text-xs text-gray-600 mt-1">Prize: {challenge.prize}</div>
                      )}
                    </div>
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Join Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="text-center py-12">
            <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Challenges Yet</h3>
            <p className="text-gray-600">Complete your first challenge to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};