import React from 'react';
import { motion } from 'motion/react';
import { Level } from '../types';
import { getLevelFlowchart } from '../utils/flowchartGenerator';
import { ArrowDown, HelpCircle, Play, CheckCircle2 } from 'lucide-react';

interface FlowchartViewProps {
  level: Level;
  currentStepIndex: number;
  isLevelComplete?: boolean;
  compact?: boolean;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({
  level,
  currentStepIndex,
  isLevelComplete = false,
  compact = false,
}) => {
  const flowchart = getLevelFlowchart(level);

  // Check if a node is currently active based on currentStepIndex
  const isNodeActive = (stepIndex?: number | number[]) => {
    if (stepIndex === undefined) return false;
    if (Array.isArray(stepIndex)) {
      return stepIndex.includes(currentStepIndex);
    }
    return stepIndex === currentStepIndex;
  };

  const isNodeDone = (stepIndex?: number | number[]) => {
    if (stepIndex === undefined) return false;
    if (Array.isArray(stepIndex)) {
      return stepIndex.every((idx) => idx < currentStepIndex);
    }
    return stepIndex < currentStepIndex;
  };

  // Node count scaling
  const nodeCount = flowchart.nodes.length;
  const isDense = nodeCount >= 6 || compact;
  const isUltraDense = nodeCount >= 8;

  // Dynamic responsive text and padding
  const getNodeTextSize = () => {
    if (isUltraDense) return 'text-[8px] sm:text-[9.5px]';
    if (isDense) return 'text-[8.5px] sm:text-[10px]';
    return 'text-[9.5px] sm:text-[11px]';
  };

  const getNodePadding = () => {
    if (isUltraDense) return 'py-0 px-1';
    if (isDense) return 'py-0.2 px-1.5';
    return 'py-0.5 px-2';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] rounded-xl p-1.5 sm:p-2 font-sans border border-slate-200/70 shadow-inner overflow-hidden relative select-none">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/60 shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 truncate">
            {flowchart.title || 'ผังงาน (Flowchart)'}
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200 shrink-0">
          มาตรฐาน ISO
        </span>
      </div>

      {/* Nodes Container - Auto-scrolling & Auto-fitting */}
      <div className="flex-1 flex flex-col justify-around items-center w-full min-h-0 py-0.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {flowchart.nodes.map((node, index) => {
          const active = isNodeActive(node.stepIndex) && !isLevelComplete;
          const done = (isNodeDone(node.stepIndex) || (isLevelComplete && node.type !== 'start')) && !active;
          const isLast = index === flowchart.nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Item */}
              <div className="relative w-full flex justify-center items-center my-0.2 shrink-0">
                {/* 1. START / END TERMINATOR (Pill) */}
                {(node.type === 'start' || node.type === 'end') && (
                  <div
                    className={`${getNodePadding()} rounded-full ${getNodeTextSize()} font-bold flex items-center gap-1 shadow-xs transition-all duration-200 ${
                      node.type === 'start'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : isLevelComplete
                        ? 'bg-emerald-500 text-white font-black ring-2 ring-emerald-300 animate-bounce'
                        : 'bg-rose-100 text-rose-900 border border-rose-400'
                    }`}
                  >
                    {node.type === 'start' ? (
                      <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-emerald-700 text-emerald-700" />
                    ) : (
                      <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                    )}
                    <span>{node.label}</span>
                  </div>
                )}

                {/* 2. PROCESS (Rectangle) */}
                {node.type === 'process' && (
                  <motion.div
                    animate={active ? { scale: 1.03 } : { scale: 1 }}
                    className={`w-[94%] max-w-[210px] ${getNodePadding()} rounded-md ${getNodeTextSize()} text-center font-medium shadow-2xs transition-all duration-150 border ${
                      active
                        ? 'bg-amber-100 text-amber-950 border-amber-500 font-bold ring-2 ring-amber-400/80 shadow-md'
                        : done
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    <div className="truncate">{node.label}</div>
                    {node.subLabel && (
                      <div className="text-[7.5px] sm:text-[8.5px] text-slate-500 font-mono leading-tight truncate">
                        {node.subLabel}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. DECISION (Diamond / Hexagon Style) */}
                {node.type === 'decision' && (
                  <motion.div
                    animate={active ? { scale: 1.03 } : { scale: 1 }}
                    className={`w-[94%] max-w-[220px] ${getNodePadding()} rounded-lg ${getNodeTextSize()} text-center font-bold shadow-2xs transition-all duration-150 border relative ${
                      active
                        ? 'bg-amber-100 text-amber-950 border-amber-500 ring-2 ring-amber-400/80 shadow-md'
                        : done
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-sky-50 text-sky-900 border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <HelpCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-sky-600 shrink-0" />
                      <span className="truncate">{node.label}</span>
                    </div>

                    {/* Decision Branch Tags */}
                    {(node.yesTargetLabel || node.noTargetLabel) && (
                      <div className="flex items-center justify-between text-[7px] sm:text-[8px] mt-0.2 px-0.5 font-mono text-slate-500 border-t border-slate-200/50 pt-0.2">
                        {node.yesTargetLabel && (
                          <span className="text-emerald-700 font-bold">✓ {node.yesTargetLabel}</span>
                        )}
                        {node.noTargetLabel && (
                          <span className="text-rose-600 font-bold">✗ {node.noTargetLabel}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. SUBROUTINE / FUNCTION (Box with double side borders) */}
                {node.type === 'subroutine' && (
                  <motion.div
                    animate={active ? { scale: 1.03 } : { scale: 1 }}
                    className={`w-[94%] max-w-[210px] ${getNodePadding()} rounded-md ${getNodeTextSize()} text-center font-bold shadow-2xs transition-all duration-150 border-y border-x-3 border-indigo-400 ${
                      active
                        ? 'bg-amber-100 text-amber-950 border-y-amber-500 border-x-amber-600 ring-2 ring-amber-400/80 shadow-md'
                        : done
                        ? 'bg-emerald-50 text-emerald-900 border-y-emerald-300 border-x-emerald-500'
                        : 'bg-indigo-50 text-indigo-950 border-indigo-400'
                    }`}
                  >
                    <div className="truncate flex items-center justify-center gap-1">
                      <span>{node.label}</span>
                    </div>
                    {node.subLabel && (
                      <div className="text-[7.5px] sm:text-[8.5px] text-indigo-600 font-normal truncate">
                        {node.subLabel}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Active Pulse Indicator */}
                {active && (
                  <div className="absolute -left-1 flex items-center pointer-events-none">
                    <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-amber-500" />
                    </span>
                  </div>
                )}
              </div>

              {/* Connecting Flow Arrow */}
              {!isLast && (
                <div className="flex items-center justify-center my-0 shrink-0">
                  <ArrowDown className={`w-2.5 h-2.5 ${isDense ? 'h-2' : 'h-3'} text-slate-400`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center gap-2 pt-0.5 border-t border-slate-200/50 text-[8px] sm:text-[9px] text-slate-500 shrink-0 flex-wrap">
        <span className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> เริ่ม/จบ
        </span>
        <span className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rounded-xs bg-slate-300" /> ปฏิบัติงาน
        </span>
        <span className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rotate-45 rounded-2xs bg-sky-400" /> เงื่อนไข
        </span>
        <span className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rounded-2xs bg-indigo-500" /> ฟังก์ชัน
        </span>
      </div>
    </div>
  );
};
