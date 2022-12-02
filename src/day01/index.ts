import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n") // Separate into a different element per elf
    .map((s) =>
      s
        .split("\n") // for each elf, create an array of calorie values
        .map((calorieString) => Number(calorieString)),
    );

function sum(calories: number[]): number {
  return calories.reduce((prev, current) => prev + current, 0);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxCalories = input.map((calories) => sum(calories));

  const result = maxCalories.sort((a, b) => b - a)[0];

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const maxCalories = input.map((calories) => sum(calories));

  const sortedCalories = maxCalories.sort((a, b) => b - a);

  const result = sum(sortedCalories.slice(0, 3));

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
          1000
          2000

          4000
          `,
        expected: 4000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1000
        
        2000
        3000
        
        4000
        5000
        6000
        
        7000
        10000
        `,
        expected: 37000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
