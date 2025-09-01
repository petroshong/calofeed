import React, { useState, useEffect } from 'react';
import { Flame, Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { AuthService } from '../services/authService';
import { handleError } from '../utils/errorHandler';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, userData: { username: string; displayName: string; bio?: string }) => void;
  isModal?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp, isModal = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    username: '',
    confirmPassword: ''
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const available = await AuthService.checkUsernameAvailability(username);
      setUsernameAvailable(available);
    } catch (error) {
      console.error('Username check failed:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await onLogin(formData.email.trim(), formData.password);
      } else {
        if (!onSignUp) {
          setError('Sign up not available');
          return;
        }
        const result = await onSignUp(formData.email, formData.password, {
          username: formData.username,
          displayName: formData.displayName.trim()
        });
        if (result?.success) {
          setSuccess(result.message);
          // Clear form after successful signup
          setFormData({
            email: '',
            password: '',
            displayName: '',
            username: '',
            confirmPassword: ''
          });
        }
      }
    } catch (err: any) {
      const appError = handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear errors when user starts typing
    setSuccess('');
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);

    // Check username availability when typing
    if (e.target.name === 'username' && !isLogin) {
      checkUsername(e.target.value);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return false;
    }
    if (!isLogin && (!formData.displayName || !formData.username)) {
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return false;
    }
    return true;
  };

  // Handle mobile back gesture
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModal) {
        // Close modal on escape key
        window.history.back();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModal]);

  return (
    <div className={`${isModal ? 'relative' : 'min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4'}`}>
      {/* Mobile Close Button for Modal */}
      {isModal && (
        <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors touch-target"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      
      <div className="max-w-md w-full">
        {!isModal && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CaloFeed</h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back! Sign in to your account' : 'Join the social food tracking revolution'}
            </p>
          </div>
        )}

        {/* Auth Form */}
        <div className={`${isModal ? 'p-4 lg:p-6' : 'bg-white rounded-2xl shadow-xl border border-gray-100 p-8'}`}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                  {error.includes('Invalid login credentials') && (
                    <p className="text-red-600 text-xs mt-1">
                      Don't have an account? Click "Sign up" below to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
                <div>
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                  {success.includes('check your email') && (
                    <p className="text-green-600 text-xs mt-1">
                      After verifying your email, return here to sign in.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isModal && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                {isLogin ? 'First time here?' : 'Ready to join?'}
              </h3>
              <p className="text-blue-700 text-sm">
                {isLogin 
                  ? 'Create a free account to start tracking your nutrition and connecting with friends.'
                  : 'Join thousands of users sharing their food journey and achieving their health goals.'
                }
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="username"
                      required
                      pattern="[a-zA-Z0-9_]+"
                      title="Username can only contain letters, numbers, and underscores"
                      minLength={3}
                      maxLength={20}
                    />
                    {checkingUsername && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {formData.username && !checkingUsername && (
                    <div className="mt-1 text-xs">
                      {usernameAvailable === true && (
                        <span className="text-green-600">✓ Username available</span>
                      )}
                      {usernameAvailable === false && (
                        <span className="text-red-600">✗ Username taken</span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords don't match
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !validateForm() || (!isLogin && usernameAvailable === false)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>


        {!isModal && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Join thousands of users sharing their food journey</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Social Feed
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Challenges
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Leaderboards
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};