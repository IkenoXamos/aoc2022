import run from "aocrunner";
import { combinations2 } from "../utils/index.js";

type Position = [number, number];

const Directions = {
  Left: [-1, 0] as Position,
  Right: [1, 0] as Position,
  Up: [0, -1] as Position,
  Down: [0, 1] as Position,
}

function positionIsValid(position: Position, gridSize: number): boolean {
  return (position[0] >= 0 && position[0] < gridSize) && (position[1] >= 0 && position[1] < gridSize);
}

const parseInput = (rawInput: string) => {
  const grid = rawInput.split('\n').map((line) => line.split(''));
  let [startingPosition, endingPosition] = [[0, 0] as Position, [0, 0] as Position];

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
    }
  }

  const moves: { letter: string; validSteps: [Position, number][]; }[][] = [];
  for (let i = 0; i < grid.length; i++) {
    moves.push(new Array<{ letter: string; validSteps: [Position, number][]; }>(grid[i].length));
    for (let j = 0; j < grid[i].length; j++) {
      const position = [i, j] as Position;
      const letter = grid[position[0]][position[1]];

      const validSteps = Object.values(Directions)
      .map((direction) => [position[0] + direction[0], position[1] + direction[1]] as Position)
      .map((destination) => {
        if (positionIsValid(destination, grid.length) && canMove(letter, grid[destination[0]][destination[1]])) {
          return [destination, manhattanDistance(destination, endingPosition)] as [Position, number];
        }

        return [destination, -1] as [Position, number];
      })
      .filter(([, distance]) => (distance !== -1))
      .sort(([, a], [, b]) => (a - b));

      console.log(`At [${position[0]}, ${position[1]}]`, letter, validSteps);

      moves[i][j] = {letter, validSteps};
    }
  }

  // const something = Array.from(combinations2(grid.length, grid[0].length)).map((position) => {
  //   const letter = grid[position[0]][position[1]];

  //   const validSteps = Object.values(Directions)
  //     .map((direction) => [position[0] + direction[0], position[1] + direction[1]] as Position)
  //     .map((destination) => {
  //       if (positionIsValid(destination, grid.length) && canMove(letter, grid[destination[0]][destination[1]])) {
  //         return [destination, manhattanDistance(destination, endingPosition)] as [Position, number];
  //       }

  //       return [destination, -1] as [Position, number];
  //     })
  //     .filter(([, distance]) => (distance !== -1))
  //     .sort(([, a], [, b]) => (a - b));

  //   console.log(`At [${position[0]}, ${position[1]}]`, letter, validSteps);
    
  //   return {position: position as Position, letter, validSteps};
  // });

  return {moves, startingPosition, endingPosition};
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

  let position: Position = [...input.startingPosition];
  let moves = 0;

  while(!positionsMatch(position, input.endingPosition)) {
    moves++;
    const [step, distance] = input.moves[position[0]][position[1]].validSteps[0];
    console.log(`Move ${moves}: From [${position[0]}, ${position[1]}] to [${step[0]}, ${step[1]}]`);

    position = [...step];

    if (moves >= 50) break;
  }

  return moves;
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
