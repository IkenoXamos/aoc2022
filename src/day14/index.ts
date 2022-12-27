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

function addPositions(a: Position, b: Position): Position {
  return [a[0] + b[0], a[1] + b[1]];
}

function scaleVector(vector: Position, scale: number): Position {
  return [vector[0] * scale, vector[1] * scale];
}

function createGrid(): string[][] {
  const grid: string[][] = new Array<Array<string>>(600);

  for (let x = 0; x < grid.length; x++) {
    grid[x] = new Array<string>(200).fill('.');
  }

  return grid;
}

function initializeGrid(grid: string[][], rocks: Path[]): void {
  for (const path of rocks) {
    for (const {src, direction, distance} of path) {
      new Array(distance)
        .map((_, i) => scaleVector(direction, i))
        .map(p => addPositions(src, p))
        .forEach(([x, y]) => {
          grid[x][y] = "#";
        });
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(inspect(input, {showHidden: false, depth: null, colors: true}));

  const grid = initializeGrid(createGrid(), input);

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
