import React, { useState, useEffect } from 'react';
import { Settings, Bell, Search, Plus, Heart, MessageCircle, Trophy, Target, Flame, Users, Map, Calendar, Star, Menu, X } from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { Feed } from './components/Feed';
import { Profile } from './components/Profile';
import { MealLogger } from './components/MealLogger';
import { Challenges } from './components/Challenges';
import { Leaderboard } from './components/Leaderboard';
import { Navigation } from './components/Navigation';
import { Notifications } from './components/Notifications';
import { Settings as SettingsComponent } from './components/Settings';
import { SearchModal } from './components/SearchModal';
import { Groups } from './components/Groups';
import { Discover } from './components/Discover';
import { CalorieTracker } from './components/CalorieTracker';
import { UserProfile } from './components/UserProfile';
import { FindFriends } from './components/FindFriends';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import type { User } from './types';

function App() {
  const { currentUser, isAuthenticated, login, logout, updateUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover' | 'calories' | 'find-friends' | 'user-profile'>('feed');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setCurrentView('user-profile');
  };

  if (!isAuthenticated || !currentUser) {
    return <AuthScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineIndicator />
      
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">EatSocial</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentView('notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30">
            <div className="p-4 space-y-2">
              <button
                onClick={() => { setCurrentView('feed'); setShowMobileMenu(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === 'feed' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Feed</span>
              </button>
              <button
                onClick={() => { setCurrentView('discover'); setShowMobileMenu(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === 'discover' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Discover</span>
              </button>
              <button
                onClick={() => { setCurrentView('groups'); setShowMobileMenu(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === 'groups' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Groups</span>
              </button>
              <button
                onClick={() => { setCurrentView('calories'); setShowMobileMenu(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === 'calories' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Calorie Tracker</span>
              </button>
              <button
                onClick={() => { setCurrentView('settings'); setShowMobileMenu(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentView === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}
      </header>
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EatSocial</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('feed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'feed' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setCurrentView('discover')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'discover' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setCurrentView('groups')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'groups' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => setCurrentView('challenges')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'challenges' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'leaderboard' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setCurrentView('calories')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'calories' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Calories
              </button>
              <button
                onClick={() => setCurrentView('find-friends')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'find-friends' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Find Friends
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                onClick={() => setShowSearch(true)}
                type="text"
                placeholder="Search users, meals, or challenges..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('log')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal</span>
            </button>
            <button 
              onClick={() => setCurrentView('notifications')}
              className="relative text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className="w-8 h-8 rounded-full overflow-hidden"
            >
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Today's Goals</h3>
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-medium">{currentUser.caloriesConsumed}/{currentUser.dailyCalorieGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentUser.caloriesConsumed / currentUser.dailyCalorieGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-medium">{currentUser.proteinConsumed}g/{currentUser.dailyProteinGoal}g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentUser.proteinConsumed / currentUser.dailyProteinGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => { setCurrentView('find-friends'); setShowMobileMenu(false); }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    currentView === 'find-friends' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Find Friends</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Streak</h3>
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">{currentUser.streak}</div>
              <p className="text-sm text-gray-600">days in a row</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
              <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Map className="w-5 h-5" />
                <span>Eating Map</span>
              </button>
              <button 
                onClick={() => setCurrentView('find-friends')}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Find Friends</span>
              </button>
              <button 
                onClick={() => setCurrentView('settings')}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:max-w-4xl lg:mx-auto">
          {currentView === 'feed' && (
            <Feed 
              onViewProfile={handleViewProfile} 
              currentUser={currentUser}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'discover' && <Discover />}
          {currentView === 'groups' && <Groups />}
          {currentView === 'profile' && <Profile user={currentUser} onUpdateUser={updateUser} />}
          {currentView === 'user-profile' && selectedUser && (
            <UserProfile 
              user={selectedUser} 
              currentUser={currentUser}
              onBack={() => setCurrentView('feed')}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'find-friends' && (
            <FindFriends 
              currentUser={currentUser}
              onViewProfile={handleViewProfile}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'log' && <MealLogger user={currentUser} onClose={() => setCurrentView('feed')} onUpdateUser={updateUser} />}
          {currentView === 'challenges' && <Challenges />}
          {currentView === 'leaderboard' && <Leaderboard />}
          {currentView === 'calories' && <CalorieTracker user={currentUser} onUpdateUser={updateUser} />}
          {currentView === 'notifications' && <Notifications notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} />}
          {currentView === 'settings' && <SettingsComponent user={currentUser} onLogout={logout} onUpdateUser={updateUser} />}
        </main>
      </div>

      {/* Search Modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} onViewProfile={handleViewProfile} />}

      {/* Mobile Navigation */}
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;