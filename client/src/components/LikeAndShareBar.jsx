import React, { useState } from "react";
import { Heart, Copy, Check, Facebook, Linkedin, Twitter } from "lucide-react"; // EDIT: เพิ่ม Check icon
import { Button } from "./ui/button";
import { useAuth } from "../contexts/authentication";
import AuthModal from "./AuthModel";
import { useLike } from "../hooks/useLike";

const LikeAndShareBar = ({ postId, likes = 0 }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false); // EDIT: เพิ่ม state สำหรับ copy feedback
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
    // EDIT: เปลี่ยนเป็น async
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url); // EDIT: ใช้ await

      setCopied(true); // EDIT: แสดง feedback

      // EDIT: รีเซ็ตกลับเป็นปกติหลัง 2 วินาที
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error); // EDIT: จัดการ error
      // Fallback สำหรับ browser เก่า
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

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="like"
      />

      <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 my-8">
        {/* Like Button */}
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

        {/* Share Buttons */}
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
