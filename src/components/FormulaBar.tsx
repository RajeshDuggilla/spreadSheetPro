import React, { useState, useEffect } from 'react';

interface FormulaBarProps {
  selectedCell: string;
  cellValue: string;
  onCellValueChange: (value: string) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  cellValue,
  onCellValueChange,
}) => {
  const [value, setValue] = useState(cellValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(cellValue);
  }, [cellValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`📊 Formula bar: Updating cell ${selectedCell} with value: "${value}"`);
    onCellValueChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log(`⏎ Formula bar: Enter pressed - committing value "${value}" to cell ${selectedCell}`);
      onCellValueChange(value);
    }
    if (e.key === 'Escape') {
      console.log(`🚫 Formula bar: Escape pressed - reverting to original value "${cellValue}"`);
      setValue(cellValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    console.log(`🎯 Formula bar: Focused on cell ${selectedCell}`);
  };

  const handleBlur = () => {
    setIsFocused(false);
    console.log(`👋 Formula bar: Lost focus from cell ${selectedCell}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    console.log(`✏️ Formula bar: Typing in cell ${selectedCell}: "${e.target.value}"`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium min-w-[60px] transition-colors duration-150 ${
            isFocused ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {selectedCell}
          </span>
          <div className="w-px h-6 bg-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-3 py-1 border rounded text-sm transition-all duration-150 ${
              isFocused 
                ? 'border-blue-500 ring-2 ring-blue-200 outline-none' 
                : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }`}
            placeholder="Enter value or formula"
          />
        </form>
      </div>
    </div>
  );
};

export default FormulaBar;