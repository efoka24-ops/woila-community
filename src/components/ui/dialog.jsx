import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>{children}</h2>
);

export const DialogContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);
