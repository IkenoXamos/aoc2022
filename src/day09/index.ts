import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => ({ direction: line.split(' ')[0], distance: Number(line.split(' ')[1]) }));

function vectorFromDirection(direction: string): [number, number] {
  if (direction === 'L') return [-1, 0];
  if (direction === 'R') return [1, 0];
  if (direction === 'U') return [0, 1];
  if (direction === 'D') return [0, -1];

  throw new Error(`Invalid direction: ${direction}`);
}

function vectorFromDisplacement(tailRelativeLocation: [number, number]): [number, number] {
  const [dx, dy] = tailRelativeLocation;

  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return [0, 0];
  if (dx === 0) return [0, dy / Math.abs(dy)];
  if (dy === 0) return [dx / Math.abs(dx), 0];

  return [dx / Math.abs(dx), dy / Math.abs(dy)];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // 1000 x 1000 grid of booleans to track presence of the Tail
  const grid: boolean[][] = [];
  const GRID_SIZE = 1000;
  for (let i = 0; i < GRID_SIZE; i++) {
    grid.push(new Array(GRID_SIZE).fill(false));
  }

  const headPosition: [number, number] = [Math.floor(grid.length / 2), Math.floor(grid.length / 2)];
  const tailPosition: [number, number] = [...headPosition];
  grid[tailPosition[0]][tailPosition[1]] = true; // The tail begins in the starting position

  input.forEach(({ direction, distance }) => {
    const [head_dx, head_dy] = vectorFromDirection(direction);

    for (let i = 0; i < distance; i++) {
      headPosition[0] += head_dx;
      headPosition[1] += head_dy;

      const [tail_dx, tail_dy] = vectorFromDisplacement([headPosition[0] - tailPosition[0], headPosition[1] - tailPosition[1]]);
      tailPosition[0] += tail_dx;
      tailPosition[1] += tail_dy;

      grid[tailPosition[0]][tailPosition[1]] = true;
    }
  });

  let total = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      total += (grid[i][j] ? 1 : 0);
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid: boolean[][] = [];
  const GRID_SIZE = 1000;
  for (let i = 0; i < GRID_SIZE; i++) {
    grid.push(new Array(GRID_SIZE).fill(false));
  }

  const headPosition: [number, number] = [Math.floor(grid.length / 2), Math.floor(grid.length / 2)];
  const tailPositions: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    tailPositions.push([...headPosition]);
  }
  grid[tailPositions[8][0]][tailPositions[8][1]] = true; // The tail begins in the starting position

  input.forEach(({ direction, distance }) => {
    const [head_dx, head_dy] = vectorFromDirection(direction);

    for (let i = 0; i < distance; i++) {
      headPosition[0] += head_dx;
      headPosition[1] += head_dy;

      const [tail_dx1, tail_dy1] = vectorFromDisplacement([headPosition[0] - tailPositions[0][0], headPosition[1] - tailPositions[0][1]]);
      tailPositions[0][0] += tail_dx1;
      tailPositions[0][1] += tail_dy1;

      for (let j = 1; j < 9; j++) {
        const [tail_dxj, tail_dyj] = vectorFromDisplacement([tailPositions[j - 1][0] - tailPositions[j][0], tailPositions[j - 1][1] - tailPositions[j][1]]);
        tailPositions[j][0] += tail_dxj;
        tailPositions[j][1] += tail_dyj;
      }

      grid[tailPositions[8][0]][tailPositions[8][1]] = true;
    }
  });

  let total = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      total += (grid[i][j] ? 1 : 0);
    }
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
