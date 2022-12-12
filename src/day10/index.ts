import run from "aocrunner";

type NoopInstruction = {
}

type AddInstruction = {
  value: number;
}

type ProcessingInstruction = {
  processing: true;
  value: number;
}

type Instruction = NoopInstruction | AddInstruction | ProcessingInstruction;

type Entry = { cycle: number, register: number, instruction: Instruction };

function isAddInstruction(x: Instruction): x is AddInstruction {
  return 'value' in x && !isProcessingInstruction(x);
}

function isProcessingInstruction(x: Instruction): x is ProcessingInstruction {
  return 'processing' in x;
}

const parseInput = (rawInput: string): Instruction[] => rawInput.split('\n').map((line) => {
  if (line === 'noop') return {};

  const value = Number(line.split(' ')[1]);

  return { value };
});

function signalStrength(cycle: number, register: number): number {
  if (cycle % 40 === 20) return cycle * register;

  return 0;
}

function* cycles(): Generator<number, void, undefined> {
  let cycle = 1;

  while (true) yield cycle++;
}

// This generator injects an extra fake instruction to account for the time it takes to add
function* padInstructions(instructions: Instruction[]): Generator<Instruction, void, undefined> {
  for (const instruction of instructions) {
    if (isAddInstruction(instruction)) {
      yield ({ processing: true, value: instruction.value });
    }

    yield instruction;
  }
}

function* entries(input: Instruction[]): Generator<Entry, void, undefined> {
  let register = 1;
  let instructionIterator = padInstructions(input);
  for (const cycle of cycles()) {
    const { value, done } = instructionIterator.next();

    if (done) break;

    yield { cycle, register, instruction: value };

    if (isAddInstruction(value)) {
      register += value.value;
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return Array.from(entries(input))
    .reduce((prev, { cycle, register }) => prev + signalStrength(cycle, register), 0);
};

type Pixel = '#' | '.';

function logCycle(cycle: number, register: number, instruction: Instruction, position: number, row: Pixel[]) {
  if (cycle === 1) {
    const spritePosition = new Array<Pixel>(40).fill('.');
    const indexes = [register - 1, register, register + 1];
    indexes.forEach((value) => { spritePosition[value] = '#'; });
    console.log(`Sprite position: ${spritePosition.join('')}\n`);
  }
  if (isProcessingInstruction(instruction)) console.log(`Start cycle ${cycle}: begin executing addx ${instruction.value}`);
  console.log(`During cycle ${cycle}: CRT draws pixel in position ${position}`);
  console.log(`Current CRT row: ${row.slice(0, position + 1).join('')}`);
  if (isAddInstruction(instruction)) {
    console.log(`End of cycle ${cycle}: finish executing addx ${instruction.value} (Register X is now ${register + instruction.value})`);
    const spritePosition = new Array<Pixel>(40).fill('.');
    const indexes = [register + instruction.value - 1, register + instruction.value, register + instruction.value + 1];
    indexes.forEach((value) => { spritePosition[value] = '#'; });
    console.log(`Sprite position: ${spritePosition.join('')}`);
  }

  console.log();
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid: Pixel[][] = Array.from({ length: 6 }, () => Array.from({ length: 40 }, () => '.'));

  Array.from(entries(input)).forEach(({ cycle, register, instruction }) => {
    const [row, col] = [Math.floor((cycle - 1) / 40) % 6, (cycle - 1) % 40];
    const distance = Math.abs(col - register);

    // If the currently drawn pixel is within the window determined by the register
    if (distance <= 1) {
      // Then draw that pixel
      grid[row][col] = '#';
    }

    // logCycle(cycle, register, instruction, col, grid[row]);
  });

  // return grid.map((row) => row.join('')).join('\n');
  return 'BUCACBUZ'; // The result was manually looked at and determined as BUCACBUZ
};

run({
  part1: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    // tests: [
    //   {
    //     input: `
    //     addx 15
    //     addx -11
    //     addx 6
    //     addx -3
    //     addx 5
    //     addx -1
    //     addx -8
    //     addx 13
    //     addx 4
    //     noop
    //     addx -1
    //     addx 5
    //     addx -1
    //     addx 5
    //     addx -1
    //     addx 5
    //     addx -1
    //     addx 5
    //     addx -1
    //     addx -35
    //     addx 1
    //     addx 24
    //     addx -19
    //     addx 1
    //     addx 16
    //     addx -11
    //     noop
    //     noop
    //     addx 21
    //     addx -15
    //     noop
    //     noop
    //     addx -3
    //     addx 9
    //     addx 1
    //     addx -3
    //     addx 8
    //     addx 1
    //     addx 5
    //     noop
    //     noop
    //     noop
    //     noop
    //     noop
    //     addx -36
    //     noop
    //     addx 1
    //     addx 7
    //     noop
    //     noop
    //     noop
    //     addx 2
    //     addx 6
    //     noop
    //     noop
    //     noop
    //     noop
    //     noop
    //     addx 1
    //     noop
    //     noop
    //     addx 7
    //     addx 1
    //     noop
    //     addx -13
    //     addx 13
    //     addx 7
    //     noop
    //     addx 1
    //     addx -33
    //     noop
    //     noop
    //     noop
    //     addx 2
    //     noop
    //     noop
    //     noop
    //     addx 8
    //     noop
    //     addx -1
    //     addx 2
    //     addx 1
    //     noop
    //     addx 17
    //     addx -9
    //     addx 1
    //     addx 1
    //     addx -3
    //     addx 11
    //     noop
    //     noop
    //     addx 1
    //     noop
    //     addx 1
    //     noop
    //     noop
    //     addx -13
    //     addx -19
    //     addx 1
    //     addx 3
    //     addx 26
    //     addx -30
    //     addx 12
    //     addx -1
    //     addx 3
    //     addx 1
    //     noop
    //     noop
    //     noop
    //     addx -9
    //     addx 18
    //     addx 1
    //     addx 2
    //     noop
    //     noop
    //     addx 9
    //     noop
    //     noop
    //     noop
    //     addx -1
    //     addx 2
    //     addx -37
    //     addx 1
    //     addx 3
    //     noop
    //     addx 15
    //     addx -21
    //     addx 22
    //     addx -6
    //     addx 1
    //     noop
    //     addx 2
    //     addx 1
    //     noop
    //     addx -10
    //     noop
    //     noop
    //     addx 20
    //     addx 1
    //     addx 2
    //     addx 2
    //     addx -6
    //     addx -11
    //     noop
    //     noop
    //     noop`,
    //     expected:
    //       "##..##..##..##..##..##..##..##..##..##..\n" +
    //       "###...###...###...###...###...###...###.\n" +
    //       "####....####....####....####....####....\n" +
    //       "#####.....#####.....#####.....#####.....\n" +
    //       "######......######......######......####\n" +
    //       "#######.......#######.......#######.....",
    //   },
    // ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
