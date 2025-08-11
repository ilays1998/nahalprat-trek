import React from 'react';

export function Textarea({ children, className = "", ...props }) {
  const baseClasses = [
    "block",
    "w-full",
    "rounded-lg",
    "border",
    "border-gray-300",
    "bg-white",
    "px-3",
    "py-2.5",
    "text-gray-900",
    "placeholder-gray-400",
    "shadow-sm",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-amber-500",
    "focus:border-amber-500",
    "transition",
    "resize-y",
  ].join(" ");

  return (
    <textarea className={`${baseClasses} ${className}`} {...props}>
      {children}
    </textarea>
  );
}