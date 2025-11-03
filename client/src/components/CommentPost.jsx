import React, { useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useAuth } from "../contexts/authentication";
import AuthModal from "./AuthModel";
import { useComments } from "../hooks/useComments";

const CommentPost = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { comments, loading, error, addComment } = useComments(postId);
  // const [comments, setComments] = useState([
  //   {
  //     id: 1,
  //     name: "Jacob Lash",
  //     avatar: "JL",
  //     date: "12 September 2004 at 18:30",
  //     content:
  //       "Great article! I learned so much about cats. My cat does exactly what you described.",
  //   },
  //   {
  //     id: 2,
  //     name: "Ahri",
  //     avatar: "A",
  //     date: "12 September 2004 at 18:30",
  //     content:
  //       "This is very informative. Thank you for sharing your knowledge about feline behavior.",
  //   },
  //   {
  //     id: 3,
  //     name: "Mimi mama",
  //     avatar: "MM",
  //     date: "12 September 2004 at 18:30",
  //     content:
  //       "I love cats! This article perfectly captures why they are such amazing companions.",
  //   },
  // ]);

  const { isAuthenticated } = useAuth();

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* EDIT: ใช้ AuthModal component แทน */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="comment on"
      />

      <div className="mt-8">
        <div className="flex text-xl font-medium text-[#75716B] mb-4">
          Comment
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-10">
          <div className="flex flex-col gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 resize-y"
            />
            <Button
              type="submit"
              className="rounded-full self-end px-10 py-6 bg-gray-800 text-white font-medium text-md hover:bg-gray-700"
            >
              Send
            </Button>
          </div>
        </form>

        {/* Comments List */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-gray-500">Loading comments...</div>}
        <div className="flex flex-col gap-10">
        {([...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          ).map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col items-start gap-4 border-b border-gray-300 pb-8"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {comment.avatarUrl ? (
                  <div className="w-12 h-12  bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={comment.avatarUrl}
                      alt={comment.name}
                      className="w-full aspect-[4/5] rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-gray-500">
                      {comment.name?.[0] || "U"}
                    </span>
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex">
                  <div className="flex flex-col items-start gap-3 mb-2">
                    <div className="font-bold text-gray-800">
                      {comment.name}
                    </div>
                    <span className="text-xs text-gray-400">
                      {comment.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex text-gray-700 leading-relaxed">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentPost;
