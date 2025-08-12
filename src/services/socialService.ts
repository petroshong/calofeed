import { supabase } from '../lib/supabase';
import type { User } from '../types';

export class SocialService {
  static async followUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId
      });

    if (error) throw error;

    // Create notification for the followed user
    await this.createNotification(followingId, {
      type: 'follow',
      title: 'New Follower',
      message: 'Someone started following you',
      data: { follower_id: followerId }
    });
  }

  static async unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  }

  static async getFollowing(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (error) throw error;
    return data?.map(f => f.following_id) || [];
  }

  static async getFollowers(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId);

    if (error) throw error;
    return data?.map(f => f.follower_id) || [];
  }

  static async sendFriendRequest(fromUserId: string, toUserId: string, message?: string) {
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message
      });

    if (error) throw error;

    // Create notification
    await this.createNotification(toUserId, {
      type: 'follow',
      title: 'Friend Request',
      message: 'Someone sent you a friend request',
      data: { from_user_id: fromUserId }
    });
  }

  static async respondToFriendRequest(requestId: string, status: 'accepted' | 'declined') {
    const { data, error } = await supabase
      .from('friend_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select('from_user_id, to_user_id')
      .single();

    if (error) throw error;

    if (status === 'accepted' && data) {
      // Create mutual follow relationship
      await this.followUser(data.from_user_id, data.to_user_id);
      await this.followUser(data.to_user_id, data.from_user_id);

      // Notify the requester
      await this.createNotification(data.from_user_id, {
        type: 'follow',
        title: 'Friend Request Accepted',
        message: 'Your friend request was accepted',
        data: { accepted_by: data.to_user_id }
      });
    }
  }

  static async createNotification(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: string;
    category?: string;
    actionUrl?: string;
    avatarUrl?: string;
  }) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...notification
      });

    if (error) throw error;
  }

  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  static async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  static async checkInAtLocation(userId: string, locationName: string, rating?: number, note?: string) {
    // First, find or create the location
    let { data: location, error: locationError } = await supabase
      .from('locations')
      .select('*')
      .eq('name', locationName)
      .single();

    if (locationError && locationError.code === 'PGRST116') {
      // Location doesn't exist, create it
      const { data: newLocation, error: createError } = await supabase
        .from('locations')
        .insert({
          name: locationName,
          city: 'San Francisco', // Default for demo
          state: 'CA',
          rating: rating || 4.5
        })
        .select()
        .single();

      if (createError) throw createError;
      location = newLocation;
    } else if (locationError) {
      throw locationError;
    }

    // Create check-in
    const { error: checkinError } = await supabase
      .from('location_checkins')
      .insert({
        user_id: userId,
        location_id: location!.id,
        rating,
        note
      });

    if (checkinError) throw checkinError;

    return location;
  }

  static async getTrendingLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('check_in_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  static async getTrendingHashtags() {
    const { data, error } = await supabase
      .from('hashtags')
      .select('*')
      .order('trending_score', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }
}