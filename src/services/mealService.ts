import { supabase } from '../lib/supabase';
import type { Meal, User } from '../types';

export class MealService {
  static async createMeal(mealData: {
    imageUrl: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    location?: string;
    tags: string[];
    visibility: string;
  }) {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id!,
        image_url: mealData.imageUrl,
        description: mealData.description,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        meal_type: mealData.mealType,
        location: mealData.location,
        tags: mealData.tags,
        visibility: mealData.visibility
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFeedMeals(userId: string, filter: 'all' | 'following' | 'trending' = 'all') {
    let query = supabase
      .from('meals')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          display_name,
          avatar_url,
          is_verified,
          is_premium,
          is_influencer,
          is_private
        ),
        likes:likes(count),
        comments:comments(count)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (filter === 'following') {
      // Get users that current user follows
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

      const followingIds = following?.map(f => f.following_id) || [];
      followingIds.push(userId); // Include own meals

      query = query.in('user_id', followingIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(meal => this.transformMealData(meal)) || [];
  }

  static async getUserMeals(userId: string) {
    const { data, error } = await supabase
      .from('meals')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          display_name,
          avatar_url,
          is_verified,
          is_premium,
          is_influencer
        ),
        likes:likes(count),
        comments:comments(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(meal => this.transformMealData(meal)) || [];
  }

  static async likeMeal(mealId: string, userId: string) {
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        meal_id: mealId
      });

    if (error) throw error;
  }

  static async unlikeMeal(mealId: string, userId: string) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('meal_id', mealId);

    if (error) throw error;
  }

  static async deleteMeal(mealId: string, userId: string) {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  private static transformMealData(mealData: any): Meal {
    return {
      id: mealData.id,
      userId: mealData.user_id,
      user: {
        id: mealData.profiles.id,
        username: mealData.profiles.username,
        displayName: mealData.profiles.display_name,
        avatar: mealData.profiles.avatar_url || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
        isVerified: mealData.profiles.is_verified,
        isPremium: mealData.profiles.is_premium,
        isInfluencer: mealData.profiles.is_influencer,
        isPrivate: mealData.profiles.is_private
      } as User,
      image: mealData.image_url,
      description: mealData.description,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
      fiber: mealData.fiber,
      sugar: mealData.sugar,
      sodium: mealData.sodium,
      location: mealData.location,
      restaurant: mealData.restaurant,
      timestamp: new Date(mealData.created_at).toLocaleString(),
      mealType: mealData.meal_type as any,
      likes: mealData.likes?.[0]?.count || 0,
      comments: [],
      isLiked: false, // Will be determined by separate query
      isBookmarked: false, // Will be implemented later
      shares: 0, // Will be implemented later
      views: Math.floor(Math.random() * 1000), // Mock for now
      tags: mealData.tags,
      visibility: mealData.visibility as any
    };
  }
}