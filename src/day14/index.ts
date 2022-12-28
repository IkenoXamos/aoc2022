import run from "aocrunner";
import { pairwise } from "../utils/index.js";
import { inspect } from "util";
import { match, P } from "ts-pattern";

type Position = [number, number];

const Directions = {
  Left: [-1, 0] as Position,
  Right: [1, 0] as Position,
  Up: [0, -1] as Position,
  Down: [0, 1] as Position,
  DownLeft: [-1, 1] as Position,
  DownRight: [1, 1] as Position,
};
Object.freeze(Directions);

type Step = {
  src: Position;
  direction: Position;
  distance: number;
}
type Path = Array<Step>;

const parseInput = (rawInput: string): Array<Path> => rawInput.split("\n").map(parseInputLine);
const parseInputLine = (line: string): Path => parsePathFromPositions(line.split(" -> ").map(parsePosition));
const parsePosition = (pos: string): Position => pos.split(",").map(Number) as Position;

const parsePathFromPositions = (positions: Position[]): Path => {
  const path: Path = [];
  for (const [src, dest] of pairwise(positions)) {
    const [dx, dy] = [dest[0] - src[0], dest[1] - src[1]];
    const step: Step = match([dx, dy])
      .with([0, P.when((value) => value > 0)], () => ({src, direction: Directions.Down, distance: dy}))
      .with([0, P.when((value) => value < 0)], () => ({src, direction: Directions.Up, distance: Math.abs(dy)}))
      .with([P.when((value) => value > 0), 0], () => ({src, direction: Directions.Right, distance: dx}))
      .with([P.when((value) => value < 0), 0], () => ({src, direction: Directions.Left, distance: Math.abs(dx)}))
      .otherwise(() => {throw new Error(`Failed to identify [${step}] as a step`)});
    path.push(step);
  }

  return path;
}

function positionsMatch(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function addPositions(a: Position, b: Position): Position {
  return [a[0] + b[0], a[1] + b[1]];
}

function scaleVector(vector: Position, scale: number): Position {
  return [vector[0] * scale, vector[1] * scale];
}

function createGrid(): string[][] {
  const grid: string[][] = new Array<Array<string>>(800);

  for (let x = 0; x < grid.length; x++) {
    grid[x] = new Array<string>(200).fill('.');
  }

  return grid;
}

function initializeGrid(grid: string[][], rocks: Path[]): void {
  for (const path of rocks) {
    // console.log('Initializing path', path);
    for (const {src, direction, distance} of path) {
      // console.log(src, direction, distance);

      new Array(distance + 1).fill(0)
        .map((_, i) => scaleVector(direction, i))
        .map(p => addPositions(src, p))
        .forEach(([x, y]) => {
          // console.log('Setting position', [x, y]);
          grid[x][y] = "#";
        });
    }
  }
}

function initializeGrid2(grid: string[][], rocks: Path[]): number {
  let max_y = 0;
  for (const path of rocks) {
    // console.log('Initializing path', path);
    for (const {src, direction, distance} of path) {
      // console.log(src, direction, distance);

      new Array(distance + 1).fill(0)
        .map((_, i) => scaleVector(direction, i))
        .map(p => addPositions(src, p))
        .forEach(([x, y]) => {
          // console.log('Setting position', [x, y]);
          if (y > max_y) max_y = y;
          grid[x][y] = "#";
        });
    }
  }

  max_y += 2;

  for (let x = 0; x < grid.length; x++) {
    grid[x][max_y] = "#";
  }

  return max_y;
}

// Simulate a single falling unit of sand and determine whether
// it lands at rest or not
function simulateSand(grid: string[][]): boolean {
  const startingPosition: Position = [500, 0];
  grid[startingPosition[0]][startingPosition[1]] = 'o';
  // console.log('Sand has been generated');

  let currentPosition: Position = [...startingPosition];
  // A glance through the input shows that now rocks are below 200
  // So if a unit of sand drops below 200, then it will never land
  while (currentPosition[1] < 170) {
    for (const dir of [Directions.Down, Directions.DownLeft, Directions.DownRight]) {
      const destination = addPositions(currentPosition, dir);

      // If the sand can move in this direction, then it does
      if (grid[destination[0]][destination[1]] === '.') {
        // console.log('San has moved into direction', dir, 'at', destination);

        grid[currentPosition[0]][currentPosition[1]] = '.';
        grid[destination[0]][destination[1]] = 'o';
        currentPosition = [...destination];
        break;
      }

      // Otherwise, if the sand couldn't move in any direction, then it has landed at rest
      if (positionsMatch(dir, Directions.DownRight)) {
        // console.log('Sand has landed at rest at position', currentPosition);

        return true;
      }
    }
  }

  // console.log('Sand has fallen into the abyss at position', currentPosition);
  return false;
}

function simulateSand2(grid: string[][], maxHeight: number): Position {
  const startingPosition: Position = [500, 0];
  grid[startingPosition[0]][startingPosition[1]] = 'o';

  let currentPosition: Position = [...startingPosition];
  // A glance through the input shows that now rocks are below 200
  // So if a unit of sand drops below 200, then it will never land
  while (currentPosition[1] < maxHeight) {
    for (const dir of [Directions.Down, Directions.DownLeft, Directions.DownRight]) {
      const destination = addPositions(currentPosition, dir);

      // If the sand can move in this direction, then it does
      if (grid[destination[0]][destination[1]] === '.') {
        // console.log('San has moved into direction', dir, 'at', destination);

        grid[currentPosition[0]][currentPosition[1]] = '.';
        grid[destination[0]][destination[1]] = 'o';
        currentPosition = [...destination];
        break;
      }

      // Otherwise, if the sand couldn't move in any direction, then it has landed at rest
      if (positionsMatch(dir, Directions.DownRight)) {
        // console.log('Sand has landed at rest at position', currentPosition);
        return currentPosition;
      }
    }
  }

  throw new Error('Sand did not land at rest');
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(inspect(input, {showHidden: false, depth: null, colors: true}));

  const grid = createGrid();
  initializeGrid(grid, input);
  // console.log('The grid has been initialized');

  let count = 0;
  while(simulateSand(grid)) {
    count++;
    // console.log(`Simulated sand #[${count}]`);
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(inspect(input, {showHidden: false, depth: null, colors: true}));

  const grid = createGrid();
  const maxHeight = initializeGrid2(grid, input);
  // console.log('The grid has been initialized');

  let count = 1;
  while(!positionsMatch(simulateSand2(grid, maxHeight), [500, 0])) {
    count++;
    // console.log(`Simulated sand #[${count}]`);
  }

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
