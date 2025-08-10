import React, { useState, useRef, useEffect } from 'react';
import { AtSign } from 'lucide-react';
import type { User } from '../types';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'fitnessguru',
    displayName: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50',
  } as User,
  {
    id: '2',
    username: 'healthyeats',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50',
  } as User,
  {
    id: '3',
    username: 'plantbased',
    displayName: 'Emma Green',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50',
  } as User
];

export const MentionInput: React.FC<MentionInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Add a comment...", 
  className = "",
  onSubmit
}) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check for @ mentions
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  const insertMention = (user: User) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, mentionMatch.index);
      const newValue = `${beforeMention}@${user.username} ${textAfterCursor}`;
      onChange(newValue);
      setShowMentions(false);
      setMentionQuery('');
      
      // Focus back to input
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = beforeMention.length + user.username.length + 2;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showMentions && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      />
      
      {showMentions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
              <AtSign className="w-4 h-4" />
              <span>Mention someone</span>
            </div>
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img 
                  src={user.avatar} 
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm">{user.displayName}</div>
                  <div className="text-gray-600 text-xs">@{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};