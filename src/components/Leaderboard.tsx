import React, { useState } from 'react';
import { Trophy, Flame, Target, User, Crown, Medal, Award, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LeaderboardUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  streak?: number;
  isFollowing: boolean;
  rank: number;
}

const mockLeaderboardData = {
  calories: [
    {
      id: '1',
      username: 'fitnessguru',
      displayName: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 98,
      streak: 28,
      isFollowing: true,
      rank: 1
    },
    {
      id: '2',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 96,
      streak: 25,
      isFollowing: true,
      rank: 2
    },
    {
      id: '3',
      username: 'plantbased',
      displayName: 'Emma Green',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 94,
      streak: 22,
      isFollowing: false,
      rank: 3
    },
    {
      id: '4',
      username: 'fitnessfoodie',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 89,
      streak: 12,
      isFollowing: false,
      rank: 4
    },
    {
      id: '5',
      username: 'proteinpower',
      displayName: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 87,
      streak: 18,
      isFollowing: true,
      rank: 5
    }
  ],
  streak: [
    {
      id: '1',
      username: 'streakmaster',
      displayName: 'Lisa Park',
      avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 45,
      isFollowing: false,
      rank: 1
    },
    {
      id: '2',
      username: 'consistentcarl',
      displayName: 'Carl Thompson',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 42,
      isFollowing: true,
      rank: 2
    },
    {
      id: '3',
      username: 'dailydiscipline',
      displayName: 'Maria Santos',
      avatar: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 38,
      isFollowing: false,
      rank: 3
    }
  ],
  protein: [
    {
      id: '1',
      username: 'proteinqueen',
      displayName: 'Amanda Davis',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 156,
      isFollowing: true,
      rank: 1
    },
    {
      id: '2',
      username: 'gainzguru',
      displayName: 'Tyler Brooks',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 148,
      isFollowing: false,
      rank: 2
    },
    {
      id: '3',
      username: 'musclemeal',
      displayName: 'Kevin Foster',
      avatar: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      score: 142,
      isFollowing: true,
      rank: 3
    }
  ]
};

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calories' | 'streak' | 'protein'>('calories');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [region, setRegion] = useState<'global' | 'local' | 'friends'>('global');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  const currentData = mockLeaderboardData[activeTab];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getScoreLabel = (tab: string) => {
    switch (tab) {
      case 'calories':
        return 'Goal Achievement %';
      case 'streak':
        return 'Days';
      case 'protein':
        return 'Avg Daily (g)';
      default:
        return 'Score';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 lg:pb-0 px-4 lg:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-xl lg:mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-yellow-100">See how you stack up against the community</p>
          </div>
          <div className="text-right">
            <Trophy className="w-12 h-12 text-yellow-200 mb-2" />
            <div className="text-sm text-yellow-200">Rank #15</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Rankings</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="global">Global</option>
              <option value="local">Local</option>
              <option value="friends">Friends</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('calories')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'calories' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Calorie Goals</span>
        </button>
        <button
          onClick={() => setActiveTab('streak')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'streak' 
              ? 'bg-white text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Streaks</span>
        </button>
        <button
          onClick={() => setActiveTab('protein')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            activeTab === 'protein' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Protein</span>
        </button>
      </div>

      {/* Timeframe Filter */}
      <div className="px-4 pb-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
          {['week', 'month', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as 'week' | 'month' | 'all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-600 hover:text-gray-900'
              }`}
            >
              This {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="p-4 lg:p-8">
        {/* Top 3 Podium */}
        {currentData.length >= 3 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Top Performers</h2>
            <div className="flex items-end justify-center space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="relative mb-3">
                  <img 
                    src={currentData[1].avatar} 
                    alt={currentData[1].displayName}
                    className="w-16 h-16 rounded-full object-cover mx-auto border-4 border-gray-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 h-24 flex flex-col justify-center">
                  <div className="font-semibold text-sm text-gray-900">{currentData[1].displayName}</div>
                  <div className="text-lg font-bold text-gray-700">{currentData[1].score}</div>
                  <div className="text-xs text-gray-600">{getScoreLabel(activeTab)}</div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="relative mb-3">
                  <img 
                    src={currentData[0].avatar} 
                    alt={currentData[0].displayName}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-yellow-400"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500" />
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4 h-28 flex flex-col justify-center">
                  <div className="font-semibold text-gray-900">{currentData[0].displayName}</div>
                  <div className="text-2xl font-bold text-yellow-600">{currentData[0].score}</div>
                  <div className="text-xs text-gray-600">{getScoreLabel(activeTab)}</div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="relative mb-3">
                  <img 
                    src={currentData[2].avatar} 
                    alt={currentData[2].displayName}
                    className="w-16 h-16 rounded-full object-cover mx-auto border-4 border-amber-600"
                  />
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 h-24 flex flex-col justify-center">
                  <div className="font-semibold text-sm text-gray-900">{currentData[2].displayName}</div>
                  <div className="text-lg font-bold text-amber-600">{currentData[2].score}</div>
                  <div className="text-xs text-gray-600">{getScoreLabel(activeTab)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Full Rankings</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {currentData.map((user, index) => (
              <div key={user.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {getRankIcon(user.rank)}
                  <img 
                    src={user.avatar} 
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{user.displayName}</div>
                  <div className="text-sm text-gray-600">@{user.username}</div>
                </div>

                {activeTab === 'calories' && user.streak && (
                  <div className="text-right">
                    <div className="flex items-center text-orange-600 text-sm">
                      <Flame className="w-4 h-4 mr-1" />
                      {user.streak} days
                    </div>
                  </div>
                )}

                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{user.score}</div>
                  <div className="text-xs text-gray-600">{getScoreLabel(activeTab)}</div>
                </div>

                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  user.isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  onClick={() => {
                    setShowAuthPrompt(true);
                  }}
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Live rankings</span>
            </div>
          </div>
        </div>

        {/* Your Ranking */}
        {isAuthenticated && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                #15
              </div>
              <div>
                <div className="font-semibold text-gray-900">Your Rank</div>
                <div className="text-sm text-gray-600">Keep pushing to climb higher!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">82</div>
              <div className="text-xs text-gray-600">{getScoreLabel(activeTab)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+3 positions this week</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Next: #14 (2 points away)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Weekly Progress</span>
              <span className="font-medium text-green-600">+12 points</span>
            </div>
          </div>
        </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
            <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Join the Competition</h3>
            <p className="text-gray-600 mb-4">
              Sign up to see your ranking and compete with the community!
            </p>
            <button
              onClick={() => setShowAuthPrompt(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sign Up to Compete
            </button>
          </div>
        )}

        {/* Auth Prompt Modal */}
        {showAuthPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Join the Leaderboard</h2>
              <p className="text-gray-600 mb-6">
                Sign up to track your progress and compete with friends!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};