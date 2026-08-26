import { Level } from '../types';

/**
 * Returns the 0-based line index (or indices) in level.codeSnippet that correspond
 * to the current execution step (currentStepIndex).
 */
export function getActiveCodeLines(level: Level, currentStepIndex: number): number[] {
  if (currentStepIndex < 0 || currentStepIndex >= level.stepByStepDirections.length) {
    return [];
  }

  if (!level.codeSnippet || level.codeSnippet.length === 0) {
    return [];
  }

  const currentDir = level.stepByStepDirections[currentStepIndex];

  // 1. For Sequence (Zone 1 - levels 1 to 20)
  if (level.concept === 'sequence') {
    let actionCount = 0;
    for (let i = 0; i < level.codeSnippet.length; i++) {
      const line = level.codeSnippet[i];
      if (/\b(up|down|left|right)\s*\(\s*\)/.test(line)) {
        if (actionCount === currentStepIndex) {
          return [i];
        }
        actionCount++;
      }
    }
    return [Math.min(currentStepIndex, level.codeSnippet.length - 1)];
  }

  // 2. For Loops, Conditions, Functions, and Boss challenges
  const allActionLines: { lineIdx: number; dir: string }[] = [];

  for (let i = 0; i < level.codeSnippet.length; i++) {
    const line = level.codeSnippet[i];
    const match = line.match(/\b(up|down|left|right)\s*\(\s*\)/);
    if (match) {
      allActionLines.push({ lineIdx: i, dir: match[1] });
    }
  }

  if (allActionLines.length > 0) {
    // If exact 1:1 action lines count matches total directions
    if (allActionLines.length === level.stepByStepDirections.length) {
      return [allActionLines[currentStepIndex].lineIdx];
    }

    // In a loop or repeated structure, find the corresponding action line
    const actionIndexInCycle = currentStepIndex % allActionLines.length;
    const targetLine = allActionLines[actionIndexInCycle]?.lineIdx;
    if (targetLine !== undefined) {
      // Find parent block header (repeat, if, while, function)
      let parentHeaderLine: number | null = null;
      for (let p = targetLine - 1; p >= 0; p--) {
        const pLine = level.codeSnippet[p].trim();
        if (
          pLine.startsWith('repeat') ||
          pLine.startsWith('if') ||
          pLine.startsWith('while') ||
          pLine.startsWith('function')
        ) {
          parentHeaderLine = p;
          break;
        }
      }

      return parentHeaderLine !== null ? [parentHeaderLine, targetLine] : [targetLine];
    }
  }

  // Fallback match
  for (let i = 0; i < level.codeSnippet.length; i++) {
    if (level.codeSnippet[i].includes(`${currentDir}()`)) {
      return [i];
    }
  }

  return [];
}
