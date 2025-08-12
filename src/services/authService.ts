import { supabase } from '../lib/supabase';
import type { User } from '../types';

export class AuthService {
  static async signUp(email: string, password: string, userData: {
    username: string;
    displayName: string;
    bio?: string;
  }) {
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

      if (profileError) throw profileError;
    }

    return data;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return this.transformProfileToUser(profile, user.email || '');
  }

  static transformProfileToUser(profile: any, email: string): User {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      email,
      avatar: profile.avatar_url || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      bio: profile.bio,
      coverImage: profile.cover_image_url,
      isFollowing: false,
      isPrivate: profile.is_private,
      followers: 0, // Will be calculated from follows table
      following: 0, // Will be calculated from follows table
      mealsLogged: 0, // Will be calculated from meals table
      streak: profile.streak,
      badges: [], // Will be fetched from user_badges
      totalLikes: 0, // Will be calculated
      totalComments: 0, // Will be calculated
      rank: 0, // Will be calculated
      level: profile.level,
      xp: profile.xp,
      socialScore: 0, // Will be calculated
      dailyCalorieGoal: profile.daily_calorie_goal,
      dailyProteinGoal: profile.daily_protein_goal,
      dailyCarbGoal: profile.daily_carb_goal,
      dailyFatGoal: profile.daily_fat_goal,
      caloriesConsumed: 0, // Will be calculated from today's entries
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      currentWeight: profile.current_weight,
      goalWeight: profile.goal_weight,
      height: profile.height,
      age: profile.age,
      activityLevel: profile.activity_level as any,
      dietaryPreferences: profile.dietary_preferences,
      allergies: profile.allergies,
      joinedDate: profile.created_at,
      location: profile.location,
      website: profile.website,
      socialLinks: profile.social_links,
      isVerified: profile.is_verified,
      isPremium: profile.is_premium,
      isInfluencer: profile.is_influencer,
      privacySettings: profile.privacy_settings,
      notificationSettings: profile.notification_settings
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

    if (error) throw error;
  }
}