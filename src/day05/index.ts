import run from "aocrunner";
import { Stack } from "stack-typescript";

type Crane = Stack<string>[];

const parseInput = (rawInput: string) => {
  // This below is feels a bit cheaty, as I am avoiding parsing the visual representation of the crate positions.
  // However, since the starting crate positions is not overly complex, whereas the logic to parse
  // the positions would be, I feel this is reasonable
  const crates: Crane = [];
  crates.push(new Stack<string>('F', 'R', 'W'));
  crates.push(new Stack<string>('P', 'W', 'V', 'D', 'C', 'M', 'H', 'T'));
  crates.push(new Stack<string>('L', 'N', 'Z', 'M', 'P'));
  crates.push(new Stack<string>('R', 'H', 'C', 'J'));
  crates.push(new Stack<string>('B', 'T', 'Q', 'H', 'G', 'P', 'C'));
  crates.push(new Stack<string>('Z', 'F', 'L', 'W', 'C', 'G'));
  crates.push(new Stack<string>('C', 'G', 'J', 'Z', 'Q', 'L', 'V', 'W'));
  crates.push(new Stack<string>('C', 'V', 'T', 'W', 'F', 'R', 'N', 'P'));
  crates.push(new Stack<string>('V', 'S', 'R', 'G', 'H', 'W', 'J'));

  // We do parse each of the move instructions of course
  return {
    crates, moves: rawInput.split('\n\n')[1].split('\n').map((line) => {
      const sections = line.split(' ');

      return {
        amount: Number(sections[1]),
        src: Number(sections[3]) - 1, // Offset each of the crate positions to be zero-indexed
        dest: Number(sections[5]) - 1,
      }
    })
  };
};

function moveIndividually(from: Stack<string>, to: Stack<string>, amount: number): void {
  for (let i = 0; i < amount; i++) {
    const crate = from.pop();
    to.push(crate);
  }
}

// This variation leverages an extra stack to effectively reverse the order to match the problem statement
function moveGroup(from: Stack<string>, to: Stack<string>, amount: number): void {
  const group = new Stack<string>();

  for (let i = 0; i < amount; i++) {
    const crate = from.pop();
    group.push(crate);
  }

  while (group.length > 0) {
    const crate = group.pop();
    to.push(crate);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  input.moves.forEach((instruction) => moveIndividually(input.crates[instruction.src], input.crates[instruction.dest], instruction.amount));

  const result = input.crates.reduce((acc, stack) => acc + stack.pop(), '');

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  input.moves.forEach((instruction) => moveGroup(input.crates[instruction.src], input.crates[instruction.dest], instruction.amount));

  const result = input.crates.reduce((acc, stack) => acc + stack.pop(), '');

  return result;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
