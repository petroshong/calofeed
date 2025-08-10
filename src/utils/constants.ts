export const APP_CONFIG = {
  name: 'EatSocial',
  version: '1.0.0',
  description: 'Social Food & Calorie Tracker',
  author: 'EatSocial Team',
  website: 'https://eatsocial.app'
};

export const NUTRITION_GOALS = {
  CALORIE_RANGES: {
    sedentary: { min: 1200, max: 2000 },
    light: { min: 1400, max: 2200 },
    moderate: { min: 1600, max: 2400 },
    active: { min: 1800, max: 2600 },
    very_active: { min: 2000, max: 2800 }
  },
  PROTEIN_PER_KG: {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6
  },
  MACRO_RATIOS: {
    balanced: { carbs: 0.45, protein: 0.25, fat: 0.30 },
    low_carb: { carbs: 0.20, protein: 0.35, fat: 0.45 },
    high_protein: { carbs: 0.35, protein: 0.40, fat: 0.25 },
    mediterranean: { carbs: 0.50, protein: 0.20, fat: 0.30 }
  }
};

export const MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast', emoji: '🌅' },
  { id: 'lunch', name: 'Lunch', emoji: '☀️' },
  { id: 'dinner', name: 'Dinner', emoji: '🌙' },
  { id: 'snack', name: 'Snack', emoji: '🍎' }
];

export const DIETARY_PREFERENCES = [
  'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 
  'mediterranean', 'low-carb', 'high-protein', 'gluten-free', 'dairy-free'
];

export const COMMON_ALLERGIES = [
  'nuts', 'shellfish', 'eggs', 'dairy', 'soy', 'wheat', 'fish', 'sesame'
];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', name: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', name: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { id: 'moderate', name: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { id: 'active', name: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { id: 'very_active', name: 'Extremely Active', description: 'Very hard exercise, physical job' }
];

export const BADGE_CATEGORIES = [
  { id: 'streak', name: 'Streak', color: 'orange' },
  { id: 'nutrition', name: 'Nutrition', color: 'green' },
  { id: 'social', name: 'Social', color: 'blue' },
  { id: 'challenge', name: 'Challenge', color: 'purple' },
  { id: 'milestone', name: 'Milestone', color: 'yellow' }
];

export const CHALLENGE_CATEGORIES = [
  { id: 'nutrition', name: 'Nutrition', icon: '🥗', color: 'green' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: 'orange' },
  { id: 'social', name: 'Social', icon: '👥', color: 'blue' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', color: 'purple' }
];

export const API_ENDPOINTS = {
  NUTRITIONIX: 'https://trackapi.nutritionix.com/v2',
  USDA: 'https://api.nal.usda.gov/fdc/v1'
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'eatsocial_user_preferences',
  RECENT_SEARCHES: 'eatsocial_recent_searches',
  OFFLINE_DATA: 'eatsocial_offline_data'
};