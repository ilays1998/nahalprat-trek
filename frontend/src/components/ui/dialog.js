import React from 'react';
export function Dialog({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function DialogContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
} 