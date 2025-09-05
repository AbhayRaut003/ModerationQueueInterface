import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ModerationState, Post } from '../types';
import { mockPosts } from '../data/mockData';

const initialState: ModerationState = {
  posts: mockPosts,
  selectedPosts: [],
  currentPost: null,
  isModalOpen: false,
  filter: "pending",
  loading: false,
  error: null,
  undoStack: [],
  currentPage: 1,
};

const moderationSlice = createSlice({
  name: "moderation",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<"pending" | "approved" | "rejected">
    ) => {
      state.filter = action.payload;
      state.currentPage = 1;
      state.selectedPosts = [];
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    togglePostSelection: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const index = state.selectedPosts.indexOf(postId);
      if (index > -1) {
        state.selectedPosts.splice(index, 1);
      } else {
        state.selectedPosts.push(postId);
      }
    },

    selectAllPosts: (state, action: PayloadAction<string[]>) => {
      state.selectedPosts = action.payload;
    },

    clearSelection: (state) => {
      state.selectedPosts = [];
    },

    approvePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post && post.status === "pending") {
        post.status = "approved";
      }
    },

    rejectPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post && post.status === "pending") {
        post.status = "rejected";
      }
    },

    batchApprove: (state, action: PayloadAction<string[]>) => {
      const postIds = action.payload;
      const previousStates: Array<{
        id: string;
        previousStatus: Post["status"];
      }> = [];

      postIds.forEach((id) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          previousStates.push({ id, previousStatus: post.status });
          if (post.status === "pending") {
            post.status = "approved";
          }
        }
      });

      // Add to undo stack
      state.undoStack.push({
        id: `batch_approve_${Date.now()}`,
        posts: previousStates,
        action: "batch_approve",
        timestamp: Date.now(),
      });

      // Keep only last 5 undo actions
      if (state.undoStack.length > 5) {
        state.undoStack.shift();
      }

      state.selectedPosts = [];
    },

    batchReject: (state, action: PayloadAction<string[]>) => {
      const postIds = action.payload;
      const previousStates: Array<{
        id: string;
        previousStatus: Post["status"];
      }> = [];

      postIds.forEach((id) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          previousStates.push({ id, previousStatus: post.status });
          if (post.status === "pending") {
            post.status = "rejected";
          }
        }
      });

      // Add to undo stack
      state.undoStack.push({
        id: `batch_reject_${Date.now()}`,
        posts: previousStates,
        action: "batch_reject",
        timestamp: Date.now(),
      });

      // Keep only last 5 undo actions
      if (state.undoStack.length > 5) {
        state.undoStack.shift();
      }

      state.selectedPosts = [];
    },

    openModal: (state, action: PayloadAction<string>) => {
      state.currentPost = action.payload;
      state.isModalOpen = true;
    },

    closeModal: (state) => {
      state.currentPost = null;
      state.isModalOpen = false;
    },

    navigateModal: (state, action: PayloadAction<"next" | "prev">) => {
      if (!state.currentPost) return;

      const filteredPosts = state.posts.filter(
        (post) => post.status === state.filter
      );
      const currentIndex = filteredPosts.findIndex(
        (post) => post.id === state.currentPost
      );

      if (
        action.payload === "next" &&
        currentIndex < filteredPosts.length - 1
      ) {
        state.currentPost = filteredPosts[currentIndex + 1].id;
      } else if (action.payload === "prev" && currentIndex > 0) {
        state.currentPost = filteredPosts[currentIndex - 1].id;
      }
    },

    undoAction: (state, action: PayloadAction<string>) => {
      const undoIndex = state.undoStack.findIndex(
        (item) => item.id === action.payload
      );
      if (undoIndex > -1) {
        const undoItem = state.undoStack[undoIndex];

        // Restore previous states
        undoItem.posts.forEach(({ id, previousStatus }) => {
          const post = state.posts.find((p) => p.id === id);
          if (post) {
            post.status = previousStatus;
          }
        });

        // Remove from undo stack
        state.undoStack.splice(undoIndex, 1);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFilter,
  changePage,
  togglePostSelection,
  selectAllPosts,
  clearSelection,
  approvePost,
  rejectPost,
  batchApprove,
  batchReject,
  openModal,
  closeModal,
  navigateModal,
  undoAction,
  setLoading,
  setError,
} = moderationSlice.actions;

export default moderationSlice.reducer;