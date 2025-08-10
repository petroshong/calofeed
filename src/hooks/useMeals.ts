import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Meal, User } from '../types';

export const useMeals = (currentUser: User) => {
  const [meals, setMeals] = useLocalStorage<Meal[]>('user_meals', []);

  const addMeal = (mealData: {
    image: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    location?: string;
    tags: string[];
    visibility: 'public' | 'friends' | 'private';
  }) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      ...mealData,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      isLiked: false,
      isBookmarked: false,
      shares: 0,
      views: 0
    };

    setMeals(prev => [newMeal, ...prev]);
    return newMeal;
  };

  const deleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const updateMeal = (mealId: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId ? { ...meal, ...updates } : meal
    ));
  };

  const getUserMeals = (userId: string) => {
    return meals.filter(meal => meal.userId === userId);
  };

  const getPublicMeals = () => {
    return meals.filter(meal => meal.visibility === 'public');
  };

  const toggleLike = (mealId: string) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { 
            ...meal, 
            isLiked: !meal.isLiked,
            likes: meal.isLiked ? meal.likes - 1 : meal.likes + 1
          }
        : meal
    ));
  };

  const toggleBookmark = (mealId: string) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { ...meal, isBookmarked: !meal.isBookmarked }
        : meal
    ));
  };

  return {
    meals,
    addMeal,
    deleteMeal,
    updateMeal,
    getUserMeals,
    getPublicMeals,
    toggleLike,
    toggleBookmark
  };
};