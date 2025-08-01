import React from 'react';
export function Select({ children, ...props }) {
  return <select {...props}>{children}</select>;
}
export function SelectContent({ children, ...props }) {
  return <>{children}</>;
}
export function SelectItem({ children, ...props }) {
  return <option {...props}>{children}</option>;
}
export function SelectTrigger({ children, ...props }) {
  return <>{children}</>;
}
export function SelectValue({ children, ...props }) {
  return <>{children}</>;
} 