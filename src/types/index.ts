export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  coverImage?: string;
  isFollowing: boolean;
  isPrivate: boolean;
  followRequestSent?: boolean;
  followRequestReceived?: boolean;
  followers: number;
  following: number;
  mealsLogged: number;
  streak: number;
  badges: Badge[];
  totalLikes: number;
  totalComments: number;
  rank: number;
  level: number;
  xp: number;
  socialScore: number;
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
  socialLinks?: SocialLinks;
  isVerified: boolean;
  isPremium: boolean;
  isInfluencer: boolean;
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  location: string | null;
  website: string | null;
  social_links: Record<string, any>;
  dietary_preferences: string[];
  allergies: string[];
  activity_level: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carb_goal: number;
  daily_fat_goal: number;
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  age: number | null;
  is_private: boolean;
  is_verified: boolean;
  is_premium: boolean;
  is_influencer: boolean;
  level: number;
  xp: number;
  streak: number;
  privacy_settings: Record<string, any>;
  notification_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedDate: string;
  category: 'streak' | 'nutrition' | 'social' | 'challenge' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Meal {
  id: string;
  userId: string;
  user: User;
  image: string;
  images?: string[];
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
  shares: number;
  views: number;
  tags: string[];
  recipe?: Recipe;
  visibility: 'public' | 'friends' | 'private';
  isSponsored?: boolean;
  sponsorBrand?: string;
  isFeatured?: boolean;
  mood?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  rating?: number;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  mentions?: string[];
  isEdited?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  image: string;
  text?: string;
  timestamp: string;
  expiresAt: string;
  views: number;
  isViewed: boolean;
  type: 'meal' | 'progress' | 'achievement' | 'workout';
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  timestamp: string;
  isClose?: boolean;
}

export interface Share {
  id: string;
  userId: string;
  mealId: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'whatsapp' | 'copy';
  timestamp: string;
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
  rating?: number;
  reviews?: number;
  author?: User;
  isVerified?: boolean;
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
  leaderboard?: ChallengeParticipant[];
  isSponsored?: boolean;
  sponsor?: string;
  hashtag?: string;
}

export interface ChallengeParticipant {
  userId: string;
  user: User;
  progress: number;
  rank: number;
  joinedDate: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage?: string;
  memberCount: number;
  isJoined: boolean;
  isPrivate: boolean;
  category: string;
  tags: string[];
  createdBy: string;
  createdDate: string;
  admins: string[];
  moderators: string[];
  rules: string[];
  recentActivity: string;
  weeklyPosts: number;
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
  priority: 'low' | 'medium' | 'high';
  category: 'social' | 'system' | 'achievement' | 'reminder';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  mealVisibility: 'public' | 'friends' | 'private';
  showWeight: boolean;
  showGoals: boolean;
  allowMessages: boolean;
  showOnLeaderboard: boolean;
  allowTagging: boolean;
  allowSharing: boolean;
  showActivity: boolean;
  allowStoryViews: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  challenges: boolean;
  achievements: boolean;
  reminders: boolean;
  groups: boolean;
  mentions: boolean;
  shares: boolean;
  stories: boolean;
  email: boolean;
  push: boolean;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  note?: string;
  bodyFat?: number;
  muscleMass?: number;
  mood?: string;
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
  popularity?: number;
  lastUsed?: string;
  userRating?: number;
  category?: string;
  confidence?: number;
  aiGenerated?: boolean;
}

export interface FoodAnalysis {
  id: string;
  imageUrl: string;
  detectedFoods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: number;
  processingTime: number;
  timestamp: string;
  isManuallyEdited: boolean;
}

export interface DetectedFood {
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  servingSize: string;
  quantity: number;
}

export interface CalorieEntry {
  id: string;
  userId: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  source: 'manual' | 'ai_analysis' | 'barcode' | 'recipe';
  confidence?: number;
}