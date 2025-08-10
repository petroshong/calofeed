export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  isFollowing: boolean;
  followers: number;
  following: number;
  mealsLogged: number;
  streak: number;
  badges: Badge[];
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number;
  dailyFatGoal: number;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  currentWeight?: number;
  goalWeight?: number;
  height?: number;
  age?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryPreferences: string[];
  allergies: string[];
  joinedDate: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isPremium: boolean;
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedDate: string;
  category: 'streak' | 'nutrition' | 'social' | 'challenge' | 'milestone';
}

export interface Meal {
  id: string;
  userId: string;
  user: User;
  image: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  location?: string;
  restaurant?: string;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  recipe?: Recipe;
  visibility: 'public' | 'friends' | 'private';
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'total' | 'daily' | 'social';
  target: number;
  participants: number;
  startDate: string;
  endDate: string;
  progress?: number;
  isJoined: boolean;
  reward: string;
  category: 'nutrition' | 'fitness' | 'social' | 'lifestyle';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rules: string[];
  prize?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  memberCount: number;
  isJoined: boolean;
  isPrivate: boolean;
  category: string;
  tags: string[];
  createdBy: string;
  createdDate: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'challenge' | 'achievement' | 'reminder' | 'group';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
  data?: any;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  mealVisibility: 'public' | 'friends' | 'private';
  showWeight: boolean;
  showGoals: boolean;
  allowMessages: boolean;
  showOnLeaderboard: boolean;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  challenges: boolean;
  achievements: boolean;
  reminders: boolean;
  groups: boolean;
  email: boolean;
  push: boolean;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  note?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  servingUnit: string;
  barcode?: string;
  verified: boolean;
}