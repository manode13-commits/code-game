import { Level, FlowchartData } from '../types';

export function getLevelFlowchart(level: Level): FlowchartData {
  if (level.flowchart) {
    return level.flowchart;
  }

  // Pre-configured standard ISO flowcharts matching code and stepByStepDirections for Levels 1 - 20:
  switch (level.id) {
    // =============================================================
    // หมวด K (ลำดับคำสั่ง & พื้นฐาน): ด่าน 1 ถึง 5
    // =============================================================
    case 1:
      return {
        title: 'ผังงานลำดับคำสั่ง: ด่าน 1 ก้าวแรกจรวด',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'step0', type: 'process', label: 'เดินขวา right()', stepIndex: 0 },
          { id: 'step1', type: 'process', label: 'เดินขวา right()', stepIndex: 1 },
          { id: 'step2', type: 'process', label: 'เดินลง down()', stepIndex: 2 },
          { id: 'step3', type: 'process', label: 'เดินขวา right()', stepIndex: 3 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 2:
      return {
        title: 'ผังงานเลี้ยวรูปตัว U: ด่าน 2 เก็บผลไม้',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'step0', type: 'process', label: 'เดินขวา right()', stepIndex: 0 },
          { id: 'step1', type: 'process', label: 'เดินลง 2 ก้าว', subLabel: 'down() ➔ down()', stepIndex: [1, 2] },
          { id: 'step2', type: 'process', label: 'เดินขวา right()', stepIndex: 3 },
          { id: 'step3', type: 'process', label: 'เดินขึ้น up()', stepIndex: 4 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 3:
      return {
        title: 'ผังงานวาดกล่อง 4 ทิศ: ด่าน 3 กล่องสี่เหลี่ยม',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'step0', type: 'process', label: 'เดินขวา 2 ก้าว', subLabel: 'right() x2', stepIndex: [0, 1] },
          { id: 'step1', type: 'process', label: 'เดินลง down()', stepIndex: 2 },
          { id: 'step2', type: 'process', label: 'เดินซ้าย 2 ก้าว', subLabel: 'left() x2', stepIndex: [3, 4] },
          { id: 'step3', type: 'process', label: 'เดินขึ้น up()', stepIndex: 5 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 4:
      return {
        title: 'ผังงานบันไดสายฟ้าซิกแซก: ด่าน 4',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'step0', type: 'process', label: 'ขั้นที่ 1: ขึ้น ➔ ขวา', subLabel: 'up() ➔ right()', stepIndex: [0, 1] },
          { id: 'step1', type: 'process', label: 'ขั้นที่ 2: ขึ้น ➔ ขวา', subLabel: 'up() ➔ right()', stepIndex: [2, 3] },
          { id: 'step2', type: 'process', label: 'ขั้นที่ 3: ลง ➔ ขวา', subLabel: 'down() ➔ right()', stepIndex: [4, 5] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 5:
      return {
        title: 'ผังงานวาร์ปทะลุขอบมิติ: ด่าน 5 Toroidal Warp',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'step0', type: 'process', label: 'ขึ้น 2 ก้าว (วาร์ปทะลุขอบบนไปล่าง)', subLabel: 'up() x2 [Warp]', stepIndex: [0, 1] },
          { id: 'step1', type: 'process', label: 'เดินขวา 2 ก้าว', subLabel: 'right() x2', stepIndex: [2, 3] },
          { id: 'step2', type: 'process', label: 'เดินลง down()', stepIndex: 4 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    // =============================================================
    // หมวด P (การวนซ้ำ Loops & Repeat): ด่าน 6 ถึง 10
    // =============================================================
    case 6:
      return {
        title: 'ผังงานวนลูป repeat (4): ด่าน 6 ก้าวบันได',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'init', type: 'process', label: 'กำหนดตัวนับ count = 1' },
          { id: 'loop_check', type: 'decision', label: 'count ≤ 4 ?', yesTargetLabel: 'จริง (ทำในลูป)', noTargetLabel: 'เท็จ (จบลูป)' },
          { id: 'loop_body', type: 'process', label: 'ขึ้น ➔ ขวา (up, right)', subLabel: 'count = count + 1', stepIndex: [0, 1, 2, 3, 4, 5, 6, 7] },
          { id: 'post_loop', type: 'process', label: 'เดินลง down() (นอกลูป)', stepIndex: 8 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 7:
      return {
        title: 'ผังงานไต่บันได repeat (5): ด่าน 7 สายรุ้ง',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'init', type: 'process', label: 'กำหนดตัวนับ step = 1' },
          { id: 'loop_check', type: 'decision', label: 'step ≤ 5 ?', yesTargetLabel: 'จริง (ไต่ต่อ)', noTargetLabel: 'ครบ 5 ขั้น' },
          { id: 'loop_body', type: 'process', label: 'ไต่ขั้น: ขึ้น ➔ ขวา', subLabel: 'up() ➔ right()', stepIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 8:
      return {
        title: 'ผังงานวิ่งสำรวจขอบ repeat (3): ด่าน 8',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'init', type: 'process', label: 'กำหนดรอบ lap = 1' },
          { id: 'loop_check', type: 'decision', label: 'lap ≤ 3 ?', yesTargetLabel: 'จริง (วิ่งรอบ)', noTargetLabel: 'ครบ 3 รอบ' },
          { id: 'loop_body', type: 'process', label: 'ขวา 2 ก้าว ➔ ลง 1 ก้าว', subLabel: 'right() x2, down()', stepIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 9:
      return {
        title: 'ผังงานลูปเช็คสี while 🟢: ด่าน 9 เส้นทางเขียว',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'while_check', type: 'decision', label: 'อยู่บนจุดสีเขียว 🟢 ?', yesTargetLabel: 'จริง (เดินต่อ)', noTargetLabel: 'พ้นสีเขียว' },
          { id: 'while_body', type: 'process', label: 'เดินขวา right()', stepIndex: [0, 1, 2, 3] },
          { id: 'exit_loop', type: 'process', label: 'เดินลง down() (จบลูป)', stepIndex: 4 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 10:
      return {
        title: 'ผังงานขุดเจาะเหมือง while 🟢: ด่าน 10 มรกต',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'while_check', type: 'decision', label: 'เจอมรกตสีเขียว 🟢 ?', yesTargetLabel: 'จริง (ขุดต่อ)', noTargetLabel: 'หมดสายแร่' },
          { id: 'while_body', type: 'process', label: 'ขุดทแยง: ลง ➔ ขวา', subLabel: 'down() ➔ right()', stepIndex: [0, 1, 2, 3, 4, 5] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    // =============================================================
    // หมวด S (เงื่อนไขและการตัดสินใจ Conditionals): ด่าน 11 ถึง 15
    // =============================================================
    case 11:
      return {
        title: 'ผังงานเซนเซอร์สี if 🟠: ด่าน 11 ตรวจจับสีส้ม',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้นรอบ (Start)' },
          { id: 'up_step', type: 'process', label: 'ก้าวขึ้น up()', stepIndex: [0, 3, 6, 9, 11] },
          { id: 'if_check', type: 'decision', label: 'เป็นสีส้ม 🟠 ?', yesTargetLabel: 'จริง (เลี้ยวซ้าย)', noTargetLabel: 'เท็จ (ไม่เลี้ยว)' },
          { id: 'if_body', type: 'process', label: 'เลี้ยวซ้าย left()', stepIndex: [1, 4, 7] },
          { id: 'down_step', type: 'process', label: 'ก้าวลง down()', stepIndex: [2, 5, 8, 10, 12] },
          { id: 'end', type: 'end', label: 'จบรอบลูป (repeat 5)' },
        ],
      };

    case 12:
      return {
        title: 'ผังงานเช็คสีส้มก้าวลง if 🟠: ด่าน 12 ทแยงมุม',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'if_check', type: 'decision', label: 'ตรวจพบสีส้ม 🟠 ?', yesTargetLabel: 'จริง (ก้าวลง)', noTargetLabel: 'ไม่ใช่ (ข้าม)' },
          { id: 'if_body', type: 'process', label: 'ก้าวลง down()', stepIndex: [1, 3, 5] },
          { id: 'right_step', type: 'process', label: 'ก้าวขวา right() เสมอ', stepIndex: [0, 2, 4, 6] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 13:
      return {
        title: 'ผังงานทางแยกสองสี if 🟢 else 🟠: ด่าน 13',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'if1', type: 'decision', label: 'จุดแรกเป็นสีเขียว 🟢 ?', yesTargetLabel: 'จริง (ขวา ➔ ลง)', noTargetLabel: 'เท็จ (ขึ้น)' },
          { id: 'if1_body', type: 'process', label: 'เดินขวา ➔ เดินลง', subLabel: 'right() ➔ down()', stepIndex: [0, 1] },
          { id: 'if2', type: 'decision', label: 'จุดที่สองเป็นสีส้ม 🟠 ?', yesTargetLabel: 'จริง (ลง 2 ครั้ง)', noTargetLabel: 'เท็จ: else (ซ้าย)' },
          { id: 'else2_body', type: 'process', label: 'เดินซ้าย left() (เข้า else)', stepIndex: 2 },
          { id: 'final_step', type: 'process', label: 'เดินขึ้น up()', stepIndex: 3 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 14:
      return {
        title: 'ผังงานสัญญาณไฟ 3 ทาง if-else if: ด่าน 14',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'check_red', type: 'decision', label: 'สีแดง 🔴 ?', yesTargetLabel: 'จริง (ซ้าย left)', noTargetLabel: 'เช็คถัดไป' },
          { id: 'red_action', type: 'process', label: 'เลี้ยวซ้าย left()', stepIndex: [2, 4] },
          { id: 'check_yellow', type: 'decision', label: 'สีเหลือง 🟡 ?', yesTargetLabel: 'จริง (ลง down)', noTargetLabel: 'เขียว 🟢 (ขวา)' },
          { id: 'yellow_action', type: 'process', label: 'เดินลง down()', stepIndex: 0 },
          { id: 'green_action', type: 'process', label: 'เดินขวา right() (else)', stepIndex: [1, 3, 5] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 15:
      return {
        title: 'ผังงานเข็มทิศ 4 สี 4 ทิศทาง: ด่าน 15 บอสเงื่อนไข',
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          { id: 'sensor', type: 'decision', label: 'อ่านสี 4 ทิศ (🔵 🟡 🔴 🟢)', yesTargetLabel: 'ตรงเงื่อนไข' },
          { id: 'act_red', type: 'process', label: '🔴 แดง: เดินขวา right()', stepIndex: [0, 2] },
          { id: 'act_yellow', type: 'process', label: '🟡 เหลือง: เดินลง down()', stepIndex: [1, 3] },
          { id: 'act_green', type: 'process', label: '🟢 เขียว: เดินขึ้น up()', stepIndex: 4 },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    // =============================================================
    // หมวด W (ฟังก์ชันและบอสสัตว์ประหลาด Functions & Bosses): ด่าน 16 ถึง 20
    // =============================================================
    case 16:
      return {
        title: 'ผังงานฟังก์ชันย่อย: ด่าน 16 toTheRight()',
        nodes: [
          { id: 'start', type: 'start', label: 'โปรแกรมหลัก (Main Program)' },
          { id: 'main_step', type: 'process', label: 'เดินซ้าย left()', stepIndex: 0 },
          { id: 'func_call', type: 'subroutine', label: '☵ เรียก toTheRight()', subLabel: 'กระโดดไปทำงานในฟังก์ชัน', stepIndex: [1, 2, 3, 4] },
          { id: 'func_def', type: 'process', label: 'ภายในฟังก์ชัน: วิ่งขวา 4 ก้าว', subLabel: 'right() x4 ➔ กลับโปรแกรมหลัก' },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 17:
      return {
        title: 'ผังงานเรียกฟังก์ชันซ้ำ: ด่าน 17 square()',
        nodes: [
          { id: 'start', type: 'start', label: 'โปรแกรมหลัก (Main Program)' },
          { id: 's1', type: 'process', label: 'เดินซ้าย left()', stepIndex: 0 },
          { id: 'call1', type: 'subroutine', label: '☵ เรียก square() รอบที่ 1', subLabel: 'down ➔ left ➔ up ➔ right', stepIndex: [1, 2, 3, 4] },
          { id: 's2', type: 'process', label: 'ขยับขวา right()', stepIndex: 5 },
          { id: 'call2', type: 'subroutine', label: '☵ เรียก square() รอบที่ 2', subLabel: 'down ➔ left ➔ up ➔ right', stepIndex: [6, 7, 8, 9] },
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };

    case 18:
      return {
        title: 'ผังงานบอสเอเลี่ยน: ด่าน 18 Space Invader 8-Bit',
        nodes: [
          { id: 'start', type: 'start', label: 'โปรแกรมหลัก (Main Program)' },
          { id: 'call_below', type: 'subroutine', label: '☵ เรียก fromBelow()', subLabel: 'สำรวจปีกบอสด้านล่าง (down ➔ right x2 ➔ up)', stepIndex: [0, 1, 2, 3] },
          { id: 'call_above', type: 'subroutine', label: '☵ เรียก fromAbove()', subLabel: 'สำรวจปีกบอสด้านบน (up ➔ right x2 ➔ down)', stepIndex: [4, 5, 6, 7] },
          { id: 'end', type: 'end', label: '👾 พิชิตบอส 8-Bit สำเร็จ!' },
        ],
      };

    case 19:
      return {
        title: 'ผังงานบอสมังกร: ด่าน 19 dragonFly() ปีกมรกต',
        nodes: [
          { id: 'start', type: 'start', label: 'โปรแกรมหลัก (Main Program)' },
          { id: 'func_call', type: 'subroutine', label: '☵ เรียก dragonFly()', stepIndex: [0, 1, 2, 3, 4, 5, 6] },
          { id: 'loop_inside', type: 'process', label: 'วนซ้ำ 2 รอบ: ขวา 2 ➔ ขึ้น 1', subLabel: 'repeat (2) { right() x2, up() }', stepIndex: [0, 1, 2, 3, 4, 5] },
          { id: 'final_hop', type: 'process', label: 'ก้าวขวาสู่ปลายปีก right()', stepIndex: 6 },
          { id: 'end', type: 'end', label: '🐉 พิชิตบอสมังกรสำเร็จ!' },
        ],
      };

    case 20:
      return {
        title: 'ผังงานมงกุฎราชานักโค้ด: ด่าน 20 reachPeaks()',
        nodes: [
          { id: 'start', type: 'start', label: 'แกรนด์ไฟนอลบอส (Grand Final)' },
          { id: 'func_call', type: 'subroutine', label: '☵ เรียก reachPeaks()', stepIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
          { id: 'peak_mid', type: 'process', label: 'พิชิตยอดกลาง 👑: up() x3', stepIndex: [0, 1, 2] },
          { id: 'peak_left', type: 'process', label: 'พิชิตยอดซ้าย 👑: down ➔ left ➔ up', stepIndex: [3, 4, 5] },
          { id: 'peak_right', type: 'process', label: 'พิชิตยอดขวา 👑: down ➔ right ➔ up', stepIndex: [6, 7, 8] },
          { id: 'end', type: 'end', label: '🏆 คว้ามงกุฎทองคำราชานักโค้ด!' },
        ],
      };

    default:
      // Generic fallback generated dynamically from stepByStepDirections
      return {
        title: `ผังงานอัลกอริทึม (${level.conceptLabel})`,
        nodes: [
          { id: 'start', type: 'start', label: 'เริ่มต้น (Start)' },
          ...level.stepByStepDirections.map((dir, idx) => ({
            id: `step_${idx}`,
            type: 'process' as const,
            label: `ก้าวที่ ${idx + 1}: ${dir.toUpperCase()} ()`,
            stepIndex: idx,
          })),
          { id: 'end', type: 'end', label: 'สิ้นสุด (End)' },
        ],
      };
  }
}
