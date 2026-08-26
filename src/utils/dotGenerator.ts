import { GridPosition, ColorName, ColorDot } from '../types';
import { EMOJI_TO_COLOR } from './levelHelpers';

// Helper to accurately simulate code execution and enforce exact dot colors at condition evaluation points
export function createLevelColorDots(
  rows: number,
  cols: number,
  path: GridPosition[],
  codeSnippet: string[],
  stepByStepDirections: ('up' | 'down' | 'left' | 'right')[],
  defaultPrimary: ColorName = 'cyan',
  defaultAccent: ColorName = 'pink'
): ColorDot[] {
  const dots: ColorDot[] = [];
  const cellColorMap = new Map<string, ColorName>();

  // 1. Assign base path colors
  const palette: ColorName[] = [defaultPrimary, 'yellow', 'orange', 'cyan', 'purple', 'emerald', 'pink'];
  path.forEach((p, idx) => {
    if (idx === path.length - 1) {
      cellColorMap.set(`${p.row},${p.col}`, defaultAccent);
    } else if (idx === 0) {
      cellColorMap.set(`${p.row},${p.col}`, 'emerald');
    } else {
      cellColorMap.set(`${p.row},${p.col}`, palette[idx % palette.length]);
    }
  });

  // 2. Full AST / Execution simulation to trace exact positions where conditions are evaluated
  const funcs: Record<string, string[]> = {};
  const topLines: string[] = [];
  let inFunc: string | null = null;
  let funcDepth = 0;

  for (const raw of codeSnippet) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    if (!inFunc) {
      const fMatch = trimmed.match(/^function\s+([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (fMatch) {
        inFunc = fMatch[1];
        funcs[inFunc] = [];
        funcDepth = 0;
        if (trimmed.includes('{')) funcDepth++;
        continue;
      }
      topLines.push(trimmed);
    } else {
      if (trimmed.includes('{')) funcDepth++;
      if (trimmed.includes('}')) {
        funcDepth--;
        if (funcDepth === 0) {
          inFunc = null;
          continue;
        }
      }
      funcs[inFunc].push(trimmed);
    }
  }

  let currentPos = path.length > 0 ? { ...path[0] } : { row: 0, col: 0 };

  function executeBlock(blockLines: string[]) {
    let idx = 0;
    while (idx < blockLines.length) {
      const line = blockLines[idx].trim();
      if (line === '{' || line === '}') {
        idx++;
        continue;
      }

      // Repeat loop
      const repeatMatch = line.match(/^repeat\s*\(\s*(\d+)\s*\)/);
      if (repeatMatch) {
        const count = parseInt(repeatMatch[1], 10);
        const subLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) subLines.push(cur);
          idx++;
        }
        for (let r = 0; r < count; r++) {
          executeBlock(subLines);
        }
        continue;
      }

      // While loop
      const whileMatch = line.match(/^while\s+(\S+)/);
      if (whileMatch) {
        const emoji = whileMatch[1];
        const targetColor = EMOJI_TO_COLOR[emoji] || 'emerald';
        cellColorMap.set(`${currentPos.row},${currentPos.col}`, targetColor);

        const subLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) subLines.push(cur);
          idx++;
        }
        for (let r = 0; r < 2; r++) {
          executeBlock(subLines);
        }
        continue;
      }

      // If condition
      const ifMatch = line.match(/^if\s+(\S+)/);
      if (ifMatch) {
        const emoji = ifMatch[1];
        const targetColor = EMOJI_TO_COLOR[emoji] || 'emerald';
        // Enforce that the tile at current position matches the condition's color!
        cellColorMap.set(`${currentPos.row},${currentPos.col}`, targetColor);

        const ifSubLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) ifSubLines.push(cur);
          idx++;
        }
        executeBlock(ifSubLines);
        continue;
      }

      // Direction command
      const actMatch = line.match(/\b(up|down|left|right)\s*\(\s*\)/);
      if (actMatch) {
        const dir = actMatch[1] as 'up' | 'down' | 'left' | 'right';
        const deltaMap = {
          up: { r: -1, c: 0 },
          down: { r: 1, c: 0 },
          left: { r: 0, c: -1 },
          right: { r: 0, c: 1 },
        };
        const d = deltaMap[dir];
        currentPos = {
          row: (currentPos.row + d.r + rows) % rows,
          col: (currentPos.col + d.c + cols) % cols,
        };
        idx++;
        continue;
      }

      // Function invocation
      const callMatch = line.match(/^([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (callMatch && funcs[callMatch[1]]) {
        executeBlock(funcs[callMatch[1]]);
        idx++;
        continue;
      }

      idx++;
    }
  }

  executeBlock(topLines);

  // 3. Fill grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (cellColorMap.has(key)) {
        dots.push({ row: r, col: c, color: cellColorMap.get(key)! });
      } else {
        const isDecor = (r + c) % 3 === 0;
        dots.push({ row: r, col: c, color: isDecor ? 'dark' : 'gray' });
      }
    }
  }

  return dots;
}
