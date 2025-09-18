// Type for a "cell" on the dungeon board.
// TODO: Implement Chests and Enemies.
export enum CellType {
  Default,
  Walkable,
  Entrance,
  Exit,
}

// Get #ffffff color type for a given cell.
export function getCellColor(cell: CellType): string {
  switch(cell) {
    // Default cells are black.
    case CellType.Default:
      return "#000000";
    // Walkable cells are white.
    case CellType.Walkable:
      return "#ffffff";
    // Entrances are green.
    case CellType.Entrance:
      return "#00aa00";
    // Exits are gold.
    case CellType.Exit:
      return "#d4af37";

    default:
      return "#000000";
  }
}
