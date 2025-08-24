import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { User, CalorieEntry } from '../types';

interface MonthlyStats {
  month: string;
  year: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysLogged: number;
  goalsHit: number;
  totalGoals: number;
  goalPercentage: number;
  streakDays: number;
  weightChange?: number;
  entries: CalorieEntry[];
}

interface WeeklyStats {
  week: string;
  startDate: string;
  endDate: string;
  totalCalories: number;
  avgCalories: number;
  daysLogged: number;
  goalsHit: number;
  goalPercentage: number;
}

export const useMonthlyProgress = (user: User) => {
  const [calorieEntries, setCalorieEntries] = useLocalStorage<CalorieEntry[]>('calorie_entries', []);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);

  // Calculate monthly statistics
  useEffect(() => {
    if (!user || calorieEntries.length === 0) return;

    const monthlyData = new Map<string, CalorieEntry[]>();
    
    // Group entries by month
    calorieEntries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)!.push(entry);
    });

    // Calculate stats for each month
    const stats: MonthlyStats[] = Array.from(monthlyData.entries()).map(([monthKey, entries]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' });
      
      const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
      const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
      const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
      const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);
      
      // Get unique days logged
      const uniqueDays = new Set(entries.map(entry => entry.date)).size;
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      
      // Calculate goals hit
      const dailyTotals = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
      entries.forEach(entry => {
        const date = entry.date;
        if (!dailyTotals.has(date)) {
          dailyTotals.set(date, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        }
        const daily = dailyTotals.get(date)!;
        daily.calories += entry.calories;
        daily.protein += entry.protein;
        daily.carbs += entry.carbs;
        daily.fat += entry.fat;
      });

      let goalsHit = 0;
      dailyTotals.forEach(daily => {
        const calorieGoalHit = Math.abs(daily.calories - user.dailyCalorieGoal) <= (user.dailyCalorieGoal * 0.1);
        const proteinGoalHit = daily.protein >= user.dailyProteinGoal * 0.8;
        if (calorieGoalHit && proteinGoalHit) goalsHit++;
      });

      return {
        month: monthName,
        year: parseInt(year),
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        avgCalories: Math.round(totalCalories / uniqueDays),
        avgProtein: Math.round(totalProtein / uniqueDays),
        avgCarbs: Math.round(totalCarbs / uniqueDays),
        avgFat: Math.round(totalFat / uniqueDays),
        daysLogged: uniqueDays,
        goalsHit,
        totalGoals: uniqueDays,
        goalPercentage: Math.round((goalsHit / uniqueDays) * 100),
        streakDays: calculateMonthlyStreak(entries),
        entries
      };
    }).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return new Date(`${a.month} 1, ${a.year}`).getMonth() - new Date(`${b.month} 1, ${b.year}`).getMonth();
    });

    setMonthlyStats(stats);
  }, [calorieEntries, user]);

  // Calculate weekly statistics
  useEffect(() => {
    if (!user || calorieEntries.length === 0) return;

    const weeklyData: WeeklyStats[] = [];
    const today = new Date();
    
    // Get last 12 weeks
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekEntries = calorieEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });

      if (weekEntries.length > 0) {
        const totalCalories = weekEntries.reduce((sum, entry) => sum + entry.calories, 0);
        const uniqueDays = new Set(weekEntries.map(entry => entry.date)).size;
        
        // Calculate daily goals hit
        const dailyTotals = new Map<string, number>();
        weekEntries.forEach(entry => {
          const date = entry.date;
          dailyTotals.set(date, (dailyTotals.get(date) || 0) + entry.calories);
        });

        let goalsHit = 0;
        dailyTotals.forEach(dailyCalories => {
          if (Math.abs(dailyCalories - user.dailyCalorieGoal) <= (user.dailyCalorieGoal * 0.1)) {
            goalsHit++;
          }
        });

        weeklyData.push({
          week: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          startDate: weekStart.toISOString(),
          endDate: weekEnd.toISOString(),
          totalCalories,
          avgCalories: Math.round(totalCalories / uniqueDays),
          daysLogged: uniqueDays,
          goalsHit,
          goalPercentage: Math.round((goalsHit / uniqueDays) * 100)
        });
      }
    }

    setWeeklyStats(weeklyData.reverse());
  }, [calorieEntries, user]);

  const calculateMonthlyStreak = (entries: CalorieEntry[]): number => {
    if (entries.length === 0) return 0;
    
    const sortedDates = [...new Set(entries.map(e => e.date))].sort();
    let streak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        streak = Math.max(streak, currentStreak);
        currentStreak = 1;
      }
    }
    
    return Math.max(streak, currentStreak);
  };

  const getCurrentMonthStats = (): MonthlyStats | null => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    return monthlyStats.find(stat => 
      stat.month === currentMonth && stat.year === currentYear
    ) || null;
  };

  const getGoalTrends = () => {
    if (monthlyStats.length < 2) return { trend: 'stable', change: 0 };
    
    const current = monthlyStats[0];
    const previous = monthlyStats[1];
    
    const change = current.goalPercentage - previous.goalPercentage;
    
    return {
      trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
      change: Math.abs(change)
    };
  };

  const getCalorieConsistency = () => {
    if (calorieEntries.length === 0) return 0;
    
    const last30Days = calorieEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    if (last30Days.length === 0) return 0;

    const dailyTotals = new Map<string, number>();
    last30Days.forEach(entry => {
      const date = entry.date;
      dailyTotals.set(date, (dailyTotals.get(date) || 0) + entry.calories);
    });

    const dailyCalories = Array.from(dailyTotals.values());
    const avg = dailyCalories.reduce((sum, cal) => sum + cal, 0) / dailyCalories.length;
    const variance = dailyCalories.reduce((sum, cal) => sum + Math.pow(cal - avg, 2), 0) / dailyCalories.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    const consistencyScore = Math.max(0, 100 - (stdDev / avg) * 100);
    return Math.round(consistencyScore);
  };

  const addCalorieEntry = (entry: Omit<CalorieEntry, 'id' | 'userId' | 'date'>) => {
    const newEntry: CalorieEntry = {
      ...entry,
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString().split('T')[0]
    };
    setCalorieEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  return {
    monthlyStats,
    weeklyStats,
    getCurrentMonthStats,
    getGoalTrends,
    getCalorieConsistency,
    addCalorieEntry
  };
};