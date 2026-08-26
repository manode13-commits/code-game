import { Level } from './types';
import { ALL_LEVEL_BLUEPRINTS } from './data/levelBlueprints';
import { computePath } from './utils/levelHelpers';
import { createLevelColorDots } from './utils/dotGenerator';

export const GAME_LEVELS: Level[] = ALL_LEVEL_BLUEPRINTS.map((bp) => {
  const path = computePath(bp.startPos, bp.stepByStepDirections, bp.rows, bp.cols);
  const colorDots = createLevelColorDots(
    bp.rows,
    bp.cols,
    path,
    bp.codeSnippet,
    bp.stepByStepDirections,
    bp.id % 2 === 0 ? 'cyan' : 'emerald',
    'pink'
  );

  return {
    ...bp,
    targetPath: path,
    colorDots,
  };
});

export const LEVELS: Level[] = GAME_LEVELS;
export default GAME_LEVELS;
