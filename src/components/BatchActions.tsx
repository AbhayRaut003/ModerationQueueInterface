import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { 
  selectAllPosts, 
  clearSelection, 
  batchApprove, 
  batchReject 
} from '../store/moderationSlice';
import { addToast } from '../store/toastSlice';
import { CheckCircle, XCircle, Square, CheckSquare } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const BatchActions: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, selectedPosts, filter } = useSelector((state: RootState) => state.moderation);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const filteredPosts = posts.filter(post => post.status === filter);
  const pendingPosts = filteredPosts.filter(post => post.status === 'pending');
  const selectedPendingPosts = selectedPosts.filter(id => {
    const post = posts.find(p => p.id === id);
    return post?.status === 'pending';
  });

  const isAllSelected = pendingPosts.length > 0 && 
    pendingPosts.every(post => selectedPosts.includes(post.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllPosts(pendingPosts.map(post => post.id)));
    }
  };

  const handleBatchApprove = () => {
    if (selectedPendingPosts.length > 0) {
      dispatch(batchApprove(selectedPendingPosts));
      dispatch(addToast({
        message: `Approved ${selectedPendingPosts.length} post${selectedPendingPosts.length > 1 ? 's' : ''}`,
        type: 'success',
        canUndo: true,
        undoId: `batch_approve_${Date.now()}`,
      }));
    }
  };

  const handleBatchReject = () => {
    if (selectedPendingPosts.length > 0) {
      dispatch(batchReject(selectedPendingPosts));
      dispatch(addToast({
        message: `Rejected ${selectedPendingPosts.length} post${selectedPendingPosts.length > 1 ? 's' : ''}`,
        type: 'success',
        canUndo: true,
        undoId: `batch_reject_${Date.now()}`,
      }));
    }
    setShowRejectConfirm(false);
  };

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {pendingPosts.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>
                  <span className="hidden sm:inline">
                    {isAllSelected ? 'Deselect All' : `Select All (${pendingPosts.length})`}
                  </span>
                  <span className="sm:hidden">
                    {isAllSelected ? 'Deselect' : `All (${pendingPosts.length})`}
                  </span>
                </span>
              </button>
            )}
            
            {selectedPosts.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-600">
                {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {selectedPendingPosts.length > 0 && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleBatchApprove}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Approve ({selectedPendingPosts.length})</span>
                <span className="sm:hidden">Approve</span>
              </button>
              
              <button
                onClick={() => setShowRejectConfirm(true)}
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reject ({selectedPendingPosts.length})</span>
                <span className="sm:hidden">Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleBatchReject}
        title="Confirm Batch Rejection"
        message={`Are you sure you want to reject ${selectedPendingPosts.length} post${selectedPendingPosts.length > 1 ? 's' : ''}? This action can be undone.`}
        confirmText="Reject"
        confirmVariant="danger"
      />
    </>
  );
};

export default BatchActions;