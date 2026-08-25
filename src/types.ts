export type CodeConcept = 'sequence' | 'loop' | 'condition' | 'function' | 'challenge';

export type DeviceMode = 'desktop' | 'mobile';

export interface CodeStep {
  text: string;
  indent?: number;
  highlightId?: string;
  type?: 'statement' | 'loop-start' | 'loop-end' | 'if-start' | 'else' | 'if-end' | 'func-def' | 'func-call' | 'comment';
  action?: 'up' | 'down' | 'left' | 'right' | 'jump';
}

export type GridDotType = 'empty' | 'path' | 'active' | 'visited' | 'target' | 'start' | 'obstacle' | 'key' | 'gate' | 'flag';

export interface GridPosition {
  row: number;
  col: number;
}

export type ColorName = 
  | 'orange' 
  | 'pink' 
  | 'emerald' 
  | 'green' 
  | 'cyan' 
  | 'blue' 
  | 'purple' 
  | 'yellow' 
  | 'red' 
  | 'dark' 
  | 'gray';

export interface ColorDot {
  row: number;
  col: number;
  color: ColorName;
  shape?: 'circle' | 'square';
  label?: string;
}

export interface FlowchartNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'subroutine' | 'end';
  label: string;
  subLabel?: string;
  stepIndex?: number | number[]; // index in stepByStepDirections for active highlight
  yesTargetLabel?: string;
  noTargetLabel?: string;
}

export interface FlowchartData {
  title?: string;
  nodes: FlowchartNode[];
}

export interface Level {
  id: number;
  title: string;
  thaiTitle: string;
  iconEmoji?: string; // Cute level theme icon (e.g. 🚀, 🍎, 👾, 👑)
  themeColor?: string; // Theme color accent
  concept: CodeConcept;
  conceptLabel: string;
  conceptDescription: string;
  hint: string;
  rows: number;
  cols: number;
  cellShape?: 'circle' | 'square'; // 'square' for pixel art / monster boss grids, 'circle' for dot grids
  startPos: GridPosition;
  targetPath: GridPosition[]; // The intended sequence of positions
  codeSnippet: string[]; // Formatted code lines matching the screenshot syntax
  stepByStepDirections: ('up' | 'down' | 'left' | 'right')[]; // Expected sequence of moves
  colorDots?: ColorDot[];
  gridMatrix?: ColorName[][]; // Optional full grid color matrix for pixel-art levels
  codeExplanation: string;
  flowchart?: FlowchartData;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TournamentPlayer {
  id: string;
  name: string;
  score: number;
  levelIndex: number;
  combo: number;
  completedAt?: number;
  isHost?: boolean;
}

export interface TournamentSession {
  id: string;
  code: string;
  status: 'lobby' | 'active' | 'finished';
  durationSeconds: number;
  startedAt?: number;
  players: TournamentPlayer[];
}
