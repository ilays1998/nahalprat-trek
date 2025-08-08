import React from 'react';

const buttonVariants = {
  default: "btn-primary",
  primary: "btn-primary", 
  secondary: "btn-secondary",
  outline: "px-6 py-3 border-2 border-amber-200 text-amber-700 bg-white hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 rounded-lg font-medium shadow-sm hover:shadow-md",
  ghost: "px-6 py-3 text-amber-700 hover:bg-amber-50 transition-all duration-300 rounded-lg font-medium",
  destructive: "px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
};

const buttonSizes = {
  default: "",
  sm: "px-4 py-2 text-sm",
  lg: "px-8 py-4 text-lg",
  icon: "p-3"
};

export function Button({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = buttonVariants[variant] || buttonVariants.default;
  const sizeStyles = buttonSizes[size] || buttonSizes.default;
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
} 