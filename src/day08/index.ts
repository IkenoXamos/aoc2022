import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split('').map(c => Number(c)));

function scenicScore(grid: number[][], row: number, col: number): number {
  // Check directions in the order of UP -> RIGHT -> DOWN -> LEFT

  if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[row].length - 1) return 0;

  let scenicScore = 0;
  const height = grid[row][col];

  // Searching UP
  for (let x = row - 1; x >= 0; x--) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[x][col] >= height) {
      scenicScore = row - x;
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (x === 0) {
      scenicScore = row;
    }
  }

  // Searching Right
  for (let y = col + 1; y < grid[row].length; y++) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[row][y] >= height) {
      scenicScore *= y - col;
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (y === grid[row].length - 1) {
      scenicScore *= y - col;
    }
  }

  // Searching down
  for (let x = row + 1; x < grid.length; x++) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[x][col] >= height) {
      scenicScore *= x - row;
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (x === grid.length - 1) {
      scenicScore *= x - row;
    }
  }

  // Searching Left
  for (let y = col - 1; y >= 0; y--) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[row][y] >= height) {
      scenicScore *= col - y;
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (y === 0) {
      scenicScore *= col;
    }
  }

  // Only if all 4 directions have been searched and the tree was not visible, we return false
  return scenicScore;
}

function isVisible(grid: number[][], row: number, col: number): boolean {
  // Check directions in the order of UP -> RIGHT -> DOWN -> LEFT

  if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[row].length - 1) return true;

  const height = grid[row][col];

  // Searching UP
  for (let x = row - 1; x >= 0; x--) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[x][col] >= height) {
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (x === 0) {
      return true;
    }
  }

  // Searching Right
  for (let y = col + 1; y < grid[row].length; y++) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[row][y] >= height) {
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (y === grid[row].length - 1) {
      return true;
    }
  }

  // Searching down
  for (let x = row + 1; x < grid.length; x++) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[x][col] >= height) {
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (x === grid.length - 1) {
      return true;
    }
  }

  // Searching Left
  for (let y = col - 1; y >= 0; y--) {
    // If a equal or taller tree is found, stop searching this direction
    if (grid[row][y] >= height) {
      break;
    }

    // If we successfully finished searching this direction, the tree is visible
    if (y === 0) {
      return true;
    }
  }

  // Only if all 4 directions have been searched and the tree was not visible, we return false
  return false;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let totalVisibleTrees = 0;

  for (let row = 0; row < input.length; row++) {
    for (let column = 0; column < input[row].length; column++) {
      if (isVisible(input, row, column)) {
        totalVisibleTrees++;
      }
    }
  }

  return totalVisibleTrees;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let maxScenicScore = Number.MIN_VALUE;

  for (let row = 0; row < input.length; row++) {
    for (let column = 0; column < input[row].length; column++) {
      const score = scenicScore(input, row, column)
      if (score > maxScenicScore) {
        maxScenicScore = score;
      }
    }
  }

  return maxScenicScore;
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
