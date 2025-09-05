import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import PostCard from './PostCard';
import EmptyState from './EmptyState';


const PostList: React.FC = () => {
  const { posts, filter, loading } = useSelector((state: RootState) => state.moderation);
  const filteredPosts = posts.filter(post => post.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex space-x-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return <EmptyState status={filter} />;
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
     
    </div>
  );
};

export default PostList;