import React from 'react';

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center';
    const variants = {
      default: 'bg-blue-900 text-white hover:bg-blue-800',
      outline: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50'
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
