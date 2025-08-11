import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Trophy, Target, Flame, Clock, Star } from 'lucide-react';
import type { User } from '../types';

interface Activity {
  id: string;
  type: 'meal_logged' | 'goal_achieved' | 'badge_earned' | 'challenge_joined' | 'user_followed' | 'streak_milestone';
  user: User;
  timestamp: string;
  data: any;
}

interface ActivityFeedProps {
  onHashtagClick?: (hashtag: string) => void;
}
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'meal_logged',
    user: {
      id: '2',
      username: 'healthyeats',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    timestamp: '2 minutes ago',
    data: {
      mealType: 'lunch',
      calories: 520,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Perfect post-workout meal! #protein #postworkout'
    }
  },
  {
    id: '2',
    type: 'goal_achieved',
    user: {
      id: '3',
      username: 'fitnessguru',
      displayName: 'Mike Rodriguez',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    timestamp: '15 minutes ago',
    data: {
      goalType: 'protein',
      target: 150,
      achieved: 152,
      description: 'Crushed my protein goal today! #proteingoals #fitness'
    }
  },
  {
    id: '3',
    type: 'badge_earned',
    user: {
      id: '4',
      username: 'plantbased',
      displayName: 'Emma Green',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    timestamp: '1 hour ago',
    data: {
      badge: {
        name: 'Veggie Master',
        emoji: '🥬',
        description: 'Logged 100 vegetable servings'
      }
      description: 'Just earned the Veggie Master badge! #plantbased #veggies'
    }
  },
  {
    id: '4',
    type: 'streak_milestone',
    user: {
      id: '5',
      username: 'ketowarrior',
      displayName: 'Jessica Kim',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
    } as User,
    timestamp: '3 hours ago',
    data: {
      streak: 30,
      milestone: '30-day streak',
      description: '30 days of consistent logging! #streak #consistency #keto'
    }
  }
];

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ onHashtagClick }) => {
  const [activities] = useState<Activity[]>(mockActivities);

  const renderTextWithHashtags = (text: string) => {
    return text.split(/(\s|^)(#\w+)/g).map((part, index) => {
      if (part.match(/^#\w+/)) {
        return (
          <button
            key={index}
            onClick={() => onHashtagClick && onHashtagClick(part.slice(1))}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meal_logged':
        return <Heart className="w-5 h-5 text-green-600" />;
      case 'goal_achieved':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'badge_earned':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'challenge_joined':
        return <Star className="w-5 h-5 text-purple-600" />;
      case 'user_followed':
        return <UserPlus className="w-5 h-5 text-pink-600" />;
      case 'streak_milestone':
        return <Flame className="w-5 h-5 text-orange-600" />;
      default:
        return <Heart className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'meal_logged':
        return `logged a ${activity.data.mealType} (${activity.data.calories} cal)`;
      case 'goal_achieved':
        return `hit their ${activity.data.goalType} goal (${activity.data.achieved}g)`;
      case 'badge_earned':
        return `earned the "${activity.data.badge.name}" badge`;
      case 'challenge_joined':
        return `joined the "${activity.data.challengeName}" challenge`;
      case 'user_followed':
        return `started following ${activity.data.followedUser}`;
      case 'streak_milestone':
        return `reached a ${activity.data.streak}-day logging streak! 🔥`;
      default:
        return 'had some activity';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          Recent Activity
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <img 
                    src={activity.user.avatar} 
                    alt={activity.user.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-900">{activity.user.displayName}</span>
                  {activity.user.isVerified && <Star className="w-3 h-3 text-blue-500 fill-current" />}
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {getActivityMessage(activity)}
                </p>
                {activity.data.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {renderTextWithHashtags(activity.data.description)}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
              
              {activity.type === 'meal_logged' && activity.data.image && (
                <img 
                  src={activity.data.image} 
                  alt="Meal"
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};