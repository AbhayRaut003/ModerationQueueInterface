import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface EmptyStateProps {
  status: 'pending' | 'approved' | 'rejected';
}

const EmptyState: React.FC<EmptyStateProps> = ({ status }) => {
  const config = {
    pending: {
      icon: Clock,
      title: 'No Pending Posts',
      message: 'All posts have been reviewed. Great job!',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-50',
    },
    approved: {
      icon: CheckCircle,
      title: 'No Approved Posts',
      message: 'No posts have been approved yet.',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-50',
    },
    rejected: {
      icon: XCircle,
      title: 'No Rejected Posts',
      message: 'No posts have been rejected yet.',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-50',
    },
  };

  const { icon: Icon, title, message, iconColor, bgColor } = config[status];

  return (
    <div className="text-center py-12">
      <div className={`mx-auto h-20 w-20 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
        <Icon className={`h-10 w-10 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{message}</p>
    </div>
  );
};

export default EmptyState;