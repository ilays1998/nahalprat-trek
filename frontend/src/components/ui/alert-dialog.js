import React from 'react';
export function AlertDialog({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogTitle({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogHeader({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogDescription({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogFooter({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function AlertDialogCancel({ children, ...props }) {
  return <button {...props}>{children || 'Cancel'}</button>;
}
export function AlertDialogAction({ children, ...props }) {
  return <button {...props}>{children || 'OK'}</button>;
} 