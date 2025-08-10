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
  Heart,
  Eye,
  EyeOff,
  X,
  Save,
  Check,
  AlertTriangle,
  MessageCircle,
  Users,
  Camera,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { PremiumUpgrade } from './PremiumUpgrade';
import { WeightTracker } from './WeightTracker';
import { EditProfile } from './EditProfile';
import { GoalsTargets } from './GoalsTargets';
import { ActivityLevelSelector } from './ActivityLevelSelector';
import type { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUpdateUser }) => {
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [showWeightTracker, setShowWeightTracker] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showGoalsTargets, setShowGoalsTargets] = useState(false);
  const [showActivityLevel, setShowActivityLevel] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showDietaryPreferences, setShowDietaryPreferences] = useState(false);
  const [showConnectedApps, setShowConnectedApps] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(user.notificationSettings);
  const [privacy, setPrivacy] = useState(user.privacySettings);

  const toggleNotification = (key: keyof typeof notifications) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updatedNotifications);
    onUpdateUser({ notificationSettings: updatedNotifications });
  };

  const updatePrivacySetting = (key: keyof typeof privacy, value: any) => {
    const updatedPrivacy = {
      ...privacy,
      [key]: value
    };
    setPrivacy(updatedPrivacy);
    onUpdateUser({ privacySettings: updatedPrivacy });
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: 'Edit Profile',
          description: 'Update your profile information',
          action: () => setShowEditProfile(true)
        },
        {
          icon: <Target className="w-5 h-5" />,
          label: 'Goals & Targets',
          description: 'Set your daily nutrition goals',
          action: () => setShowGoalsTargets(true)
        },
        {
          icon: <Activity className="w-5 h-5" />,
          label: 'Activity Level',
          description: 'Update your activity level',
          value: user.activityLevel,
          action: () => setShowActivityLevel(true)
        },
        {
          icon: <Scale className="w-5 h-5" />,
          label: 'Weight Tracking',
          description: 'Manage weight goals and history',
          action: () => setShowWeightTracker(true)
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
          value: language,
          action: () => setShowLanguageSettings(true)
        },
        {
          icon: <Heart className="w-5 h-5" />,
          label: 'Dietary Preferences',
          description: 'Update your dietary restrictions',
          value: user.dietaryPreferences.join(', ') || 'None set',
          action: () => setShowDietaryPreferences(true)
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
          action: () => setShowNotificationSettings(true)
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
          action: () => setShowPrivacySettings(true)
        },
        {
          icon: <Lock className="w-5 h-5" />,
          label: 'Change Password',
          description: 'Update your account password',
          action: () => setShowChangePassword(true)
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          label: 'Connected Apps',
          description: 'Manage connected fitness apps',
          action: () => setShowConnectedApps(true)
        },
        {
          icon: <Download className="w-5 h-5" />,
          label: 'Export Data',
          description: 'Download your data',
          action: () => setShowDataExport(true)
        },
        {
          icon: <Trash2 className="w-5 h-5" />,
          label: 'Delete Account',
          description: 'Permanently delete your account',
          action: () => setShowDeleteAccount(true),
          danger: true
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
          action: () => setShowHelpSupport(true)
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
                    } ${item.danger ? 'hover:bg-red-50' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${
                        item.highlight ? 'text-purple-600' : 
                        item.danger ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          item.highlight ? 'text-purple-900' : 
                          item.danger ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${
                          item.highlight ? 'text-purple-600' : 
                          item.danger ? 'text-red-600' : 'text-gray-600'
                        }`}>
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

      {/* Account Modals */}
      {showEditProfile && (
        <EditProfile
          user={user}
          onClose={() => setShowEditProfile(false)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {showGoalsTargets && (
        <GoalsTargets
          user={user}
          onClose={() => setShowGoalsTargets(false)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {showActivityLevel && (
        <ActivityLevelSelector
          user={user}
          onClose={() => setShowActivityLevel(false)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {showWeightTracker && (
        <WeightTracker 
          user={user}
          onClose={() => setShowWeightTracker(false)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {[
                { key: 'likes', label: 'Likes', description: 'When someone likes your posts' },
                { key: 'comments', label: 'Comments', description: 'When someone comments on your posts' },
                { key: 'follows', label: 'New Followers', description: 'When someone follows you' },
                { key: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
                { key: 'challenges', label: 'Challenges', description: 'Challenge updates and reminders' },
                { key: 'achievements', label: 'Achievements', description: 'When you earn badges or reach milestones' },
                { key: 'reminders', label: 'Meal Reminders', description: 'Daily meal logging reminders' },
                { key: 'groups', label: 'Groups', description: 'Group activity and updates' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    <button
                      onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
              <button
                onClick={() => setShowPrivacySettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Visibility</label>
                <div className="space-y-2">
                  {['public', 'friends', 'private'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updatePrivacySetting('profileVisibility', option)}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        privacy.profileVisibility === option 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {option === 'public' && <Globe className="w-4 h-4" />}
                        {option === 'friends' && <Users className="w-4 h-4" />}
                        {option === 'private' && <Lock className="w-4 h-4" />}
                        <span className="capitalize">{option}</span>
                      </div>
                      {privacy.profileVisibility === option && <Check className="w-4 h-4 text-green-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Meal Visibility</label>
                <div className="space-y-2">
                  {['public', 'friends', 'private'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updatePrivacySetting('mealVisibility', option)}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        privacy.mealVisibility === option 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {option === 'public' && <Globe className="w-4 h-4" />}
                        {option === 'friends' && <Users className="w-4 h-4" />}
                        {option === 'private' && <Lock className="w-4 h-4" />}
                        <span className="capitalize">{option}</span>
                      </div>
                      {privacy.mealVisibility === option && <Check className="w-4 h-4 text-green-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { key: 'showWeight', label: 'Show Weight Progress', description: 'Display weight on profile' },
                { key: 'showGoals', label: 'Show Goals', description: 'Display nutrition goals publicly' },
                { key: 'allowMessages', label: 'Allow Messages', description: 'Let others message you' },
                { key: 'showOnLeaderboard', label: 'Show on Leaderboard', description: 'Appear in public rankings' },
                { key: 'allowTagging', label: 'Allow Tagging', description: 'Let others tag you in posts' },
                { key: 'allowSharing', label: 'Allow Sharing', description: 'Let others share your content' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    privacy[item.key as keyof typeof privacy] ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    <button
                      onClick={() => updatePrivacySetting(item.key as keyof typeof privacy, !privacy[item.key as keyof typeof privacy])}
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        privacy[item.key as keyof typeof privacy] ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Settings Modal */}
      {showLanguageSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Language</h2>
              <button
                onClick={() => setShowLanguageSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageSettings(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      language === lang 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang}</span>
                    {language === lang && <Check className="w-4 h-4 text-green-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Connected Apps Modal */}
      {showConnectedApps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Connected Apps</h2>
              <button
                onClick={() => setShowConnectedApps(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'MyFitnessPal', status: 'Connected', color: 'text-green-600' },
                  { name: 'Apple Health', status: 'Not Connected', color: 'text-gray-500' },
                  { name: 'Google Fit', status: 'Not Connected', color: 'text-gray-500' },
                  { name: 'Fitbit', status: 'Connected', color: 'text-green-600' }
                ].map((app) => (
                  <div key={app.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{app.name}</div>
                      <div className={`text-sm ${app.color}`}>{app.status}</div>
                    </div>
                    <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      app.status === 'Connected' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}>
                      {app.status === 'Connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Export Modal */}
      {showDataExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
              <button
                onClick={() => setShowDataExport(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Export Your Data</p>
                    <p>Download all your meal logs, weight entries, and profile data in JSON format.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Meal Data</div>
                    <div className="text-sm text-gray-600">All logged meals and nutrition data</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Weight Data</div>
                    <div className="text-sm text-gray-600">Weight entries and progress history</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Complete Export</div>
                    <div className="text-sm text-gray-600">All data including profile and social data</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-red-900">Delete Account</h2>
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">This action cannot be undone</p>
                    <p>Deleting your account will permanently remove all your data including meals, progress, and social connections.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type "DELETE" to confirm</label>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteAccount(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
              <button
                onClick={() => setShowHelpSupport(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">FAQ</div>
                    <div className="text-sm text-gray-600">Frequently asked questions</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Contact Support</div>
                    <div className="text-sm text-gray-600">Get help from our team</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Community Guidelines</div>
                    <div className="text-sm text-gray-600">Learn about our community rules</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Privacy Policy</div>
                    <div className="text-sm text-gray-600">How we protect your data</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Terms of Service</div>
                    <div className="text-sm text-gray-600">Our terms and conditions</div>
                  </div>
                </button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Need immediate help?</h3>
                  <p className="text-sm text-gray-600 mb-4">Our support team typically responds within 24 hours</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dietary Preferences Modal */}
      {showDietaryPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Dietary Preferences</h2>
              <button
                onClick={() => setShowDietaryPreferences(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 
                  'mediterranean', 'low-carb', 'high-protein', 'gluten-free', 'dairy-free'
                ].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => {
                      const currentPrefs = user.dietaryPreferences;
                      const newPrefs = currentPrefs.includes(pref)
                        ? currentPrefs.filter(p => p !== pref)
                        : [...currentPrefs, pref];
                      onUpdateUser({ dietaryPreferences: newPrefs });
                    }}
                    className={`p-3 border-2 rounded-lg transition-all text-center ${
                      user.dietaryPreferences.includes(pref)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium capitalize">{pref}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDietaryPreferences(false)}
                className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumUpgrade && (
        <PremiumUpgrade onClose={() => setShowPremiumUpgrade(false)} />
      )}
    </div>
  );
};