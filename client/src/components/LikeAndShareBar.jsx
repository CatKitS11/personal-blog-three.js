import React, { useState } from 'react';
import { Heart, Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';

const LikeAndShareBar = ({ postId, likes = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    // You can add a toast notification here
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${postId}`;
    const title = document.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 my-8">
      {/* Like Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 ${
            isLiked ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </Button>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="text-gray-600"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy link
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="text-blue-600 hover:text-blue-700"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('linkedin')}
          className="text-blue-700 hover:text-blue-800"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="text-blue-400 hover:text-blue-500"
        >
          <Twitter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LikeAndShareBar;
