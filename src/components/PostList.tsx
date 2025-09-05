import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import PostCard from "./PostCard";
import EmptyState from "./EmptyState";
import {changePage} from "../store/moderationSlice"

const ITEMS_PER_PAGE = 10; // how many posts per page

const PostList: React.FC = () => {
    const dispatch = useDispatch();
  const { posts, filter, loading,currentPage } = useSelector(
    (state: RootState) => state.moderation
  );
  // const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = posts.filter((post) => post.status === filter);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  // Ensure currentPage never goes beyond total pages
  const safePage = Math.min(currentPage, totalPages || 1);

  // Slice posts for current page
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
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
    <div className="space-y-6">
      <div className="space-y-4">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={safePage === 1}
            onClick={() => dispatch(changePage(Math.max(safePage - 1, 1)))}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch(changePage(i + 1))}
              className={`px-3 py-1 border rounded ${
                safePage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={safePage === totalPages}
            onClick={() => dispatch(changePage(Math.min(safePage + 1, totalPages)))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
