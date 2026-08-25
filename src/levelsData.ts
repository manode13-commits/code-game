import { Level, GridPosition, ColorDot, ColorName } from './types';

// Helper to calculate target path with toroidal wrap-around
function computePath(
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

// Generate color dots matching target path
function generateDotsForPath(
  path: GridPosition[],
  rows: number,
  cols: number,
  primaryColor: ColorName = 'cyan',
  accentColor: ColorName = 'pink'
): ColorDot[] {
  const dots: ColorDot[] = [];
  const pathSet = new Set(path.map(p => `${p.row},${p.col}`));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isStart = path.length > 0 && path[0].row === r && path[0].col === c;
      const isEnd = path.length > 0 && path[path.length - 1].row === r && path[path.length - 1].col === c;
      const isOnPath = pathSet.has(`${r},${c}`);

      if (isEnd) {
        dots.push({ row: r, col: c, color: accentColor });
      } else if (isStart) {
        dots.push({ row: r, col: c, color: 'emerald' });
      } else if (isOnPath) {
        dots.push({ row: r, col: c, color: primaryColor });
      } else {
        dots.push({ row: r, col: c, color: 'gray' });
      }
    }
  }
  return dots;
}

// Base 80 Levels
const rawLevels: Level[] = [
  // =========================================================================
  // โซน 1 (K): ลำดับคำสั่ง & พื้นฐานก้าวเดิน (SEQUENCE) — ด่าน 1 ถึง 20 (20 ด่าน)
  // =========================================================================
  {
    id: 1,
    title: 'First Rocket Steps',
    thaiTitle: 'ด่าน 1: ก้าวแรกสู่จรวดอวกาศ (ลำดับคำสั่ง)',
    iconEmoji: '🚀',
    themeColor: '#38bdf8',
    concept: 'sequence',
    conceptLabel: 'Basic Sequence',
    conceptDescription: 'สั่งการก้าวเดินตรงและเลี้ยวลงทีละขั้นตอนตามลำดับ',
    hint: 'เดินไปทางขวา 2 ก้าว แล้วเลี้ยวลง 1 ก้าว จากนั้นเดินขวาอีก 1 ก้าว',
    rows: 2,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'down', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'down', 'right'], 2, 4),
    colorDots: [
      { row: 0, col: 0, color: 'cyan' }, { row: 0, col: 1, color: 'cyan' }, { row: 0, col: 2, color: 'cyan' }, { row: 0, col: 3, color: 'gray' },
      { row: 1, col: 0, color: 'gray' }, { row: 1, col: 1, color: 'gray' }, { row: 1, col: 2, color: 'yellow' }, { row: 1, col: 3, color: 'pink' },
    ],
    codeSnippet: ['right()', 'right()', 'down()', 'right()'],
    codeExplanation: 'คอมพิวเตอร์จะทำงานตามคำสั่งทีละบรรทัดจากบนลงล่างตามลำดับ (Sequence)',
    difficulty: 'easy',
  },
  {
    id: 2,
    title: 'Apple Orchard Collector',
    thaiTitle: 'ด่าน 2: เก็บแอปเปิ้ลในสวน (เลี้ยวรูปตัว U)',
    iconEmoji: '🍎',
    themeColor: '#4ade80',
    concept: 'sequence',
    conceptLabel: 'U-Turn Sequence',
    conceptDescription: 'เดินเลี้ยวเก็บผลไม้สดใสเป็นรูปตัว U',
    hint: 'เดินขวา เลี้ยวลงสองก้าว เดินขวา แล้วขึ้นด้านบน',
    rows: 3,
    cols: 4,
    startPos: { row: 0, col: 1 },
    stepByStepDirections: ['right', 'down', 'down', 'right', 'up'],
    targetPath: computePath({ row: 0, col: 1 }, ['right', 'down', 'down', 'right', 'up'], 3, 4),
    codeSnippet: ['right()', 'down()', 'down()', 'right()', 'up()'],
    codeExplanation: 'การควบคุมทิศทางอย่างต่อเนื่องเพื่อเก็บไอเทมตามพิกัดที่กำหนด',
    difficulty: 'easy',
  },
  {
    id: 3,
    title: 'Zigzag Mountain Path',
    thaiTitle: 'ด่าน 3: ซิกแซกไต่สันเขา (Zigzag)',
    iconEmoji: '⚡',
    themeColor: '#fbbf24',
    concept: 'sequence',
    conceptLabel: 'Zigzag Pattern',
    conceptDescription: 'เดินสลับทิศทางแบบซิกแซก ไต่ระดับบันได',
    hint: 'ลง ขวา ลง ขวา ขึ้น ขวา',
    rows: 3,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['down', 'right', 'down', 'right', 'up', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['down', 'right', 'down', 'right', 'up', 'right'], 3, 4),
    codeSnippet: ['down()', 'right()', 'down()', 'right()', 'up()', 'right()'],
    codeExplanation: 'การเดินสลับแกน X และ Y เพื่อสร้างรูปแบบเส้นทางแบบขั้นบันได',
    difficulty: 'easy',
  },
  {
    id: 4,
    title: 'Space Dimension Wrap',
    thaiTitle: 'ด่าน 4: วาร์ปมิติอวกาศทะลุขอบ (Wrap Boundary)',
    iconEmoji: '🌌',
    themeColor: '#a855f7',
    concept: 'sequence',
    conceptLabel: 'Warp Boundary',
    conceptDescription: 'เดินทะลุขอบกระดานเพื่อวาร์ปไปปรากฏอีกฝั่งหนึ่งของมิติ',
    hint: 'เดินขวาจนทะลุขอบกระดาน แล้วเดินลง 2 ก้าว',
    rows: 3,
    cols: 3,
    startPos: { row: 0, col: 2 },
    stepByStepDirections: ['right', 'down', 'down', 'right'],
    targetPath: computePath({ row: 0, col: 2 }, ['right', 'down', 'down', 'right'], 3, 3),
    codeSnippet: ['right() // ทะลุขอบขวาไปซ้าย', 'down()', 'down()', 'right()'],
    codeExplanation: 'ในโครงสร้างข้อมูลแบบวงกลม (Ring Buffer) ค่าสุดขอบจะวนกลับมาเริ่มต้นใหม่',
    difficulty: 'easy',
  },
  {
    id: 5,
    title: 'Emerald Castle Gate',
    thaiTitle: 'ด่าน 5: ประตูมรกตแห่งปราสาท (Sequential Maze)',
    iconEmoji: '🏰',
    themeColor: '#10b981',
    concept: 'sequence',
    conceptLabel: 'Castle Sequence',
    conceptDescription: 'เดินรอบกำแพงปราสาทเพื่อปลดล็อกสวิตช์ประตู',
    hint: 'เดินวนรอบกำแพง 4 ทิศทางเพื่อเข้าสู่ใจกลาง',
    rows: 4,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'down', 'down', 'left', 'up', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'down', 'down', 'left', 'up', 'right'], 4, 4),
    codeSnippet: ['right()', 'right()', 'down()', 'down()', 'left()', 'up()', 'right()'],
    codeExplanation: 'การวางแผนเส้นทางที่ซับซ้อนขึ้นด้วยการผสมผสานทั้ง 4 ทิศทางอย่างแม่นยำ',
    difficulty: 'medium',
  },
  {
    id: 6,
    title: 'Robo Laboratory Patrol',
    thaiTitle: 'ด่าน 6: ลาดตระเวนห้องทดลองหุ่นยนต์',
    iconEmoji: '🤖',
    themeColor: '#06b6d4',
    concept: 'sequence',
    conceptLabel: 'Lab Trajectory',
    conceptDescription: 'เดินสำรวจรอบสถานีทดลองเพื่อตรวจสอบเซนเซอร์พลังงาน',
    hint: 'เดินลง 2 ก้าว เลี้ยวขวา 3 ก้าว แล้วขึ้น 1 ก้าว',
    rows: 3,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['down', 'down', 'right', 'right', 'right', 'up'],
    targetPath: computePath({ row: 0, col: 0 }, ['down', 'down', 'right', 'right', 'right', 'up'], 3, 4),
    codeSnippet: ['down()', 'down()', 'right()', 'right()', 'right()', 'up()'],
    codeExplanation: 'การเคลื่อนที่ตามพิกัดเชิงเส้นของแขนกลหุ่นยนต์อุตสาหกรรม',
    difficulty: 'easy',
  },
  {
    id: 7,
    title: 'Diamond Vault Key',
    thaiTitle: 'ด่าน 7: กุญแจห้องนิรภัยเพชร',
    iconEmoji: '💎',
    themeColor: '#3b82f6',
    concept: 'sequence',
    conceptLabel: 'Key Retrieval',
    conceptDescription: 'เดินเก็บกุญแจเพชร 2 ดอกก่อนเข้าสู่ห้องเซฟกลาง',
    hint: 'ขึ้น ขวา ขวา ลง ลง ซ้าย',
    rows: 3,
    cols: 3,
    startPos: { row: 1, col: 0 },
    stepByStepDirections: ['up', 'right', 'right', 'down', 'down', 'left'],
    targetPath: computePath({ row: 1, col: 0 }, ['up', 'right', 'right', 'down', 'down', 'left'], 3, 3),
    codeSnippet: ['up()', 'right()', 'right()', 'down()', 'down()', 'left()'],
    codeExplanation: 'การเรียงลำดับคำสั่งเพื่อแวะผ่านจุดสำคัญตามลำดับเวลาที่กำหนด (Milestones)',
    difficulty: 'medium',
  },
  {
    id: 8,
    title: 'Asteroid Belt Navigation',
    thaiTitle: 'ด่าน 8: หลบหลีกแถบดาวเคราะห์น้อย',
    iconEmoji: '☄️',
    themeColor: '#f97316',
    concept: 'sequence',
    conceptLabel: 'Obstacle Evasion',
    conceptDescription: 'ขับยานอวกาศซิกแซกผ่านช่องว่างระหว่างอุกกาบาต',
    hint: 'ขวา ลง ขวา ขึ้น ขวา ลง ขวา',
    rows: 3,
    cols: 5,
    startPos: { row: 1, col: 0 },
    stepByStepDirections: ['right', 'down', 'right', 'up', 'right', 'down', 'right'],
    targetPath: computePath({ row: 1, col: 0 }, ['right', 'down', 'right', 'up', 'right', 'down', 'right'], 3, 5),
    codeSnippet: ['right()', 'down()', 'right()', 'up()', 'right()', 'down()', 'right()'],
    codeExplanation: 'การสร้างเส้นทางหลบสิ่งกีดขวางด้วยรูปแบบเวฟสั่นสะเทือน',
    difficulty: 'medium',
  },
  {
    id: 9,
    title: 'Cyber Circuit Connector',
    thaiTitle: 'ด่าน 9: เชื่อมต่อวงจรอิเล็กทรอนิกส์',
    iconEmoji: '🔌',
    themeColor: '#ec4899',
    concept: 'sequence',
    conceptLabel: 'Circuit Tracing',
    conceptDescription: 'ลากสายสัญญาณตามเส้นลายทองแดงบนแผง PCB',
    hint: 'เดินเชื่อมจุดต่อทั้ง 4 มุมตามลำดับเข็มนาฬิกา',
    rows: 4,
    cols: 4,
    startPos: { row: 1, col: 1 },
    stepByStepDirections: ['up', 'right', 'right', 'down', 'down', 'left', 'left', 'up'],
    targetPath: computePath({ row: 1, col: 1 }, ['up', 'right', 'right', 'down', 'down', 'left', 'left', 'up'], 4, 4),
    codeSnippet: ['up()', 'right()', 'right()', 'down()', 'down()', 'left()', 'left()', 'up()'],
    codeExplanation: 'การเดินครบรอบวงปิด (Closed Loop Circuit) ในระบบอิเล็กทรอนิกส์',
    difficulty: 'medium',
  },
  {
    id: 10,
    title: 'Neon Portal Jumper',
    thaiTitle: 'ด่าน 10: ประตูวาร์ปนีออนข้ามมิติ',
    iconEmoji: '🌀',
    themeColor: '#8b5cf6',
    concept: 'sequence',
    conceptLabel: 'Double Wrap',
    conceptDescription: 'ใช้วาร์ปขอบบน-ล่างและซ้าย-ขวาอย่างเชี่ยวชาญ',
    hint: 'วาร์ปขึ้นเพื่อโผล่ด้านล่าง แล้ววาร์ปซ้ายเพื่อโผล่ด้านขวา',
    rows: 3,
    cols: 3,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['up', 'left', 'down', 'right', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['up', 'left', 'down', 'right', 'right'], 3, 3),
    codeSnippet: ['up() // โผล่แถวล่าง', 'left() // โผล่ขวาสุด', 'down()', 'right()', 'right()'],
    codeExplanation: 'การคำนวณตำแหน่ง 2D Torus Topology ในระบบเกมและการจำลองฟิสิกส์',
    difficulty: 'medium',
  },
  // ด่าน 11 - 20 (โซน 1 ช่วงหลัง)
  {
    id: 11,
    title: 'Solar Panel Alignment',
    thaiTitle: 'ด่าน 11: จัดตำแหน่งแผงโซลาร์เซลล์',
    iconEmoji: '☀️',
    themeColor: '#eab308',
    concept: 'sequence',
    conceptLabel: 'Grid Sweep',
    conceptDescription: 'หมุนแผงรับแสงอาทิตย์ให้ตรงทิศทางทีละแถว',
    hint: 'ขวา 3 ก้าว ลง 1 ก้าว ซ้าย 3 ก้าว',
    rows: 3,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'right', 'down', 'left', 'left', 'left'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'right', 'down', 'left', 'left', 'left'], 3, 4),
    codeSnippet: ['right()', 'right()', 'right()', 'down()', 'left()', 'left()', 'left()'],
    codeExplanation: 'การกวาดสแกนตารางข้อมูลแบบ Row-by-Row Scan (Raster Scan)',
    difficulty: 'easy',
  },
  {
    id: 12,
    title: 'Deep Sea Submarine',
    thaiTitle: 'ด่าน 12: เรือดำน้ำสำรวจร่องลึกมหาสมุทร',
    iconEmoji: '🌊',
    themeColor: '#0284c7',
    concept: 'sequence',
    conceptLabel: 'Depth Navigation',
    conceptDescription: 'ดำดิ่งสู่ก้นสมุทรและเก็บตัวอย่างสิ่งมีชีวิตเรืองแสง',
    hint: 'ลง 3 ก้าว ขวา 2 ก้าว ขึ้น 2 ก้าว ขวา 1 ก้าว',
    rows: 4,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['down', 'down', 'down', 'right', 'right', 'up', 'up', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['down', 'down', 'down', 'right', 'right', 'up', 'up', 'right'], 4, 4),
    codeSnippet: ['down()', 'down()', 'down()', 'right()', 'right()', 'up()', 'up()', 'right()'],
    codeExplanation: 'การควบคุมระดับความลึกและระยะพิกัดเชิงเส้นทางทะเล',
    difficulty: 'medium',
  },
  {
    id: 13,
    title: 'Wind Turbine Grid',
    thaiTitle: 'ด่าน 13: กังหันลมผลิตไฟฟ้าพลังงานสะอาด',
    iconEmoji: '💨',
    themeColor: '#14b8a6',
    concept: 'sequence',
    conceptLabel: 'Turbine Route',
    conceptDescription: 'ซ่อมแซมใบพัดกังหันลมตามแนวทิศทางลมมรสุม',
    hint: 'ขวา ขึ้น ขวา ลง ขวา ขึ้น ขวา',
    rows: 3,
    cols: 5,
    startPos: { row: 1, col: 0 },
    stepByStepDirections: ['right', 'up', 'right', 'down', 'right', 'up', 'right'],
    targetPath: computePath({ row: 1, col: 0 }, ['right', 'up', 'right', 'down', 'right', 'up', 'right'], 3, 5),
    codeSnippet: ['right()', 'up()', 'right()', 'down()', 'right()', 'up()', 'right()'],
    codeExplanation: 'การวิเคราะห์คลื่นไซน์ (Sine Wave Trajectory) ในการควบคุมพลังงาน',
    difficulty: 'medium',
  },
  {
    id: 14,
    title: 'DNA Helix Strand',
    thaiTitle: 'ด่าน 14: เกลียวคู่พันธุกรรมดีเอ็นเอ',
    iconEmoji: '🧬',
    themeColor: '#6366f1',
    concept: 'sequence',
    conceptLabel: 'Double Helix',
    conceptDescription: 'เชื่อมต่อคู่เบส A-T และ C-G ในสายเกลียวชีววิทยา',
    hint: 'ลง ขวา ขวา ขึ้น ขวา ขวา ลง',
    rows: 3,
    cols: 6,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['down', 'right', 'right', 'up', 'right', 'right', 'down'],
    targetPath: computePath({ row: 0, col: 0 }, ['down', 'right', 'right', 'up', 'right', 'right', 'down'], 3, 6),
    codeSnippet: ['down()', 'right()', 'right()', 'up()', 'right()', 'right()', 'down()'],
    codeExplanation: 'การจับคู่รหัสข้อมูลพันธุกรรมที่เชื่อมต่อกันอย่างเป็นระเบียบ',
    difficulty: 'medium',
  },
  {
    id: 15,
    title: 'Magma Crystal Mine',
    thaiTitle: 'ด่าน 15: เหมืองผลึกคริสตัลใต้ลาวา',
    iconEmoji: '🌋',
    themeColor: '#ef4444',
    concept: 'sequence',
    conceptLabel: 'Lava Passage',
    conceptDescription: 'เดินเลาะแนวหินบะซอลต์เพื่อเก็บผลึกทนความร้อนสูง',
    hint: 'ขวา 2 ก้าว ลง 2 ก้าว ขวา 1 ก้าว ขึ้น 2 ก้าว ขวา 1 ก้าว',
    rows: 4,
    cols: 5,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'down', 'down', 'right', 'up', 'up', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'down', 'down', 'right', 'up', 'up', 'right'], 4, 5),
    codeSnippet: ['right()', 'right()', 'down()', 'down()', 'right()', 'up()', 'up()', 'right()'],
    codeExplanation: 'การเคลื่อนที่หลบหลีกความเสี่ยงด้วยการกำหนดทิศทางล่วงหน้า',
    difficulty: 'medium',
  },
  {
    id: 16,
    title: 'Quantum Satellite Relay',
    thaiTitle: 'ด่าน 16: รีเลย์ดาวเทียมควอนตัม',
    iconEmoji: '🛰️',
    themeColor: '#8b5cf6',
    concept: 'sequence',
    conceptLabel: 'Satellite Hop',
    conceptDescription: 'ส่งสัญญาณเลเซอร์ระหว่างสถานีอวกาศ 5 แห่ง',
    hint: 'ขึ้น ขวา 2 ก้าว ลง 2 ก้าว ซ้าย 1 ก้าว ลง 1 ก้าว',
    rows: 4,
    cols: 4,
    startPos: { row: 1, col: 0 },
    stepByStepDirections: ['up', 'right', 'right', 'down', 'down', 'left', 'down'],
    targetPath: computePath({ row: 1, col: 0 }, ['up', 'right', 'right', 'down', 'down', 'left', 'down'], 4, 4),
    codeSnippet: ['up()', 'right()', 'right()', 'down()', 'down()', 'left()', 'down()'],
    codeExplanation: 'การส่งต่อแพ็กเก็ตข้อมูลผ่านโหนดเครือข่ายอวกาศ (Mesh Network)',
    difficulty: 'hard',
  },
  {
    id: 17,
    title: 'Laser Prism Reflector',
    thaiTitle: 'ด่าน 17: ปริซึมหักเหแสงเลเซอร์',
    iconEmoji: '🔦',
    themeColor: '#d946ef',
    concept: 'sequence',
    conceptLabel: 'Optics Geometry',
    conceptDescription: 'สะท้อนลำแสงเลเซอร์ 90 องศาผ่านกระจกเงาราบ',
    hint: 'ขวา 3 ก้าว ลง 2 ก้าว ซ้าย 2 ก้าว ขึ้น 1 ก้าว',
    rows: 4,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'right', 'down', 'down', 'left', 'left', 'up'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'right', 'down', 'down', 'left', 'left', 'up'], 4, 4),
    codeSnippet: ['right()', 'right()', 'right()', 'down()', 'down()', 'left()', 'left()', 'up()'],
    codeExplanation: 'กฎการสะท้อนของแสง: มุมตกกระทบเท่ากับมุมสะท้อน',
    difficulty: 'hard',
  },
  {
    id: 18,
    title: 'Aurora Borealis Flow',
    thaiTitle: 'ด่าน 18: แสงเหนือออโรราขั้วโลก',
    iconEmoji: '✨',
    themeColor: '#22c55e',
    concept: 'sequence',
    conceptLabel: 'Wave Trajectory',
    conceptDescription: 'ลัดเลาะตามสนามแม่เหล็กโลกที่ดักจับอนุภาคลมสุริยะ',
    hint: 'ลง ขวา ขึ้น ขวา ขวา ลง ซ้าย ลง ขวา',
    rows: 4,
    cols: 5,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['down', 'right', 'up', 'right', 'right', 'down', 'left', 'down', 'right'],
    targetPath: computePath({ row: 0, col: 0 }, ['down', 'right', 'up', 'right', 'right', 'down', 'left', 'down', 'right'], 4, 5),
    codeSnippet: ['down()', 'right()', 'up()', 'right()', 'right()', 'down()', 'left()', 'down()', 'right()'],
    codeExplanation: 'การเคลื่อนที่ของประจุไฟฟ้าในสนามแม่เหล็กโลก (Lorentz Force)',
    difficulty: 'hard',
  },
  {
    id: 19,
    title: 'Cyber Security Firewall',
    thaiTitle: 'ด่าน 19: กำแพงไฟไซเบอร์ซีเคียวริตี้',
    iconEmoji: '🛡️',
    themeColor: '#f43f5e',
    concept: 'sequence',
    conceptLabel: 'Encryption Maze',
    conceptDescription: 'ถอดรหัสกุญแจเข้ารหัส 256-bit ผ่านเส้นทางนิรภัย',
    hint: 'ขวา 2 ก้าว ลง 1 ก้าว ขวา 1 ก้าว ลง 2 ก้าว ซ้าย 3 ก้าว ขึ้น 1 ก้าว',
    rows: 4,
    cols: 4,
    startPos: { row: 0, col: 0 },
    stepByStepDirections: ['right', 'right', 'down', 'right', 'down', 'down', 'left', 'left', 'left', 'up'],
    targetPath: computePath({ row: 0, col: 0 }, ['right', 'right', 'down', 'right', 'down', 'down', 'left', 'left', 'left', 'up'], 4, 4),
    codeSnippet: ['right()', 'right()', 'down()', 'right()', 'down()', 'down()', 'left()', 'left()', 'left()', 'up()'],
    codeExplanation: 'การเข้ารหัสข้อมูลที่ต้องเดินผ่านทุกโหนดรักษาความปลอดภัยอย่างครบถ้วน',
    difficulty: 'hard',
  },
  {
    id: 20,
    title: 'Boss 1: The Sequence Titan',
    thaiTitle: 'ด่าน 20: บอสยักษ์ไททันแห่งลำดับขั้นตอน 👑',
    iconEmoji: '👑',
    themeColor: '#fbbf24',
    concept: 'challenge',
    conceptLabel: 'Zone 1 Boss',
    conceptDescription: 'บททดสอบบอสใหญ่โซน 1! พิชิตมงกุฎแห่งลำดับคำสั่งที่สมบูรณ์แบบ',
    hint: 'ขึ้นสู่ยอดมงกุฎกลาง แล้วสแกนยอดซ้ายและขวาให้ครบทั้ง 3 ยอด',
    rows: 5,
    cols: 5,
    cellShape: 'square',
    startPos: { row: 3, col: 2 },
    stepByStepDirections: ['up', 'up', 'up', 'down', 'left', 'up', 'down', 'right', 'right', 'up'],
    targetPath: computePath({ row: 3, col: 2 }, ['up', 'up', 'up', 'down', 'left', 'up', 'down', 'right', 'right', 'up'], 5, 5),
    codeSnippet: ['up()', 'up()', 'up()', 'down()', 'left()', 'up()', 'down()', 'right()', 'right()', 'up()'],
    codeExplanation: '🎉 ยินดีด้วย! คุณพิชิต Zone 1: Sequence สำเร็จ 20 ด่านแรก!',
    difficulty: 'hard',
  },
];

// Dynamically generate remaining levels up to 80 with rich algorithmic logic
const zoneThemes = [
  { zone: 'P', name: 'Loops & Iterations (การวนซ้ำ)', startId: 21, endId: 40, concept: 'loop' as const, emoji: '🔁', color: '#06b6d4' },
  { zone: 'S', name: 'Conditionals & Logic (เงื่อนไขและการตัดสินใจ)', startId: 41, endId: 60, concept: 'condition' as const, emoji: '🔀', color: '#a855f7' },
  { zone: 'W', name: 'Functions & Master Bosses (ฟังก์ชันและอัลกอริทึม)', startId: 61, endId: 80, concept: 'function' as const, emoji: '⚡', color: '#10b981' },
];

const patterns: {
  titlePrefix: string;
  thaiPrefix: string;
  dirs: ('up' | 'down' | 'left' | 'right')[];
  rows: number;
  cols: number;
  start: GridPosition;
  codeGen: (id: number) => string[];
  explanation: string;
}[] = [
  {
    titlePrefix: 'Loop Spiral Step',
    thaiPrefix: 'วนซ้ำเกลียวสไปรัล',
    dirs: ['right', 'right', 'down', 'down', 'left', 'left', 'up'],
    rows: 3,
    cols: 3,
    start: { row: 0, col: 0 },
    codeGen: (id) => ['for (let i = 0; i < 2; i++) {', '  stepRight()', '  stepDown()', '}', 'stepLeft()', 'stepUp()'],
    explanation: 'การวนซ้ำรอบศูนย์กลางตามลำดับเกลียวคลื่น',
  },
  {
    titlePrefix: 'Staircase Repeat',
    thaiPrefix: 'บันไดวนซ้ำขั้นคู่',
    dirs: ['up', 'right', 'up', 'right', 'up', 'right'],
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0 },
    codeGen: (id) => ['repeat (3) {', '  stepUp()', '  stepRight()', '}'],
    explanation: 'ลดรูปคำสั่ง 6 บรรทัดเหลือเพียงบล็อก repeat 3 รอบ',
  },
  {
    titlePrefix: 'Wave Oscillator',
    thaiPrefix: 'คลื่นฮาร์มอนิกสลับทิศ',
    dirs: ['down', 'right', 'up', 'right', 'down', 'right', 'up'],
    rows: 3,
    cols: 5,
    start: { row: 1, col: 0 },
    codeGen: (id) => ['while (hasPath()) {', '  waveOscillate()', '}'],
    explanation: 'รูปแบบคลื่นลูกคลื่นคาบซ้ำสม่ำเสมอ',
  },
  {
    titlePrefix: 'Box Perimeter Patrol',
    thaiPrefix: 'ตรวจการณ์รอบสี่เหลี่ยม',
    dirs: ['right', 'right', 'right', 'down', 'down', 'left', 'left', 'left', 'up', 'up'],
    rows: 3,
    cols: 4,
    start: { row: 0, col: 0 },
    codeGen: (id) => ['for (const side of sides) {', '  patrolEdge(side)', '}'],
    explanation: 'การลาดตระเวนรอบขอบเขตเรขาคณิต 4 ด้าน',
  },
  {
    titlePrefix: 'Decision Color Sensor',
    thaiPrefix: 'เซนเซอร์เลือกเส้นทาง',
    dirs: ['right', 'down', 'right', 'right', 'up', 'right'],
    rows: 3,
    cols: 5,
    start: { row: 1, col: 0 },
    codeGen: (id) => ['if (sensor.isColor("green")) {', '  turnRight()', '} else {', '  turnLeft()', '}'],
    explanation: 'การตรวจสอบเงื่อนไขบูลีนจริง/เท็จเพื่อเลือกเส้นทาง',
  },
  {
    titlePrefix: 'Multi-Condition Junction',
    thaiPrefix: 'ทางแยกหลายเงื่อนไข',
    dirs: ['down', 'down', 'right', 'up', 'right', 'down'],
    rows: 3,
    cols: 4,
    start: { row: 0, col: 0 },
    codeGen: (id) => ['if (energy > 80) {', '  dash()', '} else if (energy > 40) {', '  walk()', '} else { rest() }'],
    explanation: 'โครงสร้างควบคุม If - Else If - Else หลายทางเลือก',
  },
  {
    titlePrefix: 'Reusable Subroutine Def',
    thaiPrefix: 'สร้างฟังก์ชันย่อยเรียกซ้ำ',
    dirs: ['up', 'right', 'right', 'down', 'right', 'up'],
    rows: 3,
    cols: 4,
    start: { row: 2, col: 0 },
    codeGen: (id) => ['function jumpArch() {', '  up()', '  right()', '  right()', '  down()', '}', 'jumpArch()', 'right()', 'up()'],
    explanation: 'การห่อหุ้มชุดคำสั่งเป็นฟังก์ชัน (Modularity & Reusability)',
  },
  {
    titlePrefix: 'Quantum Teleport Hop',
    thaiPrefix: 'วาร์ปกระโดดข้ามมิติ',
    dirs: ['right', 'right', 'down', 'left', 'left', 'down', 'right', 'right'],
    rows: 3,
    cols: 3,
    start: { row: 0, col: 0 },
    codeGen: (id) => ['def quantumHop():', '    for i in range(2):', '        sweepRow()', 'quantumHop()'],
    explanation: 'การประสานฟังก์ชันและการวนลูปเพื่อครอบคลุมทุกพิกัด',
  },
];

const emojis = ['🌟', '🔥', '💎', '🚀', '👾', '🌈', '🧩', '🏆', '🎯', '🧪', '🛸', '⚡', '🤖', '🛰️', '👑'];

// Generate remaining levels 21 to 80
for (let id = 21; id <= 80; id++) {
  const zoneInfo = id <= 40 ? zoneThemes[0] : id <= 60 ? zoneThemes[1] : zoneThemes[2];
  const pattern = patterns[(id - 21) % patterns.length];
  const emoji = id === 80 ? '👑' : emojis[(id * 3) % emojis.length];
  const isFinalBoss = id === 80;
  const isZoneBoss = id === 40 || id === 60 || id === 80;

  const dirs: ('up' | 'down' | 'left' | 'right')[] = isFinalBoss
    ? ['up', 'up', 'right', 'right', 'down', 'down', 'left', 'up', 'right']
    : pattern.dirs;

  const rows = isFinalBoss ? 5 : pattern.rows;
  const cols = isFinalBoss ? 5 : pattern.cols;
  const startPos = isFinalBoss ? { row: 3, col: 1 } : pattern.start;
  const path = computePath(startPos, dirs, rows, cols);

  const difficulty = id <= 30 ? 'easy' : id <= 60 ? 'medium' : 'hard';

  rawLevels.push({
    id,
    title: isFinalBoss ? 'The Ultimate 80-Level Grand Master Crown' : `${pattern.titlePrefix} ${id}`,
    thaiTitle: isFinalBoss
      ? 'ด่าน 80: อภิมหาแกรนด์มาสเตอร์ มงกุฎทองคำสูงสุด 80 ภารกิจ! 👑'
      : `ด่าน ${id}: ${pattern.thaiPrefix} (${zoneInfo.name})`,
    iconEmoji: emoji,
    themeColor: zoneInfo.color,
    concept: isZoneBoss ? 'challenge' : zoneInfo.concept,
    conceptLabel: isFinalBoss ? 'Ultimate Grand Master' : `${zoneInfo.zone} - Level ${id}`,
    conceptDescription: isFinalBoss
      ? 'บททดสอบสูงสุดแห่งการคิดเชิงคำนวณและโค้ดดิ้งครบ 80 ด่านบริบูรณ์!'
      : `ประยุกต์ใช้แนวคิด ${zoneInfo.name} เพื่อนำทางสู่เป้าหมายอย่างแม่นยำ`,
    hint: `ทิศทาง: ${dirs.map(d => (d === 'up' ? 'ขึ้น' : d === 'down' ? 'ลง' : d === 'left' ? 'ซ้าย' : 'ขวา')).join(' -> ')}`,
    rows,
    cols,
    cellShape: isZoneBoss ? 'square' : 'circle',
    startPos,
    stepByStepDirections: dirs,
    targetPath: path,
    colorDots: generateDotsForPath(path, rows, cols, id % 2 === 0 ? 'cyan' : 'emerald', 'pink'),
    codeSnippet: pattern.codeGen(id),
    codeExplanation: isFinalBoss
      ? '🎉 ยอดเยี่ยมที่สุดในประวัติศาสตร์! คุณได้พิชิตครบทั้ง 80 ด่านของ KPSW Coding Quest และได้รับใบเกียรติบัตรแห่งเกียรติยศระดับสูงสุด 🏆'
      : pattern.explanation,
    difficulty,
  });
}

export const LEVELS: Level[] = rawLevels;
export const GAME_LEVELS = LEVELS;
