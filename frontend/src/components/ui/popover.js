import React from 'react';
export function Popover({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function PopoverContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function PopoverTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
} 