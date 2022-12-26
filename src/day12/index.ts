import run from "aocrunner";
import { combinations2, ObjectSet } from "../utils/index.js";

type Position = [number, number];

const Directions = {
  Left: [0, -1] as Position,
  Right: [0, 1] as Position,
  Up: [-1, 0] as Position,
  Down: [1, 0] as Position,
}

function positionIsValid(position: Position, maxRows: number, maxCols: number): boolean {
  return (position[0] >= 0 && position[0] < maxRows) && (position[1] >= 0 && position[1] < maxCols);
}

const parseInput = (rawInput: string) => {
  const grid = rawInput.split('\n').map((line) => line.split(''));
  let [startingPosition, endingPosition] = [[0, 0] as Position, [0, 0] as Position];
  const potentialStartPositions: Position[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'S') {
        startingPosition = [i, j];
        grid[i][j] = 'a';
      }

      if (grid[i][j] === 'E') {
        endingPosition = [i, j];
        grid[i][j] = 'z';
      }

      if (grid[i][j] === 'a') {
        potentialStartPositions.push([i, j]);
      }
    }
  }

  const moves: { letter: string; validSteps: Position[]; }[][] = [];
  for (let i = 0; i < grid.length; i++) {
    moves.push(new Array<{ letter: string; validSteps: Position[]; }>(grid[i].length));
    for (let j = 0; j < grid[i].length; j++) {
      const position = [i, j] as Position;
      const letter = grid[position[0]][position[1]];

      const validSteps = Object.values(Directions)
      .map((direction) => [position[0] + direction[0], position[1] + direction[1]] as Position)
      .map((destination) => {
        if (positionIsValid(destination, grid.length, grid[i].length) && canMove(letter, grid[destination[0]][destination[1]])) {
          return destination;
        }

        return [-1, -1] as Position;
      })
      .filter(([row, col]) => (row !== -1 || col !== -1));

      // console.log(`At [${position[0]}, ${position[1]}]`, letter, validSteps);

      moves[i][j] = {letter, validSteps};
    }
  }

  return {moves, startingPosition, endingPosition, potentialStartPositions};
};

function canMove(start: string, destination: string): boolean {
  return (destination.charCodeAt(0) - start.charCodeAt(0)) <= 1;
}

function manhattanDistance(start: Position, target: Position): number {
  return Math.abs(start[0] - target[0]) + Math.abs(start[1] - target[1]);
}

function positionsMatch(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const toVisit: Array<[Position, number]> = new Array([input.startingPosition, 0]);
  const visited: ObjectSet<Position> = new ObjectSet();
  
  while (toVisit.length > 0) {
    const tuple = toVisit.shift();

    if (!tuple) throw new Error('Failed to grab element from queue');

    const [position, steps] = tuple;
    visited.add(position);

    if (positionsMatch(position, input.endingPosition)) return steps;

    const { validSteps } = input.moves[position[0]][position[1]];

    for (const destination of validSteps) {
      const destinationWillBeVisited = !!toVisit.find(([p, s]) => (positionsMatch(p, destination) && s === steps + 1));

      if (!visited.has(destination) && !destinationWillBeVisited) {
        toVisit.push([destination, steps + 1]);
      }
    }
  }

  return -1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const toVisit: Array<[Position, number]> = new Array(...input.potentialStartPositions.map(pos => [pos, 0] as [Position, number]));
  const visited: ObjectSet<Position> = new ObjectSet();
  
  while (toVisit.length > 0) {
    const tuple = toVisit.shift();

    if (!tuple) throw new Error('Failed to grab element from queue');

    const [position, steps] = tuple;
    visited.add(position);

    if (positionsMatch(position, input.endingPosition)) return steps;

    const { validSteps } = input.moves[position[0]][position[1]];

    for (const destination of validSteps) {
      const destinationWillBeVisited = !!toVisit.find(([p, s]) => (positionsMatch(p, destination) && s === steps + 1));

      if (!visited.has(destination) && !destinationWillBeVisited) {
        toVisit.push([destination, steps + 1]);
      }
    }
  }

  return -1;
};

run({
  part1: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
