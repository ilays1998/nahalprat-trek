import React from 'react';

export const Textarea = React.forwardRef(({ children, className = "", ...props }, ref) => {
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
    "focus:ring-desert-500",
    "focus:border-desert-500",
    "transition",
    "resize-y",
  ].join(" ");

  return (
    <textarea ref={ref} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </textarea>
  );
});

Textarea.displayName = 'Textarea';