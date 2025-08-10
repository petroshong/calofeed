import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { CalorieEntry, User } from '../types';

export const useCalorieTracking = (user: User) => {
  const [calorieEntries, setCalorieEntries] = useLocalStorage<CalorieEntry[]>('calorie_entries', []);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Calculate daily totals for today
  useEffect(() => {
    const today = new Date().toDateString();
    const todayEntries = calorieEntries.filter(entry => 
      new Date(entry.date).toDateString() === today
    );

    const totals = todayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setDailyTotals(totals);
  }, [calorieEntries]);

  const addCalorieEntry = (entry: Omit<CalorieEntry, 'id' | 'userId' | 'date'>) => {
    const newEntry: CalorieEntry = {
      ...entry,
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString()
    };
    setCalorieEntries(prev => [...prev, newEntry]);
    
    // Show success notification
    console.log(`Added ${entry.calories} calories to daily total`);
    return newEntry;
  };

  const updateCalorieEntry = (entryId: string, updates: Partial<CalorieEntry>) => {
    setCalorieEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, ...updates } : entry
    ));
  };

  const deleteCalorieEntry = (entryId: string) => {
    setCalorieEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const getEntriesForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return calorieEntries.filter(entry => 
      new Date(entry.date).toDateString() === targetDate
    );
  };

  const getWeeklyAverage = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekEntries = calorieEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    if (weekEntries.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const totals = weekEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const days = Math.min(7, new Set(weekEntries.map(e => new Date(e.date).toDateString())).size);
    
    return {
      calories: Math.round(totals.calories / days),
      protein: Math.round(totals.protein / days),
      carbs: Math.round(totals.carbs / days),
      fat: Math.round(totals.fat / days)
    };
  };

  const getGoalProgress = () => {
    return {
      calories: Math.round((dailyTotals.calories / user.dailyCalorieGoal) * 100),
      protein: Math.round((dailyTotals.protein / user.dailyProteinGoal) * 100),
      carbs: Math.round((dailyTotals.carbs / user.dailyCarbGoal) * 100),
      fat: Math.round((dailyTotals.fat / user.dailyFatGoal) * 100)
    };
  };

  return {
    calorieEntries,
    dailyTotals,
    addCalorieEntry,
    updateCalorieEntry,
    deleteCalorieEntry,
    getEntriesForDate,
    getWeeklyAverage,
    getGoalProgress
  };
};