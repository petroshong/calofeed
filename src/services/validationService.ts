import { z } from 'zod';

// User validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional()
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Meal validation schemas
export const mealSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  calories: z.number()
    .min(1, 'Calories must be at least 1')
    .max(5000, 'Calories must be less than 5000'),
  protein: z.number()
    .min(0, 'Protein cannot be negative')
    .max(500, 'Protein must be less than 500g'),
  carbs: z.number()
    .min(0, 'Carbs cannot be negative')
    .max(1000, 'Carbs must be less than 1000g'),
  fat: z.number()
    .min(0, 'Fat cannot be negative')
    .max(500, 'Fat must be less than 500g'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  tags: z.array(z.string().max(30, 'Tag must be less than 30 characters')).max(10, 'Maximum 10 tags allowed'),
  visibility: z.enum(['public', 'friends', 'private'])
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  bio: z.string().max(160, 'Bio must be less than 160 characters'),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  currentWeight: z.number().min(50).max(1000).optional(),
  goalWeight: z.number().min(50).max(1000).optional(),
  height: z.number().min(100).max(300).optional(),
  age: z.number().min(13).max(120).optional(),
  dailyCalorieGoal: z.number().min(800).max(5000),
  dailyProteinGoal: z.number().min(20).max(500),
  dailyCarbGoal: z.number().min(20).max(1000),
  dailyFatGoal: z.number().min(10).max(500)
});

// Comment validation
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters')
});

// Weight entry validation
export const weightEntrySchema = z.object({
  weight: z.number().min(50, 'Weight must be at least 50 lbs').max(1000, 'Weight must be less than 1000 lbs'),
  bodyFat: z.number().min(1).max(50).optional(),
  muscleMass: z.number().min(50).max(500).optional(),
  mood: z.enum(['great', 'good', 'neutral', 'tired', 'stressed']).optional(),
  note: z.string().max(200, 'Note must be less than 200 characters').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
});

// Validation helper functions
export class ValidationService {
  static validateSignUp(data: any) {
    return signUpSchema.safeParse(data);
  }

  static validateSignIn(data: any) {
    return signInSchema.safeParse(data);
  }

  static validateMeal(data: any) {
    return mealSchema.safeParse(data);
  }

  static validateProfileUpdate(data: any) {
    return profileUpdateSchema.safeParse(data);
  }

  static validateComment(data: any) {
    return commentSchema.safeParse(data);
  }

  static validateWeightEntry(data: any) {
    return weightEntrySchema.safeParse(data);
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'Image must be less than 10MB' };
    }

    return { isValid: true };
  }
}