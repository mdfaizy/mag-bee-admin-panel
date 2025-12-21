"use client";

import type React from "react";
import { useState } from "react";

interface ChipInputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  value?: string[];
  onChange?: (chips: string[]) => void;
}

const ChipInput: React.FC<ChipInputProps> = ({
  label,
  placeholder = "Type and press Enter or comma",
  className = "",
  disabled = false,
  id,
  value = [],
  onChange,
}) => {
  const [chips, setChips] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      const newChip = inputValue.trim();
      if (!chips.includes(newChip)) {
        const updatedChips = [...chips, newChip];
        setChips(updatedChips);
        onChange?.(updatedChips);
      }
      setInputValue("");
    }
  };

  const removeChip = (indexToRemove: number) => {
    const updatedChips = chips.filter((_, index) => index !== indexToRemove);
    setChips(updatedChips);
    onChange?.(updatedChips);
  };

  return (
    <div className={`space-y-2 ${disabled ? "opacity-60" : ""}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center gap-2 border rounded px-3 py-2 min-h-[48px] ${className} ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center px-2 py-1 text-sm bg-gray-200 rounded-full"
          >
            {chip}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeChip(index)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none outline-none bg-transparent text-sm min-w-[120px]"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default ChipInput;
