import { CellType } from "./cell";

// A board is a 2D array of cells.
export type Board = CellType[][];

// Constructor for board.
export function createBoard(size: number): Board {
  return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => CellType.Default)
  );
}
