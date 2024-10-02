import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import UserAvatar from '../common/UserAvatar';

export default function LeftSidebar({ content }) {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <Button className="mb-4 w-full">New Message</Button>
      <nav className="space-y-1">
        {content.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
              location.pathname === item.path ? 'bg-gray-100' : ''
            }`}
          >
            {item.type === 'user' ? (
              <UserAvatar user={item} className="mr-2 h-8 w-8" />
            ) : (
              <span className="mr-2 text-lg">#</span>
            )}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}