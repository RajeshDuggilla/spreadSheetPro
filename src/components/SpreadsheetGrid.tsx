import React, { useState, useCallback, useEffect } from 'react';
import Cell from './Cell';
import { 
  SpreadsheetData, 
  CellPosition, 
  SelectedRange, 
  CellData 
} from '../types/spreadsheet';
import { 
  getCellId, 
  getColumnLabel, 
  getRowLabel, 
  isCellInRange, 
  createEmptyCell 
} from '../utils/spreadsheet';

interface SpreadsheetGridProps {
  data: SpreadsheetData;
  onDataChange: (data: SpreadsheetData) => void;
  onCellSelect: (cellId: string, value: string) => void;
  rows?: number;
  cols?: number;
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data,
  onDataChange,
  onCellSelect,
  rows = 50,
  cols = 26,
}) => {
  const [selectedCell, setSelectedCell] = useState<CellPosition>({ row: 0, col: 0 });
  const [selectedRange, setSelectedRange] = useState<SelectedRange | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set());

  useEffect(() => {
    const cellId = getCellId(selectedCell.row, selectedCell.col);
    const cell = data[cellId] || createEmptyCell(selectedCell.row, selectedCell.col);
    const displayId = `${getColumnLabel(selectedCell.col)}${getRowLabel(selectedCell.row)}`;
    onCellSelect(displayId, cell.value);
  }, [selectedCell, data, onCellSelect]);

  const handleCellClick = useCallback((row: number, col: number) => {
    console.log(`🔲 Cell clicked: ${getColumnLabel(col)}${getRowLabel(row)} (${row}, ${col})`);
    setSelectedCell({ row, col });
    setSelectedRange(null);
    setIsSelecting(false);
    setSelectedRows(new Set());
    setSelectedCols(new Set());
  }, []);

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    console.log(`🔲🔲 Cell double-clicked: ${getColumnLabel(col)}${getRowLabel(row)} - entering edit mode`);
    setSelectedCell({ row, col });
  }, []);

  const handleCellValueChange = useCallback((row: number, col: number, value: string) => {
    const cellId = getCellId(row, col);
    const displayId = `${getColumnLabel(col)}${getRowLabel(row)}`;
    const newData = { ...data };
    
    if (value === '') {
      delete newData[cellId];
      console.log(`🗑️ Cell ${displayId} cleared`);
    } else {
      newData[cellId] = {
        id: cellId,
        value,
        row,
        col,
      };
      console.log(`💾 Cell ${displayId} updated with value: "${value}"`);
    }
    
    onDataChange(newData);
  }, [data, onDataChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        console.log(`⬆️ Moving up to ${getColumnLabel(col)}${getRowLabel(newRow)}`);
        break;
      case 'ArrowDown':
        newRow = Math.min(rows - 1, row + 1);
        console.log(`⬇️ Moving down to ${getColumnLabel(col)}${getRowLabel(newRow)}`);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        console.log(`⬅️ Moving left to ${getColumnLabel(newCol)}${getRowLabel(row)}`);
        break;
      case 'ArrowRight':
        newCol = Math.min(cols - 1, col + 1);
        console.log(`➡️ Moving right to ${getColumnLabel(newCol)}${getRowLabel(row)}`);
        break;
      case 'Enter':
        newRow = Math.min(rows - 1, row + 1);
        console.log(`⏎ Enter pressed - moving to ${getColumnLabel(col)}${getRowLabel(newRow)}`);
        break;
      case 'Tab':
        newCol = Math.min(cols - 1, col + 1);
        console.log(`⭾ Tab pressed - moving to ${getColumnLabel(newCol)}${getRowLabel(row)}`);
        e.preventDefault();
        break;
      case 'Delete':
      case 'Backspace':
        console.log(`🗑️ Delete/Backspace pressed - clearing cell ${getColumnLabel(col)}${getRowLabel(row)}`);
        handleCellValueChange(row, col, '');
        return;
      default:
        return;
    }

    if (newRow !== row || newCol !== col) {
      setSelectedCell({ row: newRow, col: newCol });
      e.preventDefault();
    }
  }, [rows, cols, handleCellValueChange]);

  const handleHeaderClick = (type: 'row' | 'col', index: number) => {
    if (type === 'row') {
      const newSelectedRows = new Set(selectedRows);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
        console.log(`📋 Deselected row ${index + 1}`);
      } else {
        newSelectedRows.add(index);
        console.log(`📋 Selected row ${index + 1}`);
      }
      setSelectedRows(newSelectedRows);
      setSelectedCols(new Set());
    } else {
      const newSelectedCols = new Set(selectedCols);
      if (newSelectedCols.has(index)) {
        newSelectedCols.delete(index);
        console.log(`📋 Deselected column ${getColumnLabel(index)}`);
      } else {
        newSelectedCols.add(index);
        console.log(`📋 Selected column ${getColumnLabel(index)}`);
      }
      setSelectedCols(newSelectedCols);
      setSelectedRows(new Set());
    }
  };

  const renderColumnHeaders = () => (
    <div className="flex">
      <div className="w-12 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center">
        <div className="w-3 h-3 border border-gray-400"></div>
      </div>
      {Array.from({ length: cols }, (_, col) => (
        <div
          key={col}
          className={`w-20 h-8 border-r border-b border-gray-300 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
            selectedCols.has(col) 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => handleHeaderClick('col', col)}
        >
          <span className="text-xs font-medium">
            {getColumnLabel(col)}
          </span>
        </div>
      ))}
    </div>
  );

  const renderRows = () =>
    Array.from({ length: rows }, (_, row) => (
      <div key={row} className="flex">
        <div
          className={`w-12 h-8 border-r border-b border-gray-300 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
            selectedRows.has(row) 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => handleHeaderClick('row', row)}
        >
          <span className="text-xs font-medium">
            {getRowLabel(row)}
          </span>
        </div>
        {Array.from({ length: cols }, (_, col) => {
          const cellId = getCellId(row, col);
          const cell = data[cellId] || createEmptyCell(row, col);
          const isSelected = selectedCell.row === row && selectedCell.col === col;
          const isInRange = selectedRange
            ? isCellInRange({ row, col }, selectedRange.start, selectedRange.end)
            : false;
          const isRowSelected = selectedRows.has(row);
          const isColSelected = selectedCols.has(col);

          return (
            <Cell
              key={cellId}
              cell={cell}
              isSelected={isSelected}
              isInRange={isInRange || isRowSelected || isColSelected}
              onClick={handleCellClick}
              onDoubleClick={handleCellDoubleClick}
              onValueChange={handleCellValueChange}
              onKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
    ));

  return (
    <div className="bg-white overflow-auto flex-1">
      <div className="inline-block min-w-full">
        {renderColumnHeaders()}
        {renderRows()}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;