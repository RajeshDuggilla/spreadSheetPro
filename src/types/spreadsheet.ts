export interface CellData {
  id: string;
  value: string;
  formula?: string;
  row: number;
  col: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface SelectedRange {
  start: CellPosition;
  end: CellPosition;
}

export interface SpreadsheetData {
  [key: string]: CellData;
}