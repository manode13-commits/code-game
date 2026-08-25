import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Level, DeviceMode } from '../types';
import { FlowchartView } from './FlowchartView';
import {
  RotateCcw,
  Lightbulb,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Code2,
  GitBranch,
} from 'lucide-react';

interface CodeDisplayProps {
  level: Level;
  currentStepIndex: number;
  onResetStep: () => void;
  showHint: boolean;
  onToggleHint: () => void;
  onMove?: (dir: 'up' | 'down' | 'left' | 'right') => void;
  isLevelComplete?: boolean;
  deviceMode?: DeviceMode;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  level,
  currentStepIndex,
  onResetStep,
  showHint,
  onToggleHint,
  onMove,
  isLevelComplete = false,
  deviceMode = 'desktop',
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'code' | 'flowchart'>(() => {
    return deviceMode === 'mobile' ? 'both' : 'both';
  });
  const lineCount = level.codeSnippet.length;

  // Dynamic Font & Spacing auto-scaling for full container fit without clipping
  const getLineStyles = () => {
    if (lineCount >= 18) {
      return {
        fontSize: 'text-[8px] sm:text-[9.5px]',
        padding: 'py-0 px-1',
        lineHeight: 'leading-tight',
      };
    }
    if (lineCount >= 13) {
      return {
        fontSize: 'text-[9px] sm:text-[10.5px]',
        padding: 'py-0.2 px-1',
        lineHeight: 'leading-tight',
      };
    }
    if (lineCount >= 8) {
      return {
        fontSize: 'text-[10px] sm:text-[11.5px]',
        padding: 'py-0.5 px-1.5',
        lineHeight: 'leading-snug',
      };
    }
    return {
      fontSize: 'text-[11px] sm:text-[12.5px]',
      padding: 'py-0.5 px-2',
      lineHeight: 'leading-relaxed',
    };
  };

  const lineStyle = getLineStyles();

  // Syntax highlight with matching color badges
  const renderFormattedLine = (line: string, index: number) => {
    let formattedHtml = line
      .replace(/(repeat|\bif\b|\belse\b|\bwhile\b|\bfunction\b)/g, '<span class="text-[#dc2626] font-bold">$1</span>')
      // 1. Orange 🟠
      .replace(/🟠/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#f59e0b] inline-block shadow-xs"></span></span>')
      // 2. Pink / Red 🔴 🌸
      .replace(/(🔴|🌸)/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#e11d48] inline-block shadow-xs"></span></span>')
      // 3. Green 🟢
      .replace(/🟢/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#4ade80] inline-block shadow-xs"></span></span>')
      // 4. Cyan / Blue 🔵
      .replace(/🔵/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#06b6d4] inline-block shadow-xs"></span></span>')
      // 5. Purple 🟣
      .replace(/🟣/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#a855f7] inline-block shadow-xs"></span></span>')
      // 6. Yellow 🟡
      .replace(/🟡/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#eab308] inline-block shadow-xs"></span></span>')
      // 7. Dark / Black ⚫
      .replace(/⚫/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#2b2b2b] inline-block shadow-xs"></span></span>')
      // 8. Custom pattern ✖️
      .replace(/✖️|❌/g, '<span class="inline-flex items-center mx-0.5 align-middle"><span class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1e293b] inline-flex items-center justify-center text-[8px] text-amber-400 font-bold shadow-xs">✕</span></span>')
      .replace(/(up|down|left|right|toTheRight|square|choreography|shake|dance|choice|fromAbove|fromBelow|fall|eye|climbClaw|climbTower|flameHop|scanCircuit|spiralIn|reachPeaks|dragonFly)\s*\(\s*\)/g, '<span class="text-[#0284c7] font-bold">$1()</span>')
      .replace(/\((\d+)\)/g, '(<span class="text-[#0369a1] font-bold">$1</span>)');

    return (
      <div
        key={index}
        className={`${lineStyle.padding} ${lineStyle.fontSize} ${lineStyle.lineHeight} rounded font-mono transition-all duration-150 flex items-center gap-1 text-slate-900 font-medium hover:bg-slate-100/70`}
      >
        {/* Line Number */}
        <span className="select-none text-[8px] sm:text-[9px] font-mono w-3.5 sm:w-4 text-right shrink-0 text-slate-400">
          {index + 1}
        </span>

        {/* Code Content */}
        <span
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
          className="tracking-wide whitespace-pre truncate"
        />
      </div>
    );
  };

  const handleArrowClick = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (onMove && !isLevelComplete) {
      onMove(dir);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-xl justify-between overflow-hidden border border-slate-200/80">
      {/* Top Header - Controls & View Switcher */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/70 shrink-0 gap-1 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="font-black text-slate-800 text-[11px] sm:text-xs flex items-center gap-1 truncate">
            <span>คำสั่งโค้ด & ผังงาน</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200 hidden sm:inline">
              {level.conceptLabel}
            </span>
          </h3>

          {/* View Mode Toggle: [คู่กัน] [โค้ด] [ผังงาน] */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9.5px] sm:text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="แสดงคู่กันทั้งโค้ดและผังงาน"
            >
              คู่กัน
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-0.5 ${
                viewMode === 'code'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="แสดงเฉพาะโค้ด"
            >
              <Code2 className="w-2.5 h-2.5" /> โค้ด
            </button>
            <button
              type="button"
              onClick={() => setViewMode('flowchart')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-0.5 ${
                viewMode === 'flowchart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="แสดงเฉพาะผังงาน"
            >
              <GitBranch className="w-2.5 h-2.5" /> ผังงาน
            </button>
          </div>
        </div>

        {/* Compact Action Controls (คำใบ้, รีเซ็ต) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleHint}
            title="ดูคำใบ้"
            className={`px-1.5 sm:px-2 py-0.5 rounded-lg transition-all text-[10px] sm:text-[10.5px] font-bold flex items-center gap-1 cursor-pointer ${
              showHint
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Lightbulb className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
            <span>คำใบ้</span>
          </button>

          <button
            type="button"
            onClick={onResetStep}
            title="เริ่มเดินใหม่"
            className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
            <span>รีเซ็ต</span>
          </button>
        </div>
      </div>

      {/* Main Middle Section: Code Viewer + Flowchart Diagram Side-by-Side */}
      <div className="flex-1 min-h-0 grid grid-cols-1 gap-1.5 my-0.5 overflow-hidden">
        {viewMode === 'both' ? (
          <div className="grid grid-cols-2 gap-1.5 h-full min-h-0 overflow-hidden">
            {/* Left: Code Snippet */}
            <div className="flex-1 min-h-0 bg-[#f8fafc] rounded-xl p-1.5 sm:p-2 font-mono flex flex-col justify-start overflow-hidden border border-slate-200/70 shadow-inner relative">
              <div className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 pb-0.5 mb-0.5 border-b border-slate-200/60 flex items-center gap-1 shrink-0">
                <Code2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-600" /> โค้ด (Code)
              </div>
              <div className={`flex flex-col ${lineCount <= 8 ? 'my-auto' : ''} space-y-0.2 w-full overflow-y-auto overflow-x-hidden scrollbar-thin`}>
                {level.codeSnippet.map((line, idx) => renderFormattedLine(line, idx))}
              </div>
            </div>

            {/* Right: Flowchart View */}
            <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
              <FlowchartView
                level={level}
                currentStepIndex={currentStepIndex}
                isLevelComplete={isLevelComplete}
                compact={true}
              />
            </div>
          </div>
        ) : viewMode === 'code' ? (
          /* Single View: Code Snippet */
          <div className="flex-1 min-h-0 bg-[#f8fafc] rounded-xl p-2 font-mono flex flex-col justify-start overflow-hidden border border-slate-200/70 shadow-inner relative">
            <div className="text-[10px] font-bold text-slate-500 pb-0.5 mb-0.5 border-b border-slate-200/60 flex items-center gap-1 shrink-0">
              <Code2 className="w-3 h-3 text-sky-600" /> คำสั่งโค้ด (Code)
            </div>
            <div className={`flex flex-col ${lineCount <= 8 ? 'my-auto' : ''} space-y-0.5 w-full overflow-y-auto overflow-x-hidden scrollbar-thin`}>
              {level.codeSnippet.map((line, idx) => renderFormattedLine(line, idx))}
            </div>
          </div>
        ) : (
          /* Single View: Flowchart View */
          <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
            <FlowchartView
              level={level}
              currentStepIndex={currentStepIndex}
              isLevelComplete={isLevelComplete}
              compact={false}
            />
          </div>
        )}
      </div>

      {/* Bottom Section: Step Sequence Indicator & Direction Buttons */}
      <div className="pt-1 shrink-0 flex flex-col gap-1">
        {/* Step Progress Info */}
        <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-600">
          <span className="flex items-center gap-1 font-bold text-slate-700 text-[10px] sm:text-[10.5px]">
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" /> ก้าวตามโค้ด & ผังงาน:
          </span>
          <span className="font-mono text-slate-800 font-bold text-[10px] sm:text-[10.5px]">
            {currentStepIndex} / {level.stepByStepDirections.length} ก้าว
          </span>
        </div>

        {/* Compact Step Progress Indicator */}
        <div className="flex items-center gap-0.5 overflow-hidden py-0.5 flex-wrap max-h-9">
          {level.stepByStepDirections.map((dir, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <span
                key={idx}
                className={`h-3 sm:h-3.5 min-w-[14px] sm:min-w-[16px] px-0.5 rounded text-[8px] sm:text-[8.5px] font-mono font-bold flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : isCurrent
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 font-black animate-pulse'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? '✓' : showHint ? dir.toUpperCase() : idx + 1}
              </span>
            );
          })}
        </div>

        {/* Direction Arrow Buttons - Sleek, Touch-Friendly */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            id="touch-btn-up"
            onClick={() => handleArrowClick('up')}
            disabled={isLevelComplete}
            className="w-12 h-7.5 sm:w-14 sm:h-8 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-40 text-white rounded-lg flex items-center justify-center font-black cursor-pointer shadow-xs"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            id="touch-btn-down"
            onClick={() => handleArrowClick('down')}
            disabled={isLevelComplete}
            className="w-12 h-7.5 sm:w-14 sm:h-8 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-40 text-white rounded-lg flex items-center justify-center font-black cursor-pointer shadow-xs"
          >
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            id="touch-btn-left"
            onClick={() => handleArrowClick('left')}
            disabled={isLevelComplete}
            className="w-12 h-7.5 sm:w-14 sm:h-8 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-40 text-white rounded-lg flex items-center justify-center font-black cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            id="touch-btn-right"
            onClick={() => handleArrowClick('right')}
            disabled={isLevelComplete}
            className="w-12 h-7.5 sm:w-14 sm:h-8 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-40 text-white rounded-lg flex items-center justify-center font-black cursor-pointer shadow-xs"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </div>

        {/* Hint Box if active */}
        {showHint && (
          <div className="p-1 bg-amber-50 rounded-lg text-[9.5px] sm:text-[10px] text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-amber-800">คำใบ้: </span>
              {level.hint}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
