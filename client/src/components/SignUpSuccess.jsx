import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import successImage from "../assets/Frame 427321234.svg";

const SignUpSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#EFEEEB] rounded-xl px-12 py-6 mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 mt-10">
            <img src={successImage} alt="Success" className="w-12 h-12" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 mt-10">
          Registration success
        </h1>

        {/* Continue Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-1/2 py-4 px-6 my-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignUpSuccess;