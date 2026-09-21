import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * TagInput component that allows typing multi-word items with spaces (e.g. "Bitter Gourd", "Peanut Butter")
 * and converts them into dismissible tags when a comma (,) or Enter is pressed, on blur, or when pasted.
 */
export const TagInput = ({
  tags = [],
  onChange,
  placeholder = 'Type item and press comma or Enter...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Check if tag already exists (case-insensitive)
    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if backspace pressed on empty input
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // If user pasted or typed a comma inside the input
    if (val.includes(',')) {
      const parts = val.split(',');
      parts.forEach((p, idx) => {
        if (idx < parts.length - 1) {
          // Add all completed items before the last comma
          addTag(p);
        } else {
          // Keep the remainder after the last comma in the input
          setInputValue(p);
        }
      });
    } else {
      // Allow spaces freely while typing!
      setInputValue(val);
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div
      className={`min-h-[46px] p-2 rounded-2xl border border-gray-200 bg-white/90 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 flex flex-wrap items-center gap-1.5 transition-all ${className}`}
    >
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold animate-in fade-in"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(idx)}
            className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-200/60 p-0.5 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : 'Add more (press comma)...'}
        className="flex-1 min-w-[150px] bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none px-2 py-1 font-medium"
      />
    </div>
  );
};
