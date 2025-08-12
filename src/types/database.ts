export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          bio?: string;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Record<string, any>;
          dietary_preferences?: string[];
          allergies?: string[];
          activity_level?: string;
          daily_calorie_goal?: number;
          daily_protein_goal?: number;
          daily_carb_goal?: number;
          daily_fat_goal?: number;
          current_weight?: number | null;
          goal_weight?: number | null;
          height?: number | null;
          age?: number | null;
          is_private?: boolean;
          is_verified?: boolean;
          is_premium?: boolean;
          is_influencer?: boolean;
          level?: number;
          xp?: number;
          streak?: number;
          privacy_settings?: Record<string, any>;
          notification_settings?: Record<string, any>;
        };
        Update: {
          username?: string;
          display_name?: string;
          bio?: string;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          location?: string | null;
          website?: string | null;
          social_links?: Record<string, any>;
          dietary_preferences?: string[];
          allergies?: string[];
          activity_level?: string;
          daily_calorie_goal?: number;
          daily_protein_goal?: number;
          daily_carb_goal?: number;
          daily_fat_goal?: number;
          current_weight?: number | null;
          goal_weight?: number | null;
          height?: number | null;
          age?: number | null;
          is_private?: boolean;
          is_verified?: boolean;
          is_premium?: boolean;
          is_influencer?: boolean;
          level?: number;
          xp?: number;
          streak?: number;
          privacy_settings?: Record<string, any>;
          notification_settings?: Record<string, any>;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          description: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          fiber: number | null;
          sugar: number | null;
          sodium: number | null;
          meal_type: string;
          location: string | null;
          restaurant: string | null;
          tags: string[];
          visibility: string;
          is_featured: boolean;
          mood: string | null;
          difficulty: string | null;
          prep_time: number | null;
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          image_url: string;
          description: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          meal_type: string;
          location?: string | null;
          restaurant?: string | null;
          tags?: string[];
          visibility?: string;
          is_featured?: boolean;
          mood?: string | null;
          difficulty?: string | null;
          prep_time?: number | null;
          rating?: number | null;
        };
        Update: {
          image_url?: string;
          description?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          meal_type?: string;
          location?: string | null;
          restaurant?: string | null;
          tags?: string[];
          visibility?: string;
          is_featured?: boolean;
          mood?: string | null;
          difficulty?: string | null;
          prep_time?: number | null;
          rating?: number | null;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          meal_id: string;
          user_id: string;
          content: string;
          mentions: string[];
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          meal_id: string;
          user_id: string;
          content: string;
          mentions?: string[];
          is_edited?: boolean;
        };
        Update: {
          content?: string;
          mentions?: string[];
          is_edited?: boolean;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string | null;
          comment_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          meal_id?: string | null;
          comment_id?: string | null;
        };
        Update: {};
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          is_close: boolean;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          is_close?: boolean;
        };
        Update: {
          is_close?: boolean;
        };
      };
      friend_requests: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          from_user_id: string;
          to_user_id: string;
          message?: string | null;
          status?: string;
        };
        Update: {
          status?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Record<string, any>;
          is_read: boolean;
          priority: string;
          category: string;
          action_url: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: Record<string, any>;
          is_read?: boolean;
          priority?: string;
          category?: string;
          action_url?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          is_read?: boolean;
        };
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          body_fat: number | null;
          muscle_mass: number | null;
          mood: string | null;
          note: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          weight: number;
          body_fat?: number | null;
          muscle_mass?: number | null;
          mood?: string | null;
          note?: string | null;
          date: string;
        };
        Update: {
          weight?: number;
          body_fat?: number | null;
          muscle_mass?: number | null;
          mood?: string | null;
          note?: string | null;
          date?: string;
        };
      };
      calorie_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          meal_type: string;
          source: string;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          meal_type: string;
          source?: string;
          confidence?: number | null;
        };
        Update: {
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          meal_type?: string;
          source?: string;
          confidence?: number | null;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          rating: number | null;
          check_in_count: number;
          created_at: string;
        };
        Insert: {
          name: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          rating?: number | null;
          check_in_count?: number;
        };
        Update: {
          name?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          rating?: number | null;
          check_in_count?: number;
        };
      };
      location_checkins: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          meal_id: string | null;
          rating: number | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          location_id: string;
          meal_id?: string | null;
          rating?: number | null;
          note?: string | null;
        };
        Update: {
          rating?: number | null;
          note?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}