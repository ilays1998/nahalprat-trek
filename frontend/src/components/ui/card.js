import React from 'react';

export function Card({ children, className = "", ...props }) {
  const base = "rounded-xl border border-gray-200 bg-white shadow-sm";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardContent({ children, className = "", ...props }) {
  const base = "p-6";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardHeader({ children, className = "", ...props }) {
  const base = "p-6 pb-0";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardTitle({ children, className = "", ...props }) {
  const base = "text-lg font-semibold";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardFooter({ children, className = "", ...props }) {
  const base = "p-6 pt-0";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}