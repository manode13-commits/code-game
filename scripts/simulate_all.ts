import { GAME_LEVELS } from '../src/data/levels';

export function simulateCode(lines: string[]): string[] {
  const steps: string[] = [];
  const functions: Record<string, string[]> = {};

  // First pass: extract functions with nested block tracking
  let inFunc: string | null = null;
  let funcDepth = 0;
  const topLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    if (!inFunc) {
      const funcMatch = trimmed.match(/^function\s+([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (funcMatch) {
        inFunc = funcMatch[1];
        functions[inFunc] = [];
        funcDepth = 0;
        if (trimmed.includes('{')) funcDepth++;
        continue;
      }
      topLines.push(trimmed);
    } else {
      if (trimmed.includes('{')) funcDepth++;
      if (trimmed.includes('}')) {
        funcDepth--;
        if (funcDepth === 0) {
          inFunc = null;
          continue;
        }
      }
      functions[inFunc].push(trimmed);
    }
  }

  function runBlock(blockLines: string[]) {
    let idx = 0;
    while (idx < blockLines.length) {
      const line = blockLines[idx];
      if (line === '{' || line === '}') {
        idx++;
        continue;
      }

      // 1. Repeat
      const repeatMatch = line.match(/^repeat\s*\(\s*(\d+)\s*\)/);
      if (repeatMatch) {
        const count = parseInt(repeatMatch[1], 10);
        const subLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) {
            subLines.push(cur);
          }
          idx++;
        }
        for (let r = 0; r < count; r++) {
          runBlock(subLines);
        }
        continue;
      }

      // 2. While (in this context runs 2 cycles for grid sweep/wave)
      const whileMatch = line.match(/^while\s+/);
      if (whileMatch) {
        const subLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) {
            subLines.push(cur);
          }
          idx++;
        }
        for (let r = 0; r < 2; r++) {
          runBlock(subLines);
        }
        continue;
      }

      // 3. If
      const ifMatch = line.match(/^if\s+/);
      if (ifMatch) {
        const ifSubLines: string[] = [];
        idx++;
        let depth = 1;
        while (idx < blockLines.length && depth > 0) {
          const cur = blockLines[idx];
          if (cur.includes('{')) depth++;
          if (cur.includes('}')) depth--;
          if (depth > 0) {
            ifSubLines.push(cur);
          }
          idx++;
        }

        // Check else
        if (idx < blockLines.length && blockLines[idx].startsWith('else')) {
          idx++;
          let elseDepth = 1;
          while (idx < blockLines.length && elseDepth > 0) {
            const cur = blockLines[idx];
            if (cur.includes('{')) elseDepth++;
            if (cur.includes('}')) elseDepth--;
            idx++;
          }
        }

        runBlock(ifSubLines);
        continue;
      }

      // 4. Direction action
      const actMatch = line.match(/\b(up|down|left|right)\s*\(\s*\)/);
      if (actMatch) {
        steps.push(actMatch[1]);
        idx++;
        continue;
      }

      // 5. Function Call
      const callMatch = line.match(/^([a-zA-Z0-9_]+)\s*\(\s*\)/);
      if (callMatch && functions[callMatch[1]]) {
        runBlock(functions[callMatch[1]]);
        idx++;
        continue;
      }

      idx++;
    }
  }

  runBlock(topLines);
  return steps;
}

let failures = 0;
for (const level of GAME_LEVELS) {
  const sim = simulateCode(level.codeSnippet || []);
  const exp = level.stepByStepDirections;
  const ok = sim.length === exp.length && sim.every((d, i) => d === exp[i]);
  if (!ok) {
    failures++;
    console.log(`Mismatch Level ${level.id} (${level.concept}):`);
    console.log(`   Sim (${sim.length}): [${sim.join(', ')}]`);
    console.log(`   Exp (${exp.length}): [${exp.join(', ')}]`);
  }
}
console.log(`Total Failures: ${failures} / ${GAME_LEVELS.length}`);
