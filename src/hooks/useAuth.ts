import { useState, useEffect } from 'react';
import type { User } from '../App';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication for demo purposes
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      username: 'fitnessfoodie',
      displayName: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: 'Fitness enthusiast & food lover 🏋️‍♀️🥗 Sharing my healthy journey one meal at a time!',
      isFollowing: false,
      followers: 1234,
      following: 567,
      mealsLogged: 89,
      streak: 12,
      badges: ['🔥', '💪', '🥗', '⭐'],
      dailyCalorieGoal: 2200,
      dailyProteinGoal: 150,
      caloriesConsumed: 1650,
      proteinConsumed: 112
    };

    // Simulate authentication delay
    setTimeout(() => {
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
    }, 1000);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login logic
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    logout
  };
};