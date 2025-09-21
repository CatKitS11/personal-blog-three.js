import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CardAuthor from './CardAuthor';
import LikeAndShareBar from './LikeAndShareBar';
import CommentPost from './CommentPost';
import { useBlogPost } from '../hooks/useBlogPostId';

const BlogDetail = () => {
  const { postId } = useParams();
  const { post, loading, error } = useBlogPost(postId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg">Loading post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error loading post: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Post Image */}
          <div className="mb-8">
            <img
              src={post.image || '/placeholder-image.jpg'}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Post Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            {/* Post Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              {post.title}
            </h1>
            
            {/* Post Excerpt */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Like and Share Bar */}
          <LikeAndShareBar postId={postId} likes={post.likes || 0} />

          {/* Comments */}
          <CommentPost postId={postId} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CardAuthor author={post.author} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
