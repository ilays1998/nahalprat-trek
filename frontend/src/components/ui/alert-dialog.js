import React, { useState, createContext, useContext } from 'react';

const AlertDialogContext = createContext();

export function AlertDialog({ children, open, onOpenChange, ...props }) {
  const [isOpen, setIsOpen] = useState(open || false);
  
  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

  if (!isOpen) return null;

  return (
    <AlertDialogContext.Provider value={{ isOpen, handleOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" {...props}>
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({ children, className = "", ...props }) {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function AlertDialogTrigger({ children, onClick, ...props }) {
  const { handleOpenChange } = useContext(AlertDialogContext) || {};
  
  return (
    <div
      onClick={() => {
        if (handleOpenChange) handleOpenChange(true);
        if (onClick) onClick();
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({ children, className = "", ...props }) {
  return (
    <div className={`flex justify-end gap-3 mt-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogCancel({ children, onClick, className = "", ...props }) {
  const { handleOpenChange } = useContext(AlertDialogContext) || {};
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors ${className}`}
      onClick={() => {
        if (handleOpenChange) handleOpenChange(false);
        if (onClick) onClick();
      }}
      {...props}
    >
      {children || 'Cancel'}
    </button>
  );
}

export function AlertDialogAction({ children, onClick, className = "", ...props }) {
  const { handleOpenChange } = useContext(AlertDialogContext) || {};
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors ${className}`}
      onClick={() => {
        if (onClick) onClick();
        if (handleOpenChange) handleOpenChange(false);
      }}
      {...props}
    >
      {children || 'OK'}
    </button>
  );
} 