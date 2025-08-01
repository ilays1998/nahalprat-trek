import React from 'react';
export function Textarea({ children, ...props }) {
  return <textarea {...props}>{children}</textarea>;
} 