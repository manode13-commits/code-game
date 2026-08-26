import { Level, FlowchartData, FlowchartNode } from '../types';

const thaiDirMap: Record<string, string> = {
  up: 'ก้าวขึ้น up() ⬆️',
  down: 'ก้าวลง down() ⬇️',
  left: 'เลี้ยวซ้าย left() ⬅️',
  right: 'เดินขวา right() ➡️',
};

export function getLevelFlowchart(level: Level): FlowchartData {
  if (level.flowchart) {
    return level.flowchart;
  }

  const nodes: FlowchartNode[] = [
    { id: 'start', type: 'start', label: 'เริ่มต้น (Start 🚀)' },
  ];

  let currentStepIdx = 0;
  const totalDirections = level.stepByStepDirections.length;

  if (level.codeSnippet && level.codeSnippet.length > 0) {
    level.codeSnippet.forEach((rawLine, lineIdx) => {
      const line = rawLine.trim();
      if (!line || line === '}' || line === '{' || line.startsWith('//')) {
        return;
      }

      // 1. Function definition (e.g. function climbStep() {)
      const funcDefMatch = line.match(/^function\s+([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (funcDefMatch) {
        nodes.push({
          id: `func_def_${lineIdx}`,
          type: 'subroutine',
          label: `นิยามฟังก์ชัน: ${funcDefMatch[1]}()`,
          subLabel: 'กำหนดชุดคำสั่งย่อย',
        });
        return;
      }

      // 2. Loop repeat (e.g. repeat (3) {)
      const repeatMatch = line.match(/^repeat\s*\(\s*(\d+)\s*\)/);
      if (repeatMatch) {
        nodes.push({
          id: `loop_${lineIdx}`,
          type: 'decision',
          label: `วนซ้ำ repeat (${repeatMatch[1]} รอบ)`,
          subLabel: 'ตรวจสอบเงื่อนไขจำนวนรอบ',
          yesTargetLabel: 'ทำต่อในลูป',
          noTargetLabel: 'ครบแล้วออก',
        });
        return;
      }

      // 3. Loop while (e.g. while 🔵 {)
      const whileMatch = line.match(/^while\s+(.+?)(\s*\{|$)/);
      if (whileMatch) {
        nodes.push({
          id: `while_${lineIdx}`,
          type: 'decision',
          label: `วนซ้ำ while ${whileMatch[1].trim()}`,
          subLabel: 'ตรวจสอบเงื่อนไขก่อนวนซ้ำ',
          yesTargetLabel: 'จริง (True)',
          noTargetLabel: 'เท็จ (False)',
        });
        return;
      }

      // 4. Condition if (e.g. if 🟠 { or if 🟢 {)
      const ifMatch = line.match(/^if\s+(.+?)(\s*\{|$)/);
      if (ifMatch) {
        const cond = ifMatch[1].trim();
        nodes.push({
          id: `if_${lineIdx}`,
          type: 'decision',
          label: `เงื่อนไข if ${cond}`,
          subLabel: 'ตรวจสอบสถานะ/จุดสี',
          yesTargetLabel: 'จริง (True)',
          noTargetLabel: 'เท็จ (False)',
        });
        return;
      }

      // 5. Condition else (e.g. } else {)
      if (line.includes('else')) {
        return; // Else is represented by the decision node's False branch
      }

      // 6. Directional action (up(), down(), left(), right())
      const actionMatch = line.match(/\b(up|down|left|right)\s*\(\s*\)/);
      if (actionMatch) {
        const dir = actionMatch[1] as 'up' | 'down' | 'left' | 'right';
        const assignedStep = currentStepIdx < totalDirections ? currentStepIdx : undefined;
        nodes.push({
          id: `step_${lineIdx}_${currentStepIdx}`,
          type: 'process',
          label: thaiDirMap[dir] || `${dir}()`,
          subLabel: `คำสั่ง ${dir}() ${assignedStep !== undefined ? `[ก้าวที่ ${assignedStep + 1}]` : ''}`,
          stepIndex: assignedStep,
        });
        if (assignedStep !== undefined) {
          currentStepIdx++;
        }
        return;
      }

      // 7. Function invocation call (e.g. climbStep() or masterChallenge())
      const funcCallMatch = line.match(/^([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (funcCallMatch && !['up', 'down', 'left', 'right'].includes(funcCallMatch[1])) {
        nodes.push({
          id: `call_${lineIdx}`,
          type: 'subroutine',
          label: `เรียกใช้งานฟังก์ชัน: ${funcCallMatch[1]}()`,
          subLabel: 'รันคำสั่งภายในฟังก์ชัน',
        });
      }
    });
  }

  // If any remaining directions were unmapped, add them cleanly
  while (currentStepIdx < totalDirections) {
    const dir = level.stepByStepDirections[currentStepIdx];
    nodes.push({
      id: `step_fallback_${currentStepIdx}`,
      type: 'process',
      label: thaiDirMap[dir] || `${dir}()`,
      subLabel: `คำสั่ง ${dir}() [ก้าวที่ ${currentStepIdx + 1}]`,
      stepIndex: currentStepIdx,
    });
    currentStepIdx++;
  }

  nodes.push({
    id: 'end',
    type: 'end',
    label: 'สิ้นสุด (End 🎯)',
  });

  return {
    title: `ผังงาน: ${level.thaiTitle}`,
    nodes,
  };
}

