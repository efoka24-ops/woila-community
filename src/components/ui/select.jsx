import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ value, onValueChange, children, required = false }) => {
  return children({ value, onValueChange });
};

export const SelectTrigger = ({ children, className = '', onClick, value }) => (
  <button
    onClick={onClick}
    type="button"
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-white ${className}`}
  >
    {children}
    <ChevronDown className="w-4 h-4 text-gray-400" />
  </button>
);

export const SelectValue = ({ placeholder = 'Select...', children }) => (
  <span className={children ? 'text-gray-900' : 'text-gray-500'}>{children || placeholder}</span>
);

export const SelectContent = ({ children, open, position = 'bottom' }) => {
  if (!open) return null;
  return (
    <div className={`absolute ${position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50`}>
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect?.(value)}
    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
  >
    {children}
  </button>
);
