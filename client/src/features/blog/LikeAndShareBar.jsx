import React, { useState } from "react";
import { Heart, Copy, Check, Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authentication";
import AuthModal from "@/features/auth/AuthModal";
import { useLike } from "@/hooks/useLike";

const LikeAndShareBar = ({ postId, likes = 0 }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();

  const { isLiked, likeCount, toggleLike, loading } = useLike(postId, likes);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    await toggleLike();
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = `${window.location.origin}/post/${postId}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${postId}`;
    const encodedUrl = encodeURIComponent(url);
    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="like"
      />

      <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 my-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className={`${copied ? "text-green-600" : "text-gray-600"}`}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}{" "}
            {copied ? "Copied!" : "Copy link"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="text-blue-600 hover:text-blue-700"
          >
            <Facebook className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare("linkedin")}
            className="text-blue-700 hover:text-blue-800"
          >
            <Linkedin className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="text-blue-400 hover:text-blue-500"
          >
            <Twitter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default LikeAndShareBar;


