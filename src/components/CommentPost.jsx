import React, { useState } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

const CommentPost = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Jacob Lash',
      avatar: 'JL',
      date: '12 September 2004 at 18:30',
      content: 'Great article! I learned so much about cats. My cat does exactly what you described.'
    },
    {
      id: 2,
      name: 'Ahri',
      avatar: 'A',
      date: '12 September 2004 at 18:30',
      content: 'This is very informative. Thank you for sharing your knowledge about feline behavior.'
    },
    {
      id: 3,
      name: 'Mimi mama',
      avatar: 'MM',
      date: '12 September 2004 at 18:30',
      content: 'I love cats! This article perfectly captures why they are such amazing companions.'
    }
  ]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      name: 'Anonymous User',
      avatar: 'AU',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      content: newComment
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Comment</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <Button type="submit" className="self-start px-6">
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-gray-600">
                {comment.avatar}
              </span>
            </div>
            
            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-1">
                <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPost;
