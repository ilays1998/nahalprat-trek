import React from 'react';

export function Dialog({ children, open, onOpenChange, ...props }) {
  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange && onOpenChange(false)}
      {...props}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "", ...props }) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 