import { Level } from '../types';

/**
 * Returns the 0-based line index (or indices) in level.codeSnippet that correspond
 * to the current execution step (currentStepIndex).
 */
export function getActiveCodeLines(level: Level, currentStepIndex: number): number[] {
  if (currentStepIndex < 0 || currentStepIndex >= level.stepByStepDirections.length) {
    return [];
  }

  switch (level.id) {
    // -------------------------------------------------------------
    // ด่าน 1 ถึง 5: Sequence
    // -------------------------------------------------------------
    case 1: // right(), right(), down(), right()
      return [currentStepIndex]; // 0, 1, 2, 3

    case 2: // right(), down(), down(), right(), up()
      return [currentStepIndex]; // 0, 1, 2, 3, 4

    case 3: // right(), right(), down(), left(), left(), up()
      return [currentStepIndex]; // 0, 1, 2, 3, 4, 5

    case 4: // up(), right(), up(), right(), down(), right()
      return [currentStepIndex]; // 0, 1, 2, 3, 4, 5

    case 5: // up(), up(), right(), right(), down()
      return [currentStepIndex]; // 0, 1, 2, 3, 4

    // -------------------------------------------------------------
    // ด่าน 6 ถึง 10: Loops
    // -------------------------------------------------------------
    case 6: // repeat (4) { up(); right(); } down()
      // 0,2,4,6 -> line 1 (up), 1,3,5,7 -> line 2 (right), 8 -> line 4 (down)
      if (currentStepIndex === 8) return [4];
      return currentStepIndex % 2 === 0 ? [1] : [2];

    case 7: // repeat (5) { up(); right(); }
      return currentStepIndex % 2 === 0 ? [1] : [2];

    case 8: // repeat (3) { right(); right(); down(); }
      if (currentStepIndex % 3 === 0) return [1];
      if (currentStepIndex % 3 === 1) return [2];
      return [3];

    case 9: // while 🟢 { right() } down()
      if (currentStepIndex === 4) return [3];
      return [1];

    case 10: // while 🟢 { down(); right(); }
      return currentStepIndex % 2 === 0 ? [1] : [2];

    // -------------------------------------------------------------
    // ด่าน 11 ถึง 15: Conditions
    // -------------------------------------------------------------
    case 11: // repeat (5) { up(); if 🟠 { left() } down() }
      // step 0, 3, 6, 9, 11 -> line 1 (up)
      // step 1, 4, 7 -> line 3 (left)
      // step 2, 5, 8, 10, 12 -> line 5 (down)
      if ([0, 3, 6, 9, 11].includes(currentStepIndex)) return [1];
      if ([1, 4, 7].includes(currentStepIndex)) return [3];
      return [5];

    case 12: // repeat (4) { if 🟠 { down() } right() }
      // step 0 -> line 4 (right)
      // step 1 -> line 2 (down), step 2 -> line 4 (right)
      // step 3 -> line 2 (down), step 4 -> line 4 (right)
      // step 5 -> line 2 (down), step 6 -> line 4 (right)
      if ([1, 3, 5].includes(currentStepIndex)) return [2];
      return [4];

    case 13: // if 🟢 { right(); down() } else ... if 🟠 ... else { left() } up()
      if (currentStepIndex === 0) return [1]; // right
      if (currentStepIndex === 1) return [2]; // down
      if (currentStepIndex === 2) return [11]; // left
      if (currentStepIndex === 3) return [13]; // up
      return [];

    case 14: // repeat (6) { if 🔴 left() else if 🟡 down() else right() }
      // step 0 -> down (line 4)
      // step 1, 3, 5 -> right (line 6)
      // step 2, 4 -> left (line 2)
      if ([2, 4].includes(currentStepIndex)) return [2];
      if (currentStepIndex === 0) return [4];
      return [6];

    case 15: // repeat (5) { if 🔵 ... if 🟡 ... if 🔴 ... if 🟢 ... }
      // step 0, 2 -> right() (line 3)
      // step 1, 3 -> down() (line 2)
      // step 4 -> up() (line 4)
      if ([0, 2].includes(currentStepIndex)) return [3];
      if ([1, 3].includes(currentStepIndex)) return [2];
      if (currentStepIndex === 4) return [4];
      return [];

    // -------------------------------------------------------------
    // ด่าน 16 ถึง 20: Functions & Boss
    // -------------------------------------------------------------
    case 16: // left(), toTheRight() -> function toTheRight { right() x4 }
      if (currentStepIndex === 0) return [0]; // left()
      return [1, 4 + ((currentStepIndex - 1) % 4)]; // highlight caller + line in function

    case 17: // left(), square(), right(), square()
      if (currentStepIndex === 0) return [0]; // left()
      if (currentStepIndex >= 1 && currentStepIndex <= 4) {
        // square() 1: 1->down(line 6), 2->left(line 7), 3->up(line 8), 4->right(line 9)
        return [1, 6 + (currentStepIndex - 1)];
      }
      if (currentStepIndex === 5) return [2]; // right()
      if (currentStepIndex >= 6 && currentStepIndex <= 9) {
        return [3, 6 + (currentStepIndex - 6)];
      }
      return [];

    case 18: // fromBelow() (down, right, right, up) / fromAbove() (up, right, right, down)
      if (currentStepIndex >= 0 && currentStepIndex <= 3) {
        return [12, 1 + currentStepIndex];
      }
      if (currentStepIndex >= 4 && currentStepIndex <= 7) {
        return [13, 7 + (currentStepIndex - 4)];
      }
      return [];

    case 19: // dragonFly() { repeat(2) { right, right, up } right }
      if (currentStepIndex === 6) return [8, 6];
      const cycleStep = currentStepIndex % 3;
      return [8, 2 + cycleStep];

    case 20: // reachPeaks() { up x3, down, left, up, down, right, up }
      return [11, 1 + currentStepIndex];

    default:
      if (currentStepIndex < level.codeSnippet.length) {
        return [currentStepIndex];
      }
      return [];
  }
}
