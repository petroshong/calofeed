/*
  # Initial CaloFeed Database Schema

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `meals` - User meal posts with nutrition data
    - `comments` - Comments on meal posts
    - `likes` - Likes on meals and comments
    - `follows` - User follow relationships
    - `friend_requests` - Friend request system for private accounts
    - `notifications` - User notifications
    - `challenges` - Community challenges
    - `challenge_participants` - User participation in challenges
    - `groups` - Community groups
    - `group_members` - Group membership
    - `weight_entries` - User weight tracking
    - `calorie_entries` - Daily calorie tracking entries
    - `badges` - Achievement badges
    - `user_badges` - User earned badges
    - `stories` - User stories (24h content)
    - `hashtags` - Trending hashtags
    - `locations` - Check-in locations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure user data access
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  cover_image_url text,
  location text,
  website text,
  social_links jsonb DEFAULT '{}',
  dietary_preferences text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  activity_level text DEFAULT 'moderate',
  daily_calorie_goal integer DEFAULT 2000,
  daily_protein_goal integer DEFAULT 150,
  daily_carb_goal integer DEFAULT 250,
  daily_fat_goal integer DEFAULT 67,
  current_weight numeric,
  goal_weight numeric,
  height numeric,
  age integer,
  is_private boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  is_influencer boolean DEFAULT false,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  privacy_settings jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  fiber numeric,
  sugar numeric,
  sodium numeric,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  location text,
  restaurant text,
  tags text[] DEFAULT '{}',
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  is_featured boolean DEFAULT false,
  mood text,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time integer,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  mentions text[] DEFAULT '{}',
  is_edited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT likes_target_check CHECK (
    (meal_id IS NOT NULL AND comment_id IS NULL) OR 
    (meal_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, meal_id),
  UNIQUE(user_id, comment_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_close boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_user_id, to_user_id),
  CHECK (from_user_id != to_user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'challenge', 'achievement', 'reminder', 'group')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text DEFAULT 'social' CHECK (category IN ('social', 'system', 'achievement', 'reminder')),
  action_url text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('streak', 'total', 'daily', 'social')),
  target integer NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  reward text NOT NULL,
  category text NOT NULL CHECK (category IN ('nutrition', 'fitness', 'social', 'lifestyle')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  rules text[] DEFAULT '{}',
  prize text,
  hashtag text,
  is_sponsored boolean DEFAULT false,
  sponsor text,
  created_at timestamptz DEFAULT now()
);

-- Challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  avatar_url text,
  cover_image_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  is_private boolean DEFAULT false,
  rules text[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Group members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Weight entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight numeric NOT NULL,
  body_fat numeric,
  muscle_mass numeric,
  mood text,
  note text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Calorie entries table
CREATE TABLE IF NOT EXISTS calorie_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'ai_analysis', 'barcode', 'recipe')),
  confidence numeric,
  created_at timestamptz DEFAULT now()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('streak', 'nutrition', 'social', 'challenge', 'milestone')),
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  text_content text,
  type text NOT NULL CHECK (type IN ('meal', 'progress', 'achievement', 'workout')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Story views table
CREATE TABLE IF NOT EXISTS story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

-- Hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  usage_count integer DEFAULT 0,
  trending_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city text,
  state text,
  country text,
  latitude numeric,
  longitude numeric,
  rating numeric,
  check_in_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Location check-ins table
CREATE TABLE IF NOT EXISTS location_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  meal_id uuid REFERENCES meals(id) ON DELETE SET NULL,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  note text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE calorie_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view public profiles" ON profiles
  FOR SELECT USING (
    NOT is_private OR 
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM follows 
      WHERE follower_id = auth.uid() AND following_id = id
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Meals policies
CREATE POLICY "Users can view meals based on visibility" ON meals
  FOR SELECT USING (
    visibility = 'public' OR
    user_id = auth.uid() OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM follows 
      WHERE follower_id = auth.uid() AND following_id = user_id
    ))
  );

CREATE POLICY "Users can insert own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on visible meals" ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_id AND (
        meals.visibility = 'public' OR
        meals.user_id = auth.uid() OR
        (meals.visibility = 'friends' AND EXISTS (
          SELECT 1 FROM follows 
          WHERE follower_id = auth.uid() AND following_id = meals.user_id
        ))
      )
    )
  );

CREATE POLICY "Users can insert comments on visible meals" ON comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM meals 
      WHERE meals.id = meal_id AND (
        meals.visibility = 'public' OR
        meals.user_id = auth.uid() OR
        (meals.visibility = 'friends' AND EXISTS (
          SELECT 1 FROM follows 
          WHERE follower_id = auth.uid() AND following_id = meals.user_id
        ))
      )
    )
  );

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view all likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can insert own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Friend requests policies
CREATE POLICY "Users can view their friend requests" ON friend_requests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can insert friend requests" ON friend_requests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update friend requests they received" ON friend_requests
  FOR UPDATE USING (auth.uid() = to_user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Weight entries policies
CREATE POLICY "Users can manage own weight entries" ON weight_entries
  FOR ALL USING (auth.uid() = user_id);

-- Calorie entries policies
CREATE POLICY "Users can manage own calorie entries" ON calorie_entries
  FOR ALL USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view all user badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert user badges" ON user_badges FOR INSERT WITH CHECK (true);

-- Stories policies
CREATE POLICY "Users can view non-expired stories" ON stories
  FOR SELECT USING (expires_at > now());

CREATE POLICY "Users can insert own stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON stories
  FOR DELETE USING (auth.uid() = user_id);

-- Story views policies
CREATE POLICY "Users can view story views" ON story_views FOR SELECT USING (true);
CREATE POLICY "Users can insert story views" ON story_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- Public read policies for reference tables
CREATE POLICY "Anyone can view challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view hashtags" ON hashtags FOR SELECT USING (true);
CREATE POLICY "Anyone can view locations" ON locations FOR SELECT USING (true);

-- Challenge participants policies
CREATE POLICY "Users can view challenge participants" ON challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participation" ON challenge_participants FOR UPDATE USING (auth.uid() = user_id);

-- Groups policies
CREATE POLICY "Users can view public groups" ON groups
  FOR SELECT USING (
    NOT is_private OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Group members policies
CREATE POLICY "Users can view group members" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_id AND (
        NOT groups.is_private OR
        EXISTS (
          SELECT 1 FROM group_members gm2
          WHERE gm2.group_id = groups.id AND gm2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can join public groups" ON group_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_id AND NOT groups.is_private
    )
  );

-- Location check-ins policies
CREATE POLICY "Users can view all location check-ins" ON location_checkins FOR SELECT USING (true);
CREATE POLICY "Users can insert own check-ins" ON location_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updating counts and triggers
CREATE OR REPLACE FUNCTION update_hashtag_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update hashtag usage count when meals are inserted/updated
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Insert or update hashtag counts
    INSERT INTO hashtags (tag, usage_count)
    SELECT unnest(NEW.tags), 1
    ON CONFLICT (tag) 
    DO UPDATE SET 
      usage_count = hashtags.usage_count + 1,
      updated_at = now();
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    -- Decrease count for removed tags
    UPDATE hashtags 
    SET usage_count = GREATEST(0, usage_count - 1),
        updated_at = now()
    WHERE tag = ANY(OLD.tags);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hashtag_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON meals
  FOR EACH ROW EXECUTE FUNCTION update_hashtag_count();

-- Function to update location check-in count
CREATE OR REPLACE FUNCTION update_location_checkin_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE locations 
    SET check_in_count = check_in_count + 1
    WHERE id = NEW.location_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE locations 
    SET check_in_count = GREATEST(0, check_in_count - 1)
    WHERE id = OLD.location_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER location_checkin_count_trigger
  AFTER INSERT OR DELETE ON location_checkins
  FOR EACH ROW EXECUTE FUNCTION update_location_checkin_count();

-- Insert some initial data
INSERT INTO badges (name, emoji, description, category, rarity, criteria) VALUES
  ('First Meal', '🍽️', 'Logged your first meal', 'milestone', 'common', '{"meals_logged": 1}'),
  ('Streak Starter', '🔥', 'Maintained a 7-day logging streak', 'streak', 'common', '{"streak_days": 7}'),
  ('Protein Pro', '💪', 'Hit protein goal 30 days', 'nutrition', 'rare', '{"protein_goals_hit": 30}'),
  ('Social Butterfly', '🦋', 'Received 100 likes', 'social', 'rare', '{"total_likes": 100}'),
  ('Veggie Lover', '🥗', 'Logged 100 vegetable servings', 'nutrition', 'epic', '{"vegetable_servings": 100}'),
  ('Streak Master', '🏆', 'Maintained a 30-day streak', 'streak', 'epic', '{"streak_days": 30}'),
  ('Community Star', '⭐', 'Helped 50 users with comments', 'social', 'legendary', '{"helpful_comments": 50}');

INSERT INTO challenges (title, description, type, target, start_date, end_date, reward, category, difficulty, rules) VALUES
  ('7-Day Protein Challenge', 'Hit your daily protein goal for 7 consecutive days', 'streak', 7, now(), now() + interval '7 days', '🏆 Protein Master Badge', 'nutrition', 'intermediate', ARRAY['Log meals daily', 'Hit protein goal', 'No cheat days']),
  ('January Calorie Champions', 'Stay within your daily calorie goals for the entire month', 'daily', 31, '2024-01-01', '2024-01-31', '⭐ 500 XP + Special Badge', 'nutrition', 'advanced', ARRAY['Stay within calorie goals', 'Log all meals', 'Weekly check-ins']),
  ('Veggie Warrior Week', 'Include vegetables in every meal for one week', 'streak', 7, now(), now() + interval '7 days', '🥬 Veggie Master Title', 'nutrition', 'beginner', ARRAY['Include vegetables in every meal', 'Photo proof required']);

INSERT INTO locations (name, address, city, state, rating, check_in_count) VALUES
  ('Green Bowl Cafe', '123 Health St', 'San Francisco', 'CA', 4.8, 156),
  ('Protein Palace', '456 Fitness Ave', 'San Francisco', 'CA', 4.6, 89),
  ('Fresh & Fit', '789 Wellness Blvd', 'San Francisco', 'CA', 4.9, 67),
  ('Smoothie Central', '321 Energy Dr', 'San Francisco', 'CA', 4.7, 45),
  ('Macro Kitchen', '654 Nutrition Way', 'San Francisco', 'CA', 4.5, 78);