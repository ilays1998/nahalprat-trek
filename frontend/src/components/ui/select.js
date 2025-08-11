import React from 'react';

export function Select({ children, className = "", ...props }) {
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
    "shadow-sm",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-amber-500",
    "focus:border-amber-500",
    "transition",
  ].join(" ");
  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  );
}
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ children, ...props }) { return <option {...props}>{children}</option>; }
export function SelectTrigger({ children }) { return <>{children}</>; }
export function SelectValue({ children }) { return <>{children}</>; }