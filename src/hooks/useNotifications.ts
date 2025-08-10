import { useState, useEffect } from 'react';
import type { Notification } from '../types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Johnson liked your salmon bowl post',
    timestamp: '2 minutes ago',
    isRead: false,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50',
    actionUrl: '/meal/123'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Mike Rodriguez commented on your workout meal',
    timestamp: '15 minutes ago',
    isRead: false,
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50',
    actionUrl: '/meal/124'
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Emma Green started following you',
    timestamp: '1 hour ago',
    isRead: false,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50',
    actionUrl: '/profile/emma'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Badge Earned!',
    message: 'You earned the "Protein Master" badge',
    timestamp: '3 hours ago',
    isRead: true,
    actionUrl: '/profile'
  },
  {
    id: '5',
    type: 'challenge',
    title: 'Challenge Update',
    message: 'You\'re in 3rd place in the 7-Day Protein Challenge!',
    timestamp: '6 hours ago',
    isRead: true,
    actionUrl: '/challenges'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };
};