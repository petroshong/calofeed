import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { User } from '../types';

export const useFollowing = (currentUser: User) => {
  const [followingList, setFollowingList] = useLocalStorage<string[]>('user_following', []);
  const [followersList, setFollowersList] = useLocalStorage<string[]>('user_followers', []);

  const followUser = (userId: string) => {
    if (!followingList.includes(userId)) {
      setFollowingList(prev => [...prev, userId]);
      // In a real app, this would also update the followed user's followers list
      console.log(`Now following user ${userId}`);
      return true;
    }
    return false;
  };

  const unfollowUser = (userId: string) => {
    setFollowingList(prev => prev.filter(id => id !== userId));
    console.log(`Unfollowed user ${userId}`);
  };

  const isFollowing = (userId: string) => {
    return followingList.includes(userId);
  };

  const getFollowingCount = () => {
    return followingList.length;
  };

  const getFollowersCount = () => {
    return followersList.length;
  };

  const addFollower = (userId: string) => {
    if (!followersList.includes(userId)) {
      setFollowersList(prev => [...prev, userId]);
    }
  };

  const removeFollower = (userId: string) => {
    setFollowersList(prev => prev.filter(id => id !== userId));
  };

  return {
    followingList,
    followersList,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowingCount,
    getFollowersCount,
    addFollower,
    removeFollower
  };
};