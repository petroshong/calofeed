import React from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Trophy, Gift, X, Check, CheckCheck } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'challenge':
        return <Gift className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 lg:pb-0 px-4 lg:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-xl lg:mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-indigo-100">Stay updated with your community</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{unreadNotifications.length}</div>
            <div className="text-sm text-indigo-200">Unread</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white border-b border-gray-200 p-4">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-xl p-4 transition-all duration-200 ${
                notification.isRead 
                  ? 'border-gray-200' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <img 
                      src={notification.avatar} 
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      {!notification.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};