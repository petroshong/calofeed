import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FriendRequest, User } from '../types';

export const useFriendRequests = (currentUser: User) => {
  const [friendRequests, setFriendRequests] = useLocalStorage<FriendRequest[]>('friend_requests', []);

  const sendFriendRequest = (toUser: User, message?: string) => {
    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: toUser.id,
      fromUser: currentUser,
      toUser: toUser,
      timestamp: new Date().toISOString(),
      status: 'pending',
      message
    };

    setFriendRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const acceptFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'accepted' as const }
        : request
    ));
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'declined' as const }
        : request
    ));
  };

  const cancelFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(request => request.id !== requestId));
  };

  const getIncomingRequests = () => {
    return friendRequests.filter(request => 
      request.toUserId === currentUser.id && request.status === 'pending'
    );
  };

  const getOutgoingRequests = () => {
    return friendRequests.filter(request => 
      request.fromUserId === currentUser.id && request.status === 'pending'
    );
  };

  const hasPendingRequest = (userId: string) => {
    return friendRequests.some(request => 
      ((request.fromUserId === currentUser.id && request.toUserId === userId) ||
       (request.fromUserId === userId && request.toUserId === currentUser.id)) &&
      request.status === 'pending'
    );
  };

  const areFriends = (userId: string) => {
    return friendRequests.some(request => 
      ((request.fromUserId === currentUser.id && request.toUserId === userId) ||
       (request.fromUserId === userId && request.toUserId === currentUser.id)) &&
      request.status === 'accepted'
    );
  };

  return {
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    getIncomingRequests,
    getOutgoingRequests,
    hasPendingRequest,
    areFriends
  };
};