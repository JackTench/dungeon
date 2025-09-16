import React, { useEffect, useMemo, useState } from "react";

const WIDTH = 64;
const HEIGHT = 64;

const ROOM_W_MIN = 4;
const ROOM_W_MAX = 12;
const ROOM_H_MIN = 2;
const ROOM_H_MAX = 10;
// Bounds for the slider
const ROOM_COUNT_MIN = 2;
const ROOM_COUNT_MAX = 25;

const WALL = 0 as const;
const FLOOR = 1 as const;
type Tile = typeof WALL | typeof FLOOR;

type Room = { x: number; y: number; w: number; h: number };

type Grid = Tile[][]; // [y][x]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGrid(w: number, h: number, fill: Tile = WALL): Grid {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => fill));
}

function inBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
}

function roomsOverlap(a: Room, b: Room): boolean {
  return !(a.x + a.w + 1 <= b.x || b.x + b.w + 1 <= a.x || a.y + a.h + 1 <= b.y || b.y + b.h + 1 <= a.y);
}

function placeRooms(grid: Grid, roomCount: number): Room[] {
  const rooms: Room[] = [];
  let attempts = 0;

  while (rooms.length < roomCount && attempts < 200) {
    attempts++;
    const w = randInt(ROOM_W_MIN, ROOM_W_MAX);
    const h = randInt(ROOM_H_MIN, ROOM_H_MAX);
    const x = randInt(2, WIDTH - w - 3);
    const y = randInt(2, HEIGHT - h - 3);
    const candidate: Room = { x, y, w, h };

    if (rooms.some((r) => roomsOverlap(r, candidate))) continue;

    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        grid[yy][xx] = FLOOR;
      }
    }

    rooms.push(candidate);
  }

  return rooms;
}

function carveCorridor(grid: Grid, x1: number, y1: number, x2: number, y2: number) {
  const firstHorizontal = Math.random() < 0.5;
  if (firstHorizontal) {
    carveLineH(grid, x1, x2, y1);
    carveLineV(grid, y1, y2, x2);
  } else {
    carveLineV(grid, y1, y2, x1);
    carveLineH(grid, x1, x2, y2);
  }
}

function carveLineH(grid: Grid, x1: number, x2: number, y: number) {
  const [lo, hi] = x1 <= x2 ? [x1, x2] : [x2, x1];
  for (let x = lo; x <= hi; x++) if (inBounds(x, y)) grid[y][x] = FLOOR;
}

function carveLineV(grid: Grid, y1: number, y2: number, x: number) {
  const [lo, hi] = y1 <= y2 ? [y1, y2] : [y2, y1];
  for (let y = lo; y <= hi; y++) if (inBounds(x, y)) grid[y][x] = FLOOR;
}

function connectRoomsWithCorridors(grid: Grid, rooms: Room[]) {
  if (rooms.length === 0) return;

  const centers = rooms.map((r) => ({
    x: Math.floor(r.x + r.w / 2),
    y: Math.floor(r.y + r.h / 2),
  }));

  const connected = new Set<number>();
  connected.add(0);
  while (connected.size < centers.length) {
    let bestA = -1;
    let bestB = -1;
    let bestDist = Infinity;

    for (const a of connected) {
      for (let b = 0; b < centers.length; b++) {
        if (connected.has(b)) continue;
        const d = Math.abs(centers[a].x - centers[b].x) + Math.abs(centers[a].y - centers[b].y);
        if (d < bestDist) {
          bestDist = d;
          bestA = a;
          bestB = b;
        }
      }
    }

    if (bestA !== -1 && bestB !== -1) {
      carveCorridor(grid, centers[bestA].x, centers[bestA].y, centers[bestB].x, centers[bestB].y);
      connected.add(bestB);
    } else {
      break;
    }
  }
}

function generateDungeon(roomCount: number): { grid: Grid; rooms: Room[] } {
  const grid = createGrid(WIDTH, HEIGHT, WALL);
  const rooms = placeRooms(grid, roomCount);
  connectRoomsWithCorridors(grid, rooms);
  return { grid, rooms };
}

export default function App() {
  const [gridState, setGridState] = useState<Grid>(() => createGrid(WIDTH, HEIGHT));
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomCount, setRoomCount] = useState<number>(10); // initial value

  const pixelSize = 8;

  // Generate on mount and whenever roomCount changes (live updates)
  useEffect(() => {
    const { grid, rooms } = generateDungeon(roomCount);
    setGridState(grid.map((row) => row.slice()));
    setRooms(rooms);
  }, [roomCount]);

  function handleGenerate() {
    const { grid, rooms } = generateDungeon(roomCount);
    setGridState(grid.map((row) => row.slice()));
    setRooms(rooms);
  }

  const gridStyle: React.CSSProperties = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${WIDTH}, ${pixelSize}px)`,
      gridTemplateRows: `repeat(${HEIGHT}, ${pixelSize}px)`,
      lineHeight: 0,
      border: "1px solid #222",
      boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      width: WIDTH * pixelSize,
      height: HEIGHT * pixelSize,
      margin: "0 auto",
      imageRendering: "pixelated",
    }),
    [pixelSize]
  );

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-6 bg-neutral-100 text-neutral-900">
      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded-xl shadow border bg-white hover:shadow-md active:translate-y-px"
        >
          Generate Dungeon
        </button>

        {/* Room count slider */}
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700">Rooms</span>
          <input
            type="range"
            min={ROOM_COUNT_MIN}
            max={ROOM_COUNT_MAX}
            value={roomCount}
            onChange={(e) => setRoomCount(parseInt(e.target.value, 10))}
            className="w-56 accent-neutral-800 cursor-pointer"
          />
          <span className="w-8 text-right tabular-nums text-sm">{roomCount}</span>
        </label>
      </div>

      <div style={gridStyle}>
        {gridState.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                background: cell === FLOOR ? "#fff" : "#000",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
