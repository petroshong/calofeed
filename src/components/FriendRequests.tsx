import React, { useState } from 'react';
import { X, UserPlus, UserCheck, MessageCircle, Clock, Check, UserX, Star, Crown } from 'lucide-react';
import { useFriendRequests } from '../hooks/useFriendRequests';
import type { User } from '../types';

interface FriendRequestsProps {
  currentUser: User;
  onClose: () => void;
  onViewProfile: (user: User) => void;
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ currentUser, onClose, onViewProfile }) => {
  const { 
    getIncomingRequests, 
    getOutgoingRequests, 
    acceptFriendRequest, 
    declineFriendRequest, 
    cancelFriendRequest 
  } = useFriendRequests(currentUser);
  
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'find'>('incoming');
  
  const incomingRequests = getIncomingRequests();
  const outgoingRequests = getOutgoingRequests();

  const handleAccept = (requestId: string) => {
    acceptFriendRequest(requestId);
    // Show success message
    console.log('Friend request accepted!');
  };

  const handleDecline = (requestId: string) => {
    declineFriendRequest(requestId);
    console.log('Friend request declined');
  };

  const handleCancel = (requestId: string) => {
    cancelFriendRequest(requestId);
    console.log('Friend request cancelled');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Friend Requests</h2>
            <p className="text-sm text-gray-600">
              {incomingRequests.length} incoming • {outgoingRequests.length} outgoing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-4 bg-gray-50">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'incoming' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Incoming ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'outgoing' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Outgoing ({outgoingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'find' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find Friends
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'incoming' && (
            <div className="space-y-4">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Friend Requests</h3>
                  <p className="text-gray-600">You don't have any pending friend requests</p>
                </div>
              ) : (
                incomingRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      <button onClick={() => onViewProfile(request.fromUser)}>
                        <img 
                          src={request.fromUser.avatar} 
                          alt={request.fromUser.displayName}
                          className="w-16 h-16 rounded-full object-cover hover:ring-2 hover:ring-green-500 transition-all"
                        />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <button 
                            onClick={() => onViewProfile(request.fromUser)}
                            className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                          >
                            {request.fromUser.displayName}
                          </button>
                          {request.fromUser.isVerified && <Star className="w-5 h-5 text-blue-500 fill-current" />}
                          {request.fromUser.isPremium && (
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">PRO</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">@{request.fromUser.username}</p>
                        <p className="text-gray-700 text-sm mb-3">{request.fromUser.bio}</p>
                        
                        {request.message && (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">"{request.message}"</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(request.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'outgoing' && (
            <div className="space-y-4">
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Outgoing Requests</h3>
                  <p className="text-gray-600">You haven't sent any friend requests</p>
                </div>
              ) : (
                outgoingRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      <button onClick={() => onViewProfile(request.toUser)}>
                        <img 
                          src={request.toUser.avatar} 
                          alt={request.toUser.displayName}
                          className="w-16 h-16 rounded-full object-cover hover:ring-2 hover:ring-green-500 transition-all"
                        />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <button 
                            onClick={() => onViewProfile(request.toUser)}
                            className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                          >
                            {request.toUser.displayName}
                          </button>
                          {request.toUser.isVerified && <Star className="w-5 h-5 text-blue-500 fill-current" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">@{request.toUser.username}</p>
                        <p className="text-gray-700 text-sm mb-3">{request.toUser.bio}</p>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Sent {new Date(request.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium text-center text-sm">
                          Pending
                        </div>
                        <button
                          onClick={() => handleCancel(request.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'find' && (
            <div className="space-y-6">
              {/* Quick Connect Options */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Connect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-3 p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Import Contacts</div>
                      <div className="text-sm text-gray-600">Find friends from your contacts</div>
                    </div>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Find Nearby</div>
                      <div className="text-sm text-gray-600">Connect with local users</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Suggested Users */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested for You</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      username: 'chef_maria',
                      displayName: 'Chef Maria',
                      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
                      bio: 'Professional chef sharing healthy recipes 👩‍🍳',
                      followers: 45623,
                      isVerified: true,
                      commonInterests: ['healthy-cooking', 'meal-prep']
                    },
                    {
                      id: '2',
                      username: 'fitness_coach',
                      displayName: 'David Kim',
                      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
                      bio: 'Fitness coach & nutrition expert 💪',
                      followers: 23456,
                      isVerified: false,
                      commonInterests: ['protein', 'fitness']
                    }
                  ].map((user) => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{user.displayName}</h4>
                            {user.isVerified && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                          </div>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                          <p className="text-xs text-gray-500">{user.followers.toLocaleString()} followers</p>
                          {user.commonInterests && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {user.commonInterests.map((interest) => (
                                <span key={interest} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                  #{interest}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};