import React from 'react';

export function Alert({ children, className = "", variant, ...props }) {
  const base = "flex items-start gap-2 rounded-lg p-4";
  const variants = {
    default: "border border-amber-200 bg-amber-50 text-amber-800",
    destructive: "border border-red-200 bg-red-50 text-red-800",
    success: "border border-green-200 bg-green-50 text-green-800",
  };
  const variantClass = variants[variant] || variants.default;
  return (
    <div className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
export function AlertDescription({ children, className = "", ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}