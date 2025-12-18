import React from 'react';

export const Badge = ({ className = '', ...props }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${className}`}
    {...props}
  />
);
