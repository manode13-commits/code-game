import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GridPosition, Level, ColorName } from '../types';
import { Sparkles, Check, CheckCircle2, AlertTriangle } from 'lucide-react';

interface GameBoardProps {
  level: Level;
  currentPos: GridPosition;
  visitedPositions: GridPosition[];
  currentStepIndex: number;
  isLevelComplete: boolean;
  onMoveDot?: (dir: 'up' | 'down' | 'left' | 'right') => void;
  floatingText?: { text: string; id: number } | null;
  bumpKey?: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  currentPos,
  visitedPositions,
  currentStepIndex,
  isLevelComplete,
  onMoveDot,
  floatingText,
  bumpKey = 0,
}) => {
  const isPosEqual = (p1: GridPosition, p2: GridPosition) =>
    p1.row === p2.row && p1.col === p2.col;

  const isPositionVisited = (r: number, col: number) => {
    return visitedPositions.some((pos) => isPosEqual(pos, { row: r, col }));
  };

  const isCurrentPlayer = (r: number, col: number) =>
    isPosEqual(currentPos, { row: r, col });

  // Get color for a specific grid cell
  const getCellColor = (r: number, c: number): ColorName => {
    if (level.colorDots) {
      const found = level.colorDots.find((cd) => cd.row === r && cd.col === c);
      if (found) return found.color;
    }
    return 'gray';
  };

  // Color mapping exact to user images
  const getColorClasses = (color: ColorName): string => {
    switch (color) {
      case 'orange':
        return 'bg-[#f59e0b] shadow-[0_2px_8px_rgba(245,158,11,0.35)]';
      case 'pink':
        return 'bg-[#e11d48] shadow-[0_2px_8px_rgba(225,29,72,0.35)]';
      case 'green':
      case 'emerald':
        return 'bg-[#4ade80] shadow-[0_2px_8px_rgba(74,222,128,0.35)]';
      case 'cyan':
      case 'blue':
        return 'bg-[#06b6d4] shadow-[0_2px_8px_rgba(6,182,212,0.35)]';
      case 'purple':
        return 'bg-[#a855f7] shadow-[0_2px_8px_rgba(168,85,247,0.35)]';
      case 'yellow':
        return 'bg-[#eab308] shadow-[0_2px_8px_rgba(234,179,8,0.35)]';
      case 'red':
        return 'bg-[#e11d48] shadow-[0_2px_8px_rgba(225,29,72,0.35)]';
      case 'dark':
        return 'bg-[#2b2b2b] shadow-[0_2px_8px_rgba(43,43,43,0.3)]';
      case 'gray':
      default:
        return 'bg-[#e2e8f0] hover:bg-[#cbd5e1]';
    }
  };

  // Dynamic responsive sizing
  const maxDim = Math.max(level.rows, level.cols);

  const getDynamicDotStyle = () => {
    let sizePx = 64;
    let ringBorderWidth = 5;

    if (maxDim >= 10) {
      sizePx = 36;
      ringBorderWidth = 3;
    } else if (maxDim >= 8) {
      sizePx = 42;
      ringBorderWidth = 3.5;
    } else if (maxDim >= 6) {
      sizePx = 52;
      ringBorderWidth = 4;
    } else if (maxDim === 5) {
      sizePx = 60;
      ringBorderWidth = 5;
    }

    return {
      sizeStyle: {
        width: `min(${sizePx}px, calc(64vh / ${level.rows}), calc(46vw / ${level.cols}))`,
        height: `min(${sizePx}px, calc(64vh / ${level.rows}), calc(46vw / ${level.cols}))`,
      },
      ringBorderWidth,
    };
  };

  const { sizeStyle, ringBorderWidth } = getDynamicDotStyle();

  const gridGapClass =
    maxDim >= 8
      ? 'gap-1.5 sm:gap-2'
      : maxDim >= 5
      ? 'gap-2 sm:gap-3.5'
      : 'gap-3 sm:gap-5';

  const isSquareShape = level.cellShape === 'square';
  const shapeRounding = isSquareShape ? 'rounded-xl sm:rounded-2xl' : 'rounded-full';

  return (
    <motion.div
      key={`board-shake-${bumpKey}`}
      animate={
        bumpKey > 0
          ? {
              x: [-10, 10, -8, 8, -4, 4, 0],
            }
          : {}
      }
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="relative flex-1 flex flex-col items-center justify-between p-2 sm:p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl w-full h-full overflow-hidden border border-slate-200/80 min-h-0"
    >
      {/* Floating score / combo text */}
      <AnimatePresence>
        {floatingText && (
          <motion.div
            key={floatingText.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -35, scale: 1.15 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-1/3 z-30 font-black text-lg md:text-2xl text-amber-600 drop-shadow-md pointer-events-none flex items-center gap-1.5"
          >
            {floatingText.text.includes('ชน') ? (
              <AlertTriangle className="w-6 h-6 text-rose-500 animate-bounce" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            )}
            {floatingText.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid container with circular or rounded dots on light canvas matching image.png */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-3 bg-[#f8fafc] rounded-xl border border-slate-100 shadow-inner overflow-hidden my-0.5 relative min-h-0">
        <div
          className={`grid ${gridGapClass} place-items-center`}
          style={{
            gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: level.rows }).map((_, rowIndex) =>
            Array.from({ length: level.cols }).map((_, colIndex) => {
              const visited = isPositionVisited(rowIndex, colIndex);
              const isPlayerHere = isCurrentPlayer(rowIndex, colIndex);
              const colorType = getCellColor(rowIndex, colIndex);

              // Dot Background
              let dotBgClass = getColorClasses(colorType);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  id={`grid-dot-${rowIndex}-${colIndex}`}
                  style={sizeStyle}
                  onClick={() => {
                    if (!onMoveDot) return;

                    // 1. Direct adjacent neighbors (Highest Priority - Spatial accuracy)
                    if (rowIndex === currentPos.row - 1 && colIndex === currentPos.col) {
                      onMoveDot('up');
                      return;
                    }
                    if (rowIndex === currentPos.row + 1 && colIndex === currentPos.col) {
                      onMoveDot('down');
                      return;
                    }
                    if (rowIndex === currentPos.row && colIndex === currentPos.col - 1) {
                      onMoveDot('left');
                      return;
                    }
                    if (rowIndex === currentPos.row && colIndex === currentPos.col + 1) {
                      onMoveDot('right');
                      return;
                    }

                    // 2. Wrap-around edge moves (when grid size > 2 and clicking opposite boundary)
                    if (level.rows > 2 && colIndex === currentPos.col) {
                      if (currentPos.row === 0 && rowIndex === level.rows - 1) {
                        onMoveDot('up');
                        return;
                      }
                      if (currentPos.row === level.rows - 1 && rowIndex === 0) {
                        onMoveDot('down');
                        return;
                      }
                    }

                    if (level.cols > 2 && rowIndex === currentPos.row) {
                      if (currentPos.col === 0 && colIndex === level.cols - 1) {
                        onMoveDot('left');
                        return;
                      }
                      if (currentPos.col === level.cols - 1 && colIndex === 0) {
                        onMoveDot('right');
                        return;
                      }
                    }
                  }}
                  className={`relative ${shapeRounding} flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${dotBgClass}`}
                >
                  {/* Active Player Ring Token (White donut with circular hole matching exact screenshot) */}
                  {isPlayerHere && !isLevelComplete && (
                    <motion.div
                      layoutId="player-token"
                      transition={{ type: 'spring', stiffness: 550, damping: 32 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div
                        style={{ borderWidth: `${ringBorderWidth}px` }}
                        className="w-[58%] h-[58%] rounded-full border-white bg-white shadow-md z-10 flex items-center justify-center"
                      />
                    </motion.div>
                  )}

                  {/* LEVEL COMPLETE CHECKMARK */}
                  {isPlayerHere && isLevelComplete && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                      className={`absolute inset-0 ${shapeRounding} bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center justify-center z-20`}
                    >
                      <Check className="w-3/5 h-3/5 text-white stroke-[3.5]" />
                    </motion.div>
                  )}

                  {/* Visited Indicator Subtle Trail */}
                  {visited && !isPlayerHere && !isLevelComplete && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Progress Footer */}
      <div className="w-full mt-1 flex items-center justify-between text-[11px] text-slate-600 font-medium px-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold text-slate-700">ก้าวโค้ดดิ้ง: ({currentStepIndex}/{level.stepByStepDirections.length} คำสั่ง)</span>
        </div>

        {isLevelComplete ? (
          <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> ผ่านด่านแล้ว! (กำลังไปด่านต่อไป...)
          </span>
        ) : (
          <span className="text-slate-500 hidden sm:flex items-center gap-1 text-[11px]">
            <span>คลิกปุ่มลูกศรหรือกดแป้นพิมพ์เพื่อเดินตามโค้ด</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};
