import React, { useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useAuth } from '../contexts/authentication';
import AuthModal from './AuthModel';

const CommentPost = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Jacob Lash",
      avatar: "JL",
      date: "12 September 2004 at 18:30",
      content:
        "Great article! I learned so much about cats. My cat does exactly what you described.",
    },
    {
      id: 2,
      name: "Ahri",
      avatar: "A",
      date: "12 September 2004 at 18:30",
      content:
        "This is very informative. Thank you for sharing your knowledge about feline behavior.",
    },
    {
      id: 3,
      name: "Mimi mama",
      avatar: "MM",
      date: "12 September 2004 at 18:30",
      content:
        "I love cats! This article perfectly captures why they are such amazing companions.",
    },
  ]);

  const { isAuthenticated } = useAuth();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      name: "Anonymous User",
      avatar: "AU",
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: newComment,
    };

    setComments([...comments, comment]);
    setNewComment("");
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
              className="rounded-full self-end px-8 py-4 bg-gray-800 text-white font-medium hover:bg-gray-700"
            >
              Send
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-10">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-gray-500">
                  {comment.avatar}
                </span>
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 className="font-bold text-gray-800">{comment.name}</h4>
                  <span className="text-xs text-gray-400">{comment.date}</span>
                </div>
                <p className="font-serif text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentPost;