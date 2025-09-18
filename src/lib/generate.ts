import { createBoard, type Board } from "./board";

export function generateDungeon(size: number, roomCount: number): Board {
  const board = createBoard(size);
  // TODO: Place rooms.
  // TODO: Connect rooms with corridors.

  return board;
}
