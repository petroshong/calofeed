import { useState, useEffect } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication for demo purposes
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      username: 'fitnessfoodie',
      displayName: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: 'Fitness enthusiast & food lover 🏋️‍♀️🥗 Sharing my healthy journey one meal at a time!',
      isFollowing: false,
      followers: 1234,
      following: 567,
      mealsLogged: 89,
      streak: 12,
      badges: [
        { id: '1', name: 'Streak Master', emoji: '🔥', description: '7-day logging streak', earnedDate: '2024-01-15', category: 'streak' },
        { id: '2', name: 'Protein Pro', emoji: '💪', description: 'Hit protein goal 30 days', earnedDate: '2024-01-10', category: 'nutrition' },
        { id: '3', name: 'Veggie Lover', emoji: '🥗', description: 'Logged 100 vegetable servings', earnedDate: '2024-01-05', category: 'nutrition' },
        { id: '4', name: 'Community Star', emoji: '⭐', description: '100 likes received', earnedDate: '2024-01-01', category: 'social' }
      ],
      dailyCalorieGoal: 2200,
      dailyProteinGoal: 150,
      dailyCarbGoal: 275,
      dailyFatGoal: 73,
      caloriesConsumed: 1650,
      proteinConsumed: 112,
      carbsConsumed: 180,
      fatConsumed: 45,
      currentWeight: 165,
      goalWeight: 160,
      height: 170,
      age: 28,
      activityLevel: 'moderate',
      dietaryPreferences: ['vegetarian', 'low-carb'],
      allergies: ['nuts'],
      joinedDate: '2023-06-15',
      location: 'San Francisco, CA',
      website: 'alexfitness.com',
      isVerified: true,
      isPremium: true,
      privacySettings: {
        profileVisibility: 'public',
        mealVisibility: 'public',
        showWeight: true,
        showGoals: true,
        allowMessages: true,
        showOnLeaderboard: true
      },
      notificationSettings: {
        likes: true,
        comments: true,
        follows: true,
        challenges: true,
        achievements: true,
        reminders: true,
        groups: true,
        email: true,
        push: true
      }
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