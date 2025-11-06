import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CardAuthor from "./CardAuthor";
import LikeAndShareBar from "./LikeAndShareBar";
import CommentPost from "./CommentPost";
import { useBlogPost } from "../hooks/useBlogPostId";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
          <p className="text-red-500 text-lg mb-4">
            Error loading post: {error}
          </p>
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
    <div className="max-w-7xl mx-auto max-md:mx-0 max-md:max-w-full px-12 max-md:px-0 py-8">
      <div className="mb-8">
        <img
          src={post.image || "/placeholder-image.jpg"}
          alt={post.title}
          className="w-full h-120 max-md:h-64 object-cover rounded-lg max-md:rounded-none"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-md:px-4">
        {/* Main Content */}
        <div className="lg:col-span-3 markdown">
          {/* Post Image */}

          {/* Post Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              {post.title}
            </h1>

            {/* Post Excerpt */}
            <p className="flex flex-row items-start text-lg text-gray-600 leading-relaxed mb-8">
              {post.description}
            </p>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none text-left">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="rounded-lg shadow-md my-6 w-full object-cover"
                    style={{ maxHeight: '500px' }}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-gray-900" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-2xl font-bold mt-6 mb-3 text-gray-800" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-xl font-bold mt-4 mb-2 text-gray-800" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 leading-relaxed text-gray-700" />
                ),
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside my-4 space-y-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside my-4 space-y-2" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600"
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code {...props} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" />
                  ) : (
                    <code {...props} className="block bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm" />
                  ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Like and Share Bar */}
          <LikeAndShareBar postId={postId} likes={post.likes_count || 0} />

          {/* Comments */}
          <CommentPost postId={postId} className="" />
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
