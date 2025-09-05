import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import {
  approvePost,
  rejectPost,
  batchApprove,
  batchReject,
  openModal,
  closeModal,
  clearSelection,
  navigateModal,
} from '../store/moderationSlice';
import { addToast } from '../store/toastSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();
  const { selectedPosts, posts, filter, isModalOpen, currentPost } = useSelector(
    (state: RootState) => state.moderation
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'a':
          event.preventDefault();
          if (selectedPosts.length > 0) {
            const pendingPosts = selectedPosts.filter(id => {
              const post = posts.find(p => p.id === id);
              return post?.status === 'pending';
            });
            
            if (pendingPosts.length > 0) {
              dispatch(batchApprove(pendingPosts));
              dispatch(addToast({
                message: `Approved ${pendingPosts.length} post${pendingPosts.length > 1 ? 's' : ''}`,
                type: 'success',
                canUndo: true,
                undoId: `batch_approve_${Date.now()}`,
              }));
            }
          } else if (currentPost && isModalOpen) {
            const post = posts.find(p => p.id === currentPost);
            if (post?.status === 'pending') {
              dispatch(approvePost(currentPost));
              dispatch(addToast({
                message: 'Post approved',
                type: 'success',
              }));
            }
          }
          break;

        case 'r':
          event.preventDefault();
          if (selectedPosts.length > 0) {
            const pendingPosts = selectedPosts.filter(id => {
              const post = posts.find(p => p.id === id);
              return post?.status === 'pending';
            });
            
            if (pendingPosts.length > 0) {
              dispatch(batchReject(pendingPosts));
              dispatch(addToast({
                message: `Rejected ${pendingPosts.length} post${pendingPosts.length > 1 ? 's' : ''}`,
                type: 'success',
                canUndo: true,
                undoId: `batch_reject_${Date.now()}`,
              }));
            }
          } else if (currentPost && isModalOpen) {
            const post = posts.find(p => p.id === currentPost);
            if (post?.status === 'pending') {
              dispatch(rejectPost(currentPost));
              dispatch(addToast({
                message: 'Post rejected',
                type: 'success',
              }));
            }
          }
          break;

        case ' ':
          event.preventDefault();
          if (selectedPosts.length === 1 && !isModalOpen) {
            dispatch(openModal(selectedPosts[0]));
          }
          break;

        case 'escape':
          event.preventDefault();
          if (isModalOpen) {
            dispatch(closeModal());
          } else if (selectedPosts.length > 0) {
            dispatch(clearSelection());
          }
          break;

        case 'arrowleft':
          if (isModalOpen) {
            event.preventDefault();
            dispatch(navigateModal('prev'));
          }
          break;

        case 'arrowright':
          if (isModalOpen) {
            event.preventDefault();
            dispatch(navigateModal('next'));
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selectedPosts, posts, filter, isModalOpen, currentPost]);
};