import { CellPosition, CellData } from '../types/spreadsheet';

export const getCellId = (row: number, col: number): string => {
  return `${row}-${col}`;
};

export const getColumnLabel = (col: number): string => {
  let result = '';
  while (col >= 0) {
    result = String.fromCharCode(65 + (col % 26)) + result;
    col = Math.floor(col / 26) - 1;
  }
  return result;
};

export const getRowLabel = (row: number): string => {
  return (row + 1).toString();
};

export const isCellInRange = (
  cell: CellPosition,
  start: CellPosition,
  end: CellPosition
): boolean => {
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  return (
    cell.row >= minRow &&
    cell.row <= maxRow &&
    cell.col >= minCol &&
    cell.col <= maxCol
  );
};

export const createEmptyCell = (row: number, col: number): CellData => ({
  id: getCellId(row, col),
  value: '',
  row,
  col,
});