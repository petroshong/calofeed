import React from 'react';
import { Crown, Check, X, Zap, Star, Target, BarChart3, MessageCircle } from 'lucide-react';

interface PremiumUpgradeProps {
  onClose: () => void;
}

export const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onClose }) => {
  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Advanced Analytics',
      description: 'Detailed nutrition insights and progress tracking'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'AI Meal Recommendations',
      description: 'Personalized meal suggestions based on your goals'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Nutrition Coach Chat',
      description: '24/7 access to certified nutrition experts'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Custom Goals & Macros',
      description: 'Set personalized targets beyond basic tracking'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Exclusive Challenges',
      description: 'Access to premium challenges with bigger rewards'
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: 'Priority Support',
      description: 'Get help faster with premium customer support'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl lg:rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Upgrade to Pro</h1>
            <p className="text-purple-100">Unlock advanced features and take your nutrition journey to the next level</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Pricing */}
          <div className="text-center">
            <div className="inline-flex items-baseline space-x-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">$9.99</span>
              <span className="text-lg text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600">Cancel anytime • 7-day free trial</p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">What's Included</h2>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-purple-600 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Free vs Pro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Basic meal logging</span>
                <div className="flex space-x-4">
                  <Check className="w-4 h-4 text-green-600" />
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Advanced analytics</span>
                <div className="flex space-x-4">
                  <X className="w-4 h-4 text-red-500" />
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">AI recommendations</span>
                <div className="flex space-x-4">
                  <X className="w-4 h-4 text-red-500" />
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Nutrition coach access</span>
                <div className="flex space-x-4">
                  <X className="w-4 h-4 text-red-500" />
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
              Start 7-Day Free Trial
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Your subscription will automatically renew unless cancelled.
          </p>
        </div>
      </div>
    </div>
  );
};