import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setFilter } from '../store/moderationSlice';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusTabs: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, filter } = useSelector((state: RootState) => state.moderation);

  const pendingCount = posts.filter(post => post.status === 'pending').length;
  const approvedCount = posts.filter(post => post.status === 'approved').length;
  const rejectedCount = posts.filter(post => post.status === 'rejected').length;

  const tabs = [
    {
      id: 'pending' as const,
      label: 'Pending',
      count: pendingCount,
      icon: Clock,
      color: 'border-yellow-500 text-yellow-600 bg-yellow-50',
      inactiveColor: 'text-gray-600 hover:text-yellow-600',
    },
    {
      id: 'approved' as const,
      label: 'Approved',
      count: approvedCount,
      icon: CheckCircle,
      color: 'border-green-500 text-green-600 bg-green-50',
      inactiveColor: 'text-gray-600 hover:text-green-600',
    },
    {
      id: 'rejected' as const,
      label: 'Rejected',
      count: rejectedCount,
      icon: XCircle,
      color: 'border-red-500 text-red-600 bg-red-50',
      inactiveColor: 'text-gray-600 hover:text-red-600',
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-2 sm:space-x-8 px-3 sm:px-0 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setFilter(tab.id))}
              className={`
                group inline-flex items-center py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0
                ${isActive 
                  ? `${tab.color} border-b-2` 
                  : `border-transparent ${tab.inactiveColor} hover:border-gray-200`
                }
              `}
            >
              <Icon className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {tab.label}
              <span className={`
                ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2.5 rounded-full text-xs font-medium
                ${isActive 
                  ? 'bg-white text-gray-900' 
                  : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200'
                }
              `}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default StatusTabs;