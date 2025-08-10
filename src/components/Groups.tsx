import React, { useState } from 'react';
import { Users, Plus, Search, Crown, Lock, Globe, TrendingUp, Calendar, MapPin, Star } from 'lucide-react';
import type { Group } from '../types';

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Keto Warriors',
    description: 'Low-carb lifestyle enthusiasts sharing recipes and motivation',
    avatar: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
    memberCount: 12847,
    isJoined: true,
    isPrivate: false,
    category: 'Diet',
    tags: ['keto', 'low-carb', 'weight-loss'],
    createdBy: 'ketocoach',
    createdDate: '2023-03-15'
  },
  {
    id: '2',
    name: 'Plant-Based Power',
    description: 'Vegan and vegetarian meal inspiration and support',
    avatar: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=200',
    memberCount: 8934,
    isJoined: false,
    isPrivate: false,
    category: 'Diet',
    tags: ['vegan', 'vegetarian', 'plant-based'],
    createdBy: 'plantpro',
    createdDate: '2023-05-20'
  },
  {
    id: '3',
    name: 'Meal Prep Masters',
    description: 'Weekly meal prep strategies and batch cooking tips',
    avatar: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=200',
    memberCount: 15623,
    isJoined: true,
    isPrivate: false,
    category: 'Lifestyle',
    tags: ['meal-prep', 'batch-cooking', 'time-saving'],
    createdBy: 'prepqueen',
    createdDate: '2023-01-10'
  },
  {
    id: '4',
    name: 'SF Foodies',
    description: 'San Francisco food lovers sharing local restaurant finds',
    avatar: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=200',
    memberCount: 3421,
    isJoined: false,
    isPrivate: true,
    category: 'Location',
    tags: ['san-francisco', 'restaurants', 'local'],
    createdBy: 'sffoodie',
    createdDate: '2023-08-05'
  }
];

export const Groups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover' | 'trending'>('my-groups');
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');

  const myGroups = groups.filter(g => g.isJoined);
  const discoverGroups = groups.filter(g => !g.isJoined);

  const toggleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
          }
        : group
    ));
  };

  const filteredGroups = activeTab === 'my-groups' 
    ? myGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : discoverGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Groups</h1>
            <p className="text-blue-100">Connect with like-minded food enthusiasts</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{myGroups.length}</div>
            <div className="text-sm text-blue-200">Joined</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-4 bg-gray-50">
        <button
          onClick={() => setActiveTab('my-groups')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'my-groups' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Groups ({myGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'discover' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'trending' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Trending
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        {activeTab === 'my-groups' && (
          <div className="space-y-4">
            {myGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Yet</h3>
                <p className="text-gray-600 mb-4">Join groups to connect with people who share your food interests!</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Discover Groups
                </button>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={group.avatar} 
                      alt={group.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                        {group.isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
                        {!group.isPrivate && <Globe className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{group.memberCount.toLocaleString()} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Since {new Date(group.createdDate).getFullYear()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {group.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleJoinGroup(group.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Featured Categories */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {['Diet', 'Fitness', 'Lifestyle', 'Location'].map((category) => (
                  <button key={category} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">
                      {category === 'Diet' && '🥗'}
                      {category === 'Fitness' && '💪'}
                      {category === 'Lifestyle' && '🌟'}
                      {category === 'Location' && '📍'}
                    </div>
                    <div className="font-medium text-gray-900">{category}</div>
                    <div className="text-sm text-gray-600">
                      {category === 'Diet' && '24 groups'}
                      {category === 'Fitness' && '18 groups'}
                      {category === 'Lifestyle' && '31 groups'}
                      {category === 'Location' && '12 groups'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Groups */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Discover New Groups</h2>
              <div className="grid gap-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                          {group.isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
                          {!group.isPrivate && <Globe className="w-4 h-4 text-green-500" />}
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{group.category}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{group.memberCount.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Very Active</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {group.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleJoinGroup(group.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {group.isPrivate ? 'Request' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Trending This Week</h2>
              </div>
              <div className="grid gap-4">
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=60"
                        alt="Trending group"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">New Year, New Gains</h3>
                        <p className="text-sm text-gray-600">2,847 new members this week</p>
                      </div>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+340%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Active Groups</h2>
              <div className="space-y-4">
                {mockGroups.slice(0, 3).map((group, index) => (
                  <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                        <img 
                          src={group.avatar} 
                          alt={group.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.memberCount.toLocaleString()} members</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">847 posts</div>
                        <div className="text-xs text-gray-500">this week</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Group FAB */}
      <button className="fixed bottom-24 lg:bottom-8 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};