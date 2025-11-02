import React from "react";
import { X } from "lucide-react";

export const Alert = ({ 
  type = "error", // "error" | "success" | "warning" | "info"
  message, 
  onClose,
  className = "" 
}) => {
  const types = {
    error: "bg-red-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  if (!message) return null;

  return (
    <div 
      className={`${types[type]} text-white px-6 py-4 rounded-lg flex items-start justify-between gap-4 shadow-lg fixed bottom-4 right-4 z-50 max-w-md animate-slide-up ${className}`} // EDIT: เพิ่ม fixed, bottom-4, right-4, z-50, max-w-md, animate-slide-up
      role="alert"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">Attention needed</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0" // EDIT: เพิ่ม flex-shrink-0
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};