import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onValueChange, placeholder, options = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onValueChange(opt);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
