import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function hasMarker(sequence: string, requiredLength: number): boolean {
  if (!sequence || sequence.length !== requiredLength || !sequence.match(/[a-z]/)) {
    throw new Error(`Invalid sequence ${sequence}`);
  }

  // This regex works because \1 refers to the same character that is matched inside the parentheses
  // The .* can match any number of characters (0+), so the result effectively determines if there
  // is a repeating character
  return !(/(.).*\1/.test(sequence));
}

function findMarkerWithNUniques(signal: string, numberOfUniques: number) {
  // Iterate via an N-character long sliding window
  for (let i = numberOfUniques; i < signal.length; i++) {
    const sequence = signal.slice(i - numberOfUniques, i);

    if (hasMarker(sequence, numberOfUniques)) {
      return i;
    }
  }

  throw new Error("No marker found!");
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return findMarkerWithNUniques(input, 4);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return findMarkerWithNUniques(input, 14);
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
