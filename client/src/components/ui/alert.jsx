import React from "react";
import { X } from "lucide-react";

export const Alert = ({ 
  type = "error" | "success" | "warning" | "info",
  message, 
  content,
  onClose,
  className = "",
  variant = "fixed" // "fixed" | "inline" // EDIT: เพิ่ม variant prop
}) => {
  const types = {
    error: "bg-red-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  if (!message) return null;

  const positionClasses = variant === "fixed" 
    ? "fixed bottom-4 right-4 z-50" 
    : "relative w-full";

  return (
    <div 
      className={`${types[type]} text-white px-6 py-4 rounded-lg flex items-start justify-between gap-4 shadow-lg ${positionClasses} w-auto ${variant === "fixed" ? "animate-slide-up" : ""} ${className}`}
      role="alert"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1 whitespace-nowrap">{message}</h3>
        <p className="text-sm opacity-90">{content}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};