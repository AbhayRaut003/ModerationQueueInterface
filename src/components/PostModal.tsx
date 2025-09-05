import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { 
  closeModal, 
  navigateModal, 
  approvePost, 
  rejectPost 
} from '../store/moderationSlice';
import { addToast } from '../store/toastSlice';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  User, 
  Clock, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

const PostModal: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, currentPost, isModalOpen, filter } = useSelector(
    (state: RootState) => state.moderation
  );

  const post = posts.find(p => p.id === currentPost);
  const filteredPosts = posts.filter(p => p.status === filter);
  const currentIndex = filteredPosts.findIndex(p => p.id === currentPost);
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < filteredPosts.length - 1;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  if (!isModalOpen || !post) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleApprove = () => {
    dispatch(approvePost(post.id));
    dispatch(addToast({
      message: 'Post approved',
      type: 'success',
    }));
  };

  const handleReject = () => {
    dispatch(rejectPost(post.id));
    dispatch(addToast({
      message: 'Post rejected',
      type: 'success',
    }));
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handlePrevious = () => {
    if (canNavigatePrev) {
      dispatch(navigateModal('prev'));
    }
  };

  const handleNext = () => {
    if (canNavigateNext) {
      dispatch(navigateModal('next'));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full mx-4 sm:mx-0">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900" id="modal-title">
                  Post Details
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {currentIndex + 1} of {filteredPosts.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={!canNavigatePrev}
                  className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous post (← key)"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!canNavigateNext}
                  className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next post (→ key)"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                
                <button
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close modal (Esc key)"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 max-h-80 sm:max-h-96 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium">{post.author.username}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{formatDate(post.reportedAt)}</span>
                    <span className="sm:hidden">{new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }).format(new Date(post.reportedAt))}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{post.reportCount} report{post.reportCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Attached Images ({post.images.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post attachment ${index + 1}`}
                          className="w-full h-40 sm:h-48 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Report Information</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Reason:</span>
                    <span className="ml-2 text-gray-600">{post.reportedReason}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Report Count:</span>
                    <span className="ml-2 text-gray-600">{post.reportCount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reported At:</span>
                    <span className="ml-2 text-gray-600 hidden sm:inline">{formatDate(post.reportedAt)}</span>
                    <span className="ml-2 text-gray-600 sm:hidden">{new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(post.reportedAt))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {post.status === 'pending' && (
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleReject}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Reject (R key)</span>
                <span className="sm:hidden">Reject</span>
              </button>
              
              <button
                onClick={handleApprove}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Approve (A key)</span>
                <span className="sm:hidden">Approve</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;