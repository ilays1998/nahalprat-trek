import React from 'react';

export function Label({ children, className = "", ...props }) {
  const baseClasses = "block text-sm font-medium text-gray-700";
  return (
    <label className={`${baseClasses} ${className}`} {...props}>
      {children}
    </label>
  );
}