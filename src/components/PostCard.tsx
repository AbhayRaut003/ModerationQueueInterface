import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import type { Post } from '../types';
import { 
  togglePostSelection, 
  approvePost, 
  rejectPost, 
  openModal 
} from '../store/moderationSlice';
import { addToast } from '../store/toastSlice';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  User, 
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const dispatch = useDispatch();
  const { selectedPosts } = useSelector((state: RootState) => state.moderation);
  const isSelected = selectedPosts.includes(post.id);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusIcon = () => {
    switch (post.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };

    const config = statusConfig[post.status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getReportBadge = () => {
    const severityConfig = post.reportCount >= 5 
      ? { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-600' }
      : post.reportCount >= 3
      ? { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' }
      : { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityConfig.bg} ${severityConfig.text}`}>
        <AlertTriangle className={`h-3 w-3 mr-1 ${severityConfig.icon}`} />
        {post.reportCount} report{post.reportCount !== 1 ? 's' : ''}
      </span>
    );
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(approvePost(post.id));
    dispatch(addToast({
      message: 'Post approved',
      type: 'success',
    }));
  };

  const openConfirmationModal = (e: React.MouseEvent) =>{
    e.stopPropagation();
    setShowRejectConfirm(true)
  }
  const handleReject = () => {
    dispatch(rejectPost(post.id));
    dispatch(addToast({
      message: 'Post rejected',
      type: 'success',
    }));
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(post.id));
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(togglePostSelection(post.id));
  };

  return (
    <div 
      className={`
        bg-white rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer
        ${isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200'}
      `}
      onClick={() => post.status === "pending" && dispatch(togglePostSelection(post.id))}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1">
            {post.status === "pending" &&<button
              onClick={handleSelect}
              className="mt-1 flex-shrink-0 hover:bg-gray-100 rounded p-1 transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              ) : (
                <Square className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              )}
            </button>}
            
            <div className="flex-1 min-w-0">
              <h3 
                className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                onClick={handleView}
              >
                {post.title}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium">{post.author.username}</span>
                </div>
                
                <span className="hidden sm:inline">•</span>
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatDate(post.reportedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2 sm:ml-4">
            {getStatusIcon()}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {getStatusBadge()}
            {getReportBadge()}
            
            <span className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Reason: </span>
              <span className="font-medium text-gray-900">{post.reportedReason}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleView}
              className="inline-flex items-center px-2 sm:px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
              <span className="hidden sm:inline ml-1.5">View</span>
            </button>
            
            {post.status === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline ml-1.5">Approve</span>
                </button>
                
                <button
                  onClick={openConfirmationModal}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline ml-1.5">Reject</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
         <ConfirmDialog
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleReject}
        title="Confirm Batch Rejection"
        message={`Are you sure you want to reject this post? This action can be undone.`}
        confirmText="Reject"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PostCard;