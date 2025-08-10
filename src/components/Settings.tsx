import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Crown,
  Target,
  Activity,
  Scale,
  Heart
} from 'lucide-react';
import { PremiumUpgrade } from './PremiumUpgrade';
import type { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(user.notificationSettings);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: 'Edit Profile',
          description: 'Update your profile information',
          action: () => console.log('Edit profile')
        },
        {
          icon: <Target className="w-5 h-5" />,
          label: 'Goals & Targets',
          description: 'Set your daily nutrition goals',
          action: () => console.log('Goals')
        },
        {
          icon: <Activity className="w-5 h-5" />,
          label: 'Activity Level',
          description: 'Update your activity level',
          value: user.activityLevel,
          action: () => console.log('Activity level')
        },
        {
          icon: <Scale className="w-5 h-5" />,
          label: 'Weight Tracking',
          description: 'Manage weight goals and history',
          action: () => console.log('Weight tracking')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
          label: 'Dark Mode',
          description: 'Toggle dark mode theme',
          toggle: true,
          value: darkMode,
          action: () => setDarkMode(!darkMode)
        },
        {
          icon: <Globe className="w-5 h-5" />,
          label: 'Language',
          description: 'Change app language',
          value: 'English',
          action: () => console.log('Language')
        },
        {
          icon: <Heart className="w-5 h-5" />,
          label: 'Dietary Preferences',
          description: 'Update your dietary restrictions',
          value: user.dietaryPreferences.join(', ') || 'None set',
          action: () => console.log('Dietary preferences')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell className="w-5 h-5" />,
          label: 'Push Notifications',
          description: 'Receive push notifications',
          toggle: true,
          value: notifications.push,
          action: () => toggleNotification('push')
        },
        {
          icon: <Mail className="w-5 h-5" />,
          label: 'Email Notifications',
          description: 'Receive email updates',
          toggle: true,
          value: notifications.email,
          action: () => toggleNotification('email')
        },
        {
          icon: <Heart className="w-5 h-5" />,
          label: 'Likes & Comments',
          description: 'Notifications for social interactions',
          toggle: true,
          value: notifications.likes && notifications.comments,
          action: () => {
            toggleNotification('likes');
            toggleNotification('comments');
          }
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: <Shield className="w-5 h-5" />,
          label: 'Privacy Settings',
          description: 'Control who can see your content',
          action: () => console.log('Privacy settings')
        },
        {
          icon: <Lock className="w-5 h-5" />,
          label: 'Change Password',
          description: 'Update your account password',
          action: () => console.log('Change password')
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          label: 'Connected Apps',
          description: 'Manage connected fitness apps',
          action: () => console.log('Connected apps')
        }
      ]
    },
    {
      title: 'Premium',
      items: [
        {
          icon: <Crown className="w-5 h-5" />,
          label: user.isPremium ? 'Manage Subscription' : 'Upgrade to Pro',
          description: user.isPremium ? 'Manage your premium subscription' : 'Unlock advanced features',
          action: () => setShowPremiumUpgrade(true),
          highlight: !user.isPremium
        },
        {
          icon: <CreditCard className="w-5 h-5" />,
          label: 'Billing',
          description: 'View billing history and payment methods',
          action: () => console.log('Billing')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle className="w-5 h-5" />,
          label: 'Help & Support',
          description: 'Get help and contact support',
          action: () => console.log('Help')
        },
        {
          icon: <SettingsIcon className="w-5 h-5" />,
          label: 'About EatSocial',
          description: 'App version and information',
          value: 'v1.0.0',
          action: () => console.log('About')
        }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 lg:p-8 rounded-b-3xl lg:rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-300">Customize your EatSocial experience</p>
          </div>
          <SettingsIcon className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar} 
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900">{user.displayName}</h2>
                {user.isPremium && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>PRO</span>
                  </span>
                )}
              </div>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section) => (
            <div key={section.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left ${
                      item.highlight ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${item.highlight ? 'text-purple-600' : 'text-gray-600'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${item.highlight ? 'text-purple-900' : 'text-gray-900'}`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${item.highlight ? 'text-purple-600' : 'text-gray-600'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.toggle ? (
                        <div className={`w-12 h-6 rounded-full transition-colors ${
                          item.value ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}></div>
                        </div>
                      ) : (
                        <>
                          {item.value && (
                            <span className="text-sm text-gray-500">{item.value}</span>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={onLogout}
            className="w-full bg-red-50 border border-red-200 text-red-600 font-medium py-4 px-6 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumUpgrade && (
        <PremiumUpgrade onClose={() => setShowPremiumUpgrade(false)} />
      )}
    </div>
  );
};