import { Level, GridPosition, ColorName } from '../types';

// Map color emojis to ColorName
export const EMOJI_TO_COLOR: Record<string, ColorName> = {
  '🟢': 'emerald',
  '🔵': 'cyan',
  '🟠': 'orange',
  '🟣': 'purple',
  '🟡': 'yellow',
  '🔴': 'pink',
  '🌸': 'pink',
  '⚪': 'gray',
  '⚫': 'dark',
};

// Toroidal wrap helper
export function computePath(
  startPos: GridPosition,
  directions: ('up' | 'down' | 'left' | 'right')[],
  rows: number,
  cols: number
): GridPosition[] {
  const path: GridPosition[] = [{ ...startPos }];
  let curr = { ...startPos };
  const deltaMap = {
    up: { r: -1, c: 0 },
    down: { r: 1, c: 0 },
    left: { r: 0, c: -1 },
    right: { r: 0, c: 1 },
  };

  for (const dir of directions) {
    const d = deltaMap[dir];
    const nextRow = (curr.row + d.r + rows) % rows;
    const nextCol = (curr.col + d.c + cols) % cols;
    curr = { row: nextRow, col: nextCol };
    path.push({ ...curr });
  }

  return path;
}
