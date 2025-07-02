import React, { useState, useRef, useEffect } from 'react';
import { CellData } from '../types/spreadsheet';

interface CellProps {
  cell: CellData;
  isSelected: boolean;
  isInRange: boolean;
  onClick: (row: number, col: number) => void;
  onDoubleClick: (row: number, col: number) => void;
  onValueChange: (row: number, col: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent, row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({
  cell,
  isSelected,
  isInRange,
  onClick,
  onDoubleClick,
  onValueChange,
  onKeyDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(cell.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(cell.value);
  }, [cell.value]);

  const handleClick = () => {
    onClick(cell.row, cell.col);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    onDoubleClick(cell.row, cell.col);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter' || e.key === 'Tab') {
        handleCommit();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        handleCancel();
        e.preventDefault();
      }
    } else {
      onKeyDown(e, cell.row, cell.col);
      
      if (e.key === 'Enter' || e.key === 'F2') {
        setIsEditing(true);
        e.preventDefault();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsEditing(true);
        setEditValue(e.key);
        e.preventDefault();
      }
    }
  };

  const handleCommit = () => {
    onValueChange(cell.row, cell.col, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(cell.value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleCommit();
  };

  const getCellClassName = () => {
    let className = 'w-20 h-8 border-r border-b border-gray-200 text-xs text-gray-800 cursor-cell ';
    
    if (isSelected) {
      className += 'ring-2 ring-blue-500 ring-inset z-10 relative ';
    } else if (isInRange) {
      className += 'bg-blue-50 ';
    } else {
      className += 'hover:bg-gray-50 ';
    }
    
    return className;
  };

  return (
    <div
      className={getCellClassName()}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isSelected ? 0 : -1}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-1 text-xs border-none outline-none bg-white"
        />
      ) : (
        <div className="w-full h-full px-1 py-1 truncate">
          {cell.value}
        </div>
      )}
    </div>
  );
};

export default Cell;