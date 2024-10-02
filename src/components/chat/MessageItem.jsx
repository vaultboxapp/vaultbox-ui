import React from 'react';
import UserAvatar from '../common/UserAvatar';
import { Heart } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

export default function MessageItem({ message }) {
  return (
    <div className="flex items-start space-x-3 group">
      <UserAvatar user={message.user} />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{message.user.name}</span>
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
        </div>
        <p className="mt-1">{message.content}</p>
        {message.file && (
          <div className="mt-2 flex items-center space-x-2 text-blue-500">
            <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
              {message.file.name}
            </a>
          </div>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-400 hover:text-red-500">
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}