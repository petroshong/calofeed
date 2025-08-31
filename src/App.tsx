import React, { useState, useEffect } from 'react';
import { Settings, Bell, Search, Plus, Heart, MessageCircle, Trophy, Target, Flame, Users, Map, Calendar, Star, Menu, X, UserPlus } from 'lucide-react';
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
import { FriendRequests } from './components/FriendRequests';
import { MealDetail } from './components/MealDetail';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { useFriendRequests } from './hooks/useFriendRequests';
import { useMeals } from './hooks/useMeals';
import type { User, Meal } from './types';

function App() {
  const { currentUser, isAuthenticated, isGuest, loading, login, signUp, logout, updateUser, requireAuth } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { getIncomingRequests } = useFriendRequests(currentUser || {} as User);
  const { meals: userMeals } = useMeals(currentUser || {} as User);
  const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'log' | 'challenges' | 'leaderboard' | 'notifications' | 'settings' | 'groups' | 'discover' | 'calories' | 'find-friends' | 'user-profile' | 'friend-requests'>('feed');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const incomingRequests = !isGuest && currentUser ? getIncomingRequests() : [];

  const handleAuthRequired = (action: string) => {
    if (isGuest) {
      setShowAuthPrompt(true);
      return false;
    }
    return true;
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setCurrentView('user-profile');
  };

  const handleViewMeal = (mealId: string) => {
    // Find meal in user's meals or mock data
    const allMeals = userMeals || [];
    const meal = allMeals.find(m => m.id === mealId);
    if (meal) {
      setSelectedMeal(meal);
    }
  };

  // Handle URL routing for shared meal links
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const mealMatch = path.match(/\/meal\/(.+)/);
      if (mealMatch) {
        const mealId = mealMatch[1];
        handleViewMeal(mealId);
      }
    };

    const handleViewMealEvent = (event: CustomEvent) => {
      const { mealId } = event.detail;
      handleViewMeal(mealId);
    };
    // Check initial URL
    handleUrlChange();

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('viewMeal', handleViewMealEvent as EventListener);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('viewMeal', handleViewMealEvent as EventListener);
    };
  }, [userMeals]);

  // Remove loading screen to fix infinite loading
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
  //           <Flame className="w-8 h-8 text-white animate-pulse" />
  //         </div>
  //         <h1 className="text-2xl font-bold text-gray-900 mb-2">CaloFeed</h1>
  //         <p className="text-gray-600">Loading your food journey...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
            <button 
              onClick={() => setCurrentView('feed')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">CaloFeed</span>
            </button>
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
        <div className="max-w-7xl mx-auto px-4 xl:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setCurrentView('feed')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CaloFeed</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('discover')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'discover' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setCurrentView('groups')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'groups' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => setCurrentView('challenges')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'challenges' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'leaderboard' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setCurrentView('calories')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'calories' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Calories
              </button>
              <button
                onClick={() => setCurrentView('find-friends')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                  currentView === 'find-friends' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Find Friends
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                onClick={() => setShowSearch(true)}
                type="text"
                placeholder="Search users, meals, or challenges..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer text-sm lg:text-base"
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (handleAuthRequired('log meal')) {
                  setCurrentView('log');
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm lg:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Log Meal</span>
              <span className="lg:hidden">Log</span>
            </button>
            <button 
              onClick={() => {
                if (handleAuthRequired('view notifications')) {
                  setCurrentView('notifications');
                }
              }}
              className="relative text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {!isGuest && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {!isGuest ? (
              <button 
                onClick={() => setCurrentView('profile')}
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden"
              >
                <img src={currentUser?.avatar} alt="Profile" className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthPrompt(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
          {isAuthenticated && currentUser ? (
            <div className="p-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Today's Goals</h3>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((currentUser.caloriesConsumed / currentUser.dailyCalorieGoal) * 100)}%
                  </div>
                  <div className="text-sm text-green-700">Daily Progress</div>
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
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Streak</h3>
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-600">{currentUser.streak}</div>
                <p className="text-sm text-gray-600">days in a row</p>
                <div className="mt-2 text-xs text-orange-700">
                  Keep it up! You're on fire! 🔥
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                <button
                  onClick={() => { setCurrentView('friend-requests'); setShowMobileMenu(false); }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    currentView === 'friend-requests' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <div className="flex items-center justify-between w-full">
                    <span>Friend Requests</span>
                    {incomingRequests.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {incomingRequests.length}
                      </span>
                    )}
                  </div>
                </button>
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
          ) : (
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Welcome to CaloFeed</h3>
                  <p className="text-sm text-gray-600 mb-4">Sign up to track your nutrition and connect with friends</p>
                  <button
                    onClick={() => setShowAuthPrompt(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Track calories & macros</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Share meals with friends</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Join challenges</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Build streaks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-none">
          {currentView === 'feed' && (
            <Feed 
              onViewProfile={handleViewProfile} 
              currentUser={currentUser || {} as User}
              isGuest={isGuest}
              onAuthRequired={() => setShowAuthPrompt(true)}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'discover' && <Discover onHashtagClick={(hashtag) => {
            // Could implement hashtag navigation here or open hashtag feed
            console.log('Hashtag clicked:', hashtag);
          }} />}
          {currentView === 'groups' && <Groups />}
          {currentView === 'profile' && currentUser && <Profile user={currentUser} onUpdateUser={updateUser} />}
          {currentView === 'user-profile' && selectedUser && (
            <UserProfile 
              user={selectedUser} 
              currentUser={currentUser || {} as User}
              isGuest={isGuest}
              onAuthRequired={() => setShowAuthPrompt(true)}
              onBack={() => setCurrentView('feed')}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'find-friends' && (
            <FindFriends 
              currentUser={currentUser || {} as User}
              onViewProfile={handleViewProfile}
              onUpdateCurrentUser={updateUser}
            />
          )}
          {currentView === 'friend-requests' && (
            <FriendRequests 
              currentUser={currentUser || {} as User}
              onClose={() => setCurrentView('feed')}
              onViewProfile={handleViewProfile}
            />
          )}
          {currentView === 'log' && currentUser && <MealLogger user={currentUser} onClose={() => setCurrentView('feed')} onUpdateUser={updateUser} />}
          {currentView === 'challenges' && <Challenges />}
          {currentView === 'leaderboard' && <Leaderboard />}
          {currentView === 'calories' && currentUser && <CalorieTracker user={currentUser} onUpdateUser={updateUser} />}
          {currentView === 'notifications' && <Notifications notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} />}
          {currentView === 'settings' && currentUser && <SettingsComponent user={currentUser} onLogout={logout} onUpdateUser={updateUser} />}
        </main>
      </div>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetail 
          meal={selectedMeal} 
          onClose={() => {
            setSelectedMeal(null);
            // Reset URL to home
            window.history.pushState({}, '', '/');
          }}
          onHashtagClick={(hashtag) => {
            setSelectedMeal(null);
            // Could implement hashtag navigation here
          }}
        />
      )}

      {/* Search Modal */}
      {showSearch && (
        <SearchModal 
          onClose={() => setShowSearch(false)} 
          onViewProfile={handleViewProfile}
          onSelectFood={(food) => {
            console.log('Selected food:', food);
            setShowSearch(false);
            // Could open meal logger with pre-filled food data
          }}
        />
      )}

      {/* Mobile Navigation */}
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentUser={currentUser || {} as User}
        isGuest={isGuest}
        onAuthRequired={() => setShowAuthPrompt(true)}
      />

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center p-4 lg:p-0">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-md w-full p-6 modal-mobile">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join CaloFeed</h2>
              <p className="text-gray-600 mb-6">
                Sign up to log meals, follow friends, and join the community!
              </p>
              <div className="space-y-3">
                <AuthScreen onLogin={login} onSignUp={signUp} isModal={true} />
              </div>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 text-sm touch-target"
              >
                Continue browsing as guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;