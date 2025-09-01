import { supabase } from '../lib/supabase';
import { handleError } from '../utils/errorHandler';
import type { User } from '../types';

export class AuthService {
  static async signUp(email: string, password: string, userData: {
    username: string;
    displayName: string;
    bio?: string;
  }) {
    try {
      // Check if username is available first
      const usernameAvailable = await this.checkUsernameAvailability(userData.username);
      if (!usernameAvailable) {
        throw new Error('Username is already taken');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            display_name: userData.displayName,
            bio: userData.bio || ''
          }
        }
      });

      if (error) throw error;

      // Create profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: userData.username,
            display_name: userData.displayName,
            bio: userData.bio || '',
            avatar_url: `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
            privacy_settings: {
              profileVisibility: 'public',
              mealVisibility: 'public',
              showWeight: true,
              showGoals: true,
              allowMessages: true,
              showOnLeaderboard: true,
              allowTagging: true,
              allowSharing: true,
              showActivity: true,
              allowStoryViews: true
            },
            notification_settings: {
              likes: true,
              comments: true,
              follows: true,
              challenges: true,
              achievements: true,
              reminders: true,
              groups: true,
              mentions: true,
              shares: true,
              stories: true,
              email: true,
              push: true
            }
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here, as the user account was created successfully (or in demo mode)
        }
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw handleError(error);
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw handleError(error);
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw handleError(error);
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return this.transformProfileToUser(profile, user.email || '');
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, username is available
        return true;
      }
      
      return false; // Username exists or other error
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  static transformProfileToUser(profile: any, email: string): User {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      email,
      avatar: profile.avatar_url || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      bio: profile.bio || '',
      coverImage: profile.cover_image_url,
      isFollowing: false,
      isPrivate: profile.is_private || false,
      followers: 0, // Will be calculated from follows table
      following: 0, // Will be calculated from follows table
      mealsLogged: 0, // Will be calculated from meals table
      streak: profile.streak || 0,
      badges: [], // Will be fetched from user_badges
      totalLikes: 0, // Will be calculated
      totalComments: 0, // Will be calculated
      rank: 0, // Will be calculated
      level: profile.level || 1,
      xp: profile.xp || 0,
      socialScore: 0, // Will be calculated
      dailyCalorieGoal: profile.daily_calorie_goal || 2000,
      dailyProteinGoal: profile.daily_protein_goal || 150,
      dailyCarbGoal: profile.daily_carb_goal || 250,
      dailyFatGoal: profile.daily_fat_goal || 67,
      caloriesConsumed: 0, // Will be calculated from today's entries
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      currentWeight: profile.current_weight,
      goalWeight: profile.goal_weight,
      height: profile.height,
      age: profile.age,
      activityLevel: profile.activity_level || 'moderate',
      dietaryPreferences: profile.dietary_preferences || [],
      allergies: profile.allergies || [],
      joinedDate: profile.created_at,
      location: profile.location,
      website: profile.website,
      socialLinks: profile.social_links || {},
      isVerified: profile.is_verified || false,
      isPremium: profile.is_premium || false,
      isInfluencer: profile.is_influencer || false,
      privacySettings: profile.privacy_settings || {
        profileVisibility: 'public',
        mealVisibility: 'public',
        showWeight: true,
        showGoals: true,
        allowMessages: true,
        showOnLeaderboard: true,
        allowTagging: true,
        allowSharing: true,
        showActivity: true,
        allowStoryViews: true
      },
      notificationSettings: profile.notification_settings || {
        likes: true,
        comments: true,
        follows: true,
        challenges: true,
        achievements: true,
        reminders: true,
        groups: true,
        mentions: true,
        shares: true,
        stories: true,
        email: true,
        push: true
      }
    };
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.displayName,
        bio: updates.bio,
        location: updates.location,
        website: updates.website,
        social_links: updates.socialLinks,
        dietary_preferences: updates.dietaryPreferences,
        allergies: updates.allergies,
        activity_level: updates.activityLevel,
        daily_calorie_goal: updates.dailyCalorieGoal,
        daily_protein_goal: updates.dailyProteinGoal,
        daily_carb_goal: updates.dailyCarbGoal,
        daily_fat_goal: updates.dailyFatGoal,
        current_weight: updates.currentWeight,
        goal_weight: updates.goalWeight,
        height: updates.height,
        age: updates.age,
        is_private: updates.isPrivate,
        privacy_settings: updates.privacySettings,
        notification_settings: updates.notificationSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw handleError(error);
  }
}