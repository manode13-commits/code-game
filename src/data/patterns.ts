import { LevelPattern } from '../types';

export const PATTERNS: LevelPattern[] = [
  // =========================================================================
  // Pattern 1: Staircase Step (บันไดสลับก้าว 3 ขั้น)
  // Dirs: up -> right -> up -> right -> up -> right (6 steps)
  // =========================================================================
  {
    titlePrefix: 'Staircase Step',
    thaiPrefix: 'บันไดสลับก้าว',
    dirs: ['up', 'right', 'up', 'right', 'up', 'right'],
    rows: 4,
    cols: 4,
    start: { row: 3, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (3) {',
          '  up()',
          '  right()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'repeat (3) {',
          '  if 🟢 {',
          '    up()',
          '    right()',
          '  }',
          '}',
        ];
      }
      return [
        'function climbStep() {',
        '  up()',
        '  right()',
        '}',
        '',
        'repeat (3) {',
        '  climbStep()',
        '}',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat (3 รอบ) ก้าวขึ้นและเดินขวาตามแนวบันได';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🟢 ตรวจจับจุดสีเขียวเพื่อก้าวขึ้นและเดินขวาทีละขั้น';
      return 'สร้างฟังก์ชัน climbStep() บรรจุคำสั่งก้าวขึ้นและเดินขวา แล้วเรียกวนซ้ำ 3 ครั้ง';
    },
  },

  // =========================================================================
  // Pattern 2: Wave Harmonic (คลื่นลูกสลับทิศ 2 ลูก)
  // Dirs: down -> right -> up -> right -> down -> right -> up -> right (8 steps)
  // =========================================================================
  {
    titlePrefix: 'Wave Harmonic',
    thaiPrefix: 'คลื่นลูกสลับทิศ',
    dirs: ['down', 'right', 'up', 'right', 'down', 'right', 'up', 'right'],
    rows: 3,
    cols: 5,
    start: { row: 1, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (2) {',
          '  down()',
          '  right()',
          '  up()',
          '  right()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'repeat (2) {',
          '  if 🟢 {',
          '    down()',
          '    right()',
          '    up()',
          '    right()',
          '  }',
          '}',
        ];
      }
      return [
        'function wavePulse() {',
        '  down()',
        '  right()',
        '  up()',
        '  right()',
        '}',
        '',
        'repeat (2) {',
        '  wavePulse()',
        '}',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat (2) ก้าวคลื่นลงและขึ้น 2 ลูกสมบูรณ์';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🟢 ตรวจสอบสีเขียวเพื่อก้าวตามวงรอบคลื่น';
      return 'สร้างฟังก์ชัน wavePulse() รวมวงรอบคลื่นเป็นฟังก์ชันย่อยแล้วเรียกใช้ 2 รอบ';
    },
  },

  // =========================================================================
  // Pattern 3: Spiral Center Walk (วนซ้ำเกลียวสไปรัล)
  // Dirs: right -> right -> down -> down -> left -> left -> up -> right (8 steps)
  // =========================================================================
  {
    titlePrefix: 'Spiral Center Walk',
    thaiPrefix: 'วนซ้ำเกลียวสไปรัล',
    dirs: ['right', 'right', 'down', 'down', 'left', 'left', 'up', 'right'],
    rows: 3,
    cols: 3,
    start: { row: 0, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (2) {',
          '  right()',
          '}',
          'repeat (2) {',
          '  down()',
          '}',
          'repeat (2) {',
          '  left()',
          '}',
          'up()',
          'right()',
        ];
      }
      if (concept === 'condition') {
        return [
          'if 🔴 {',
          '  repeat (2) {',
          '    right()',
          '  }',
          '  repeat (2) {',
          '    down()',
          '  }',
          '  repeat (2) {',
          '    left()',
          '  }',
          '  up()',
          '  right()',
          '}',
        ];
      }
      return [
        'function sweepCorner() {',
        '  repeat (2) {',
        '    right()',
        '  }',
        '  repeat (2) {',
        '    down()',
        '  }',
        '  repeat (2) {',
        '    left()',
        '  }',
        '  up()',
        '  right()',
        '}',
        '',
        'sweepCorner()',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat เดินวนขวาและลงเข้าสู่จุดศูนย์กลาง';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🔴 ตรวจสอบจุดสีแดงเพื่อเลี้ยวเข้ามุมเกลียว';
      return 'สร้างฟังก์ชัน sweepCorner() เพื่อจัดการการเลี้ยวตามมุม';
    },
  },

  // =========================================================================
  // Pattern 4: Archway Bridge (สะพานซุ้มโค้ง 2 ซุ้ม)
  // Dirs: up -> right -> right -> down -> up -> right -> right -> down (8 steps)
  // =========================================================================
  {
    titlePrefix: 'Archway Bridge',
    thaiPrefix: 'สะพานซุ้มโค้ง',
    dirs: ['up', 'right', 'right', 'down', 'up', 'right', 'right', 'down'],
    rows: 3,
    cols: 5,
    start: { row: 2, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (2) {',
          '  up()',
          '  right()',
          '  right()',
          '  down()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'repeat (2) {',
          '  if 🟠 {',
          '    up()',
          '    right()',
          '    right()',
          '    down()',
          '  }',
          '}',
        ];
      }
      return [
        'function jumpArch() {',
        '  up()',
        '  right()',
        '  right()',
        '  down()',
        '}',
        '',
        'repeat (2) {',
        '  jumpArch()',
        '}',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat ในการกระโดดข้ามซุ้มสะพาน 2 รอบ';
      if (concept === 'condition') return 'โครงสร้าง if 🟠 ตรวจสอบจุดสีส้มเพื่อข้ามสิ่งกีดขวาง 2 สะพาน';
      return 'สร้างฟังก์ชัน jumpArch() เพื่อนำกลับมาใช้ซ้ำ 2 รอบ';
    },
  },

  // =========================================================================
  // Pattern 5: Box Perimeter Loop (ตรวจการณ์รอบสี่เหลี่ยม)
  // Dirs: right(3) -> down(2) -> left(3) -> up(2) (10 steps)
  // =========================================================================
  {
    titlePrefix: 'Box Perimeter Loop',
    thaiPrefix: 'ตรวจการณ์รอบสี่เหลี่ยม',
    dirs: ['right', 'right', 'right', 'down', 'down', 'left', 'left', 'left', 'up', 'up'],
    rows: 3,
    cols: 4,
    start: { row: 0, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (3) {',
          '  right()',
          '}',
          'repeat (2) {',
          '  down()',
          '}',
          'repeat (3) {',
          '  left()',
          '}',
          'repeat (2) {',
          '  up()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'if 🔵 {',
          '  repeat (3) {',
          '    right()',
          '  }',
          '  repeat (2) {',
          '    down()',
          '  }',
          '  repeat (3) {',
          '    left()',
          '  }',
          '  repeat (2) {',
          '    up()',
          '  }',
          '}',
        ];
      }
      return [
        'function walkPerimeter() {',
        '  repeat (3) {',
        '    right()',
        '  }',
        '  repeat (2) {',
        '    down()',
        '  }',
        '  repeat (3) {',
        '    left()',
        '  }',
        '  repeat (2) {',
        '    up()',
        '  }',
        '}',
        '',
        'walkPerimeter()',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat เพื่อเดินตรวจการณ์รอบ 4 ด้าน';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🔵 ตรวจสอบจุดสีฟ้าก่อนก้าวเดินตามขอบ';
      return 'สร้างฟังก์ชัน walkPerimeter() เพื่อเดินวนรอบกรอบสี่เหลี่ยม';
    },
  },

  // =========================================================================
  // Pattern 6: Color Sensor Junction (เซนเซอร์เลือกเส้นทาง)
  // Dirs: right -> down -> right -> right -> up -> right (6 steps)
  // =========================================================================
  {
    titlePrefix: 'Color Sensor Junction',
    thaiPrefix: 'เซนเซอร์เลือกเส้นทาง',
    dirs: ['right', 'down', 'right', 'right', 'up', 'right'],
    rows: 3,
    cols: 5,
    start: { row: 1, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'right()',
          'down()',
          'repeat (2) {',
          '  right()',
          '}',
          'up()',
          'right()',
        ];
      }
      if (concept === 'condition') {
        return [
          'if 🟢 {',
          '  right()',
          '  down()',
          '  repeat (2) {',
          '    right()',
          '  }',
          '  up()',
          '  right()',
          '}',
        ];
      }
      return [
        'function sensorStep() {',
        '  right()',
        '  down()',
        '  repeat (2) {',
        '    right()',
        '  }',
        '  up()',
        '  right()',
        '}',
        '',
        'sensorStep()',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'การวนซ้ำ repeat ก้าวผ่านจุดเซนเซอร์';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🟢 ตรวจจับค่าสีจากเซนเซอร์เพื่อตัดสินใจเลี้ยว';
      return 'สร้างฟังก์ชัน sensorStep() เพื่อจัดการการเคลื่อนที่';
    },
  },

  // =========================================================================
  // Pattern 7: Multi-Branch Zigzag (ทางแยกหลายทิศทาง)
  // Dirs: down(2) -> right -> up(2) -> right -> down(2) (8 steps)
  // =========================================================================
  {
    titlePrefix: 'Multi-Branch Zigzag',
    thaiPrefix: 'ทางแยกหลายทิศทาง',
    dirs: ['down', 'down', 'right', 'up', 'up', 'right', 'down', 'down'],
    rows: 3,
    cols: 4,
    start: { row: 0, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (2) {',
          '  down()',
          '}',
          'right()',
          'repeat (2) {',
          '  up()',
          '}',
          'right()',
          'repeat (2) {',
          '  down()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'if 🟣 {',
          '  repeat (2) {',
          '    down()',
          '  }',
          '  right()',
          '  repeat (2) {',
          '    up()',
          '  }',
          '  right()',
          '  repeat (2) {',
          '    down()',
          '  }',
          '}',
        ];
      }
      return [
        'function zigZagStep() {',
        '  repeat (2) {',
        '    down()',
        '  }',
        '  right()',
        '  repeat (2) {',
        '    up()',
        '  }',
        '  right()',
        '  repeat (2) {',
        '    down()',
        '  }',
        '}',
        '',
        'zigZagStep()',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat (2) ควบคุมทิศทางซิกแซกสลับขึ้นลง';
      if (concept === 'condition') return 'โครงสร้างเงื่อนไข if 🟣 ตรวจสอบจุดสีม่วงเพื่อเลือกเส้นทาง';
      return 'สร้างฟังก์ชัน zigZagStep() รวมลำดับคำสั่งเลี้ยวซิกแซก';
    },
  },

  // =========================================================================
  // Pattern 8: Grid Hopper Sweep (กวาดพื้นที่ตาราง)
  // Dirs: right(2) -> down -> left(2) -> down -> right(2) (8 steps)
  // =========================================================================
  {
    titlePrefix: 'Grid Hopper Sweep',
    thaiPrefix: 'กวาดพื้นที่ตาราง',
    dirs: ['right', 'right', 'down', 'left', 'left', 'down', 'right', 'right'],
    rows: 3,
    cols: 3,
    start: { row: 0, col: 0 },
    codeGenByZone: (concept) => {
      if (concept === 'loop') {
        return [
          'repeat (2) {',
          '  right()',
          '}',
          'down()',
          'repeat (2) {',
          '  left()',
          '}',
          'down()',
          'repeat (2) {',
          '  right()',
          '}',
        ];
      }
      if (concept === 'condition') {
        return [
          'if 🟡 {',
          '  repeat (2) {',
          '    right()',
          '  }',
          '  down()',
          '  repeat (2) {',
          '    left()',
          '  }',
          '  down()',
          '  repeat (2) {',
          '    right()',
          '  }',
          '}',
        ];
      }
      return [
        'function sweepRow() {',
        '  repeat (2) {',
        '    right()',
        '  }',
        '  down()',
        '  repeat (2) {',
        '    left()',
        '  }',
        '  down()',
        '  repeat (2) {',
        '    right()',
        '  }',
        '}',
        '',
        'sweepRow()',
      ];
    },
    explanationByZone: (concept) => {
      if (concept === 'loop') return 'โครงสร้าง repeat กวาดตารางทีละแถวครบทุกทิศทาง';
      if (concept === 'condition') return 'โครงสร้าง if 🟡 ตรวจสอบจุดสีเหลืองเพื่อสลับทิศทางซ้าย-ขวา';
      return 'สร้างฟังก์ชัน sweepRow() เพื่อกวาดเดินข้ามแถวอย่างเป็นระเบียบ';
    },
  },
];
