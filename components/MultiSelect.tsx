import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps<T extends string> {
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

function MultiSelect<T extends string>({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  icon,
  className = '',
  maxHeight = 'max-h-60'
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: T) => {
    if (disabled) return;
    
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    
    onChange(newSelected);
  };

  const removeOption = (option: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selected.filter(item => item !== option));
  };

  const displayText = selected.length === 0 
    ? placeholder 
    : selected.length === 1 
      ? selected[0] 
      : `${selected.length} selected`;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className={`truncate ${selected.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
            {displayText}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Selected Tags (shown below button) */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(option => (
            <span
              key={option}
              className="inline-flex items-center gap-1 px-2 py-1 bg-brand-500 text-white text-xs font-medium rounded-md"
            >
              {option}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => removeOption(option, e)}
                  className="hover:bg-brand-600 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg ${maxHeight} overflow-y-auto`}>
          <div className="py-1">
            {options.map(option => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex-1 text-left">{option}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
