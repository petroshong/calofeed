import type { User, Meal, WeightEntry } from '../types';
import { NUTRITION_GOALS } from './constants';

export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  // Mifflin-St Jeor Equation
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? bmr + 5 : bmr - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
};

export const calculateMacroGoals = (calories: number, ratio: 'balanced' | 'low_carb' | 'high_protein' | 'mediterranean' = 'balanced') => {
  const ratios = NUTRITION_GOALS.MACRO_RATIOS[ratio];
  return {
    protein: Math.round((calories * ratios.protein) / 4), // 4 cal per gram
    carbs: Math.round((calories * ratios.carbs) / 4), // 4 cal per gram
    fat: Math.round((calories * ratios.fat) / 9) // 9 cal per gram
  };
};

export const calculateStreak = (meals: Meal[]): number => {
  if (meals.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Sort meals by date descending
  const sortedMeals = meals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  for (let i = 0; i < 365; i++) { // Check up to a year
    const dateStr = currentDate.toDateString();
    const hasLoggedToday = sortedMeals.some(meal => 
      new Date(meal.timestamp).toDateString() === dateStr
    );
    
    if (hasLoggedToday) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}m ago`;
  }
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  }
  if (diffInHours < 48) {
    return 'Yesterday';
  }
  if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
  
  return d.toLocaleDateString();
};

export const calculateWeightProgress = (entries: WeightEntry[], goalWeight: number) => {
  if (entries.length < 2) return { trend: 'stable', rate: 0, eta: null };
  
  const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sortedEntries[sortedEntries.length - 1];
  const previous = sortedEntries[sortedEntries.length - 2];
  
  const weightChange = latest.weight - previous.weight;
  const daysDiff = (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24);
  const ratePerWeek = (weightChange / daysDiff) * 7;
  
  const trend = weightChange > 0.1 ? 'gaining' : weightChange < -0.1 ? 'losing' : 'stable';
  
  let eta = null;
  if (Math.abs(ratePerWeek) > 0.1) {
    const remainingWeight = goalWeight - latest.weight;
    const weeksToGoal = Math.abs(remainingWeight / ratePerWeek);
    eta = new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000);
  }
  
  return { trend, rate: Math.abs(ratePerWeek), eta };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const generateUsername = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15) + Math.floor(Math.random() * 1000);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};