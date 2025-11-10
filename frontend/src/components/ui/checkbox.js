import React from 'react';

export function Checkbox({ 
  className = "", 
  checked = false,
  onCheckedChange,
  ...props 
}) {
  const baseStyles = "h-4 w-4 rounded border-2 border-gray-300 text-desert-600 focus:ring-2 focus:ring-desert-500 focus:ring-offset-2 focus:border-desert-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <input 
      type="checkbox"
      className={`${baseStyles} ${className}`}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}