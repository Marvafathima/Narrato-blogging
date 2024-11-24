import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';

const UserPostsGrid = ({ posts = [], postsPerPage = 9 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info Section */}
      {posts.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={posts[0].user.profile_pic}
              alt={posts[0].user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{posts[0].user.username}</h2>
            <p className="text-gray-600">
              {posts[0].user.email}
            </p>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group relative"
          >
            {/* Post Image */}
            <div className="aspect-square relative">
              <img
                src={post.post_images[0]?.post_image || `/api/placeholder/400/400`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    <span>Comment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{post.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {formatDate(post.created_at)}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPostsGrid;