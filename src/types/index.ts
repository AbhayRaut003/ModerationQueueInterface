export interface User {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  reportedReason: string;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
  images?: string[];
}

export interface ModerationState {
  posts: Post[];
  selectedPosts: string[];
  currentPost: string | null;
  isModalOpen: boolean;
  filter: 'pending' | 'approved' | 'rejected';
  loading: boolean;
  error: string | null;
  undoStack: Array<{
    id: string;
    posts: Array<{ id: string; previousStatus: Post['status'] }>;
    action: string;
    timestamp: number;
  }>;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  canUndo?: boolean;
  undoId?: string;
}