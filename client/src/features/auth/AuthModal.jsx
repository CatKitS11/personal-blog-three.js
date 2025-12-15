import React from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, action = "interact with" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };
  const handleSignUp = () => {
    navigate("/signup");
    onClose();
  };

  return (
    <>
      {/* BACKDROP - Blurred background */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* MODAL DIALOG */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-[#F9F8F6] rounded-2xl shadow-xl p-8 max-w-md w-full mx-8 relative pointer-events-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="flex text-3xl font-bold text-[#333333] my-2 py-8">
            Create an account to continue
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mb-8 mt-4">
            <button
              onClick={handleSignUp}
              className="px-8 py-3 bg-[#333333] text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
            >
              Create account
            </button>
          </div>
          <div className="text-[#75716B] mb-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleLogin}
              className="mx-2 text-underline text-gray-700 font-medium hover:text-gray-600 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;


