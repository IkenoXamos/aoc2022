import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(' '));

enum Shape {
  Rock, Paper, Scissors
}

enum GameResult {
  Lose, Draw, Win
}

function letterToShape(c: string): Shape {
  if (c === 'A' || c === 'X') return Shape.Rock;
  if (c === 'B' || c === 'Y') return Shape.Paper;
  if (c === 'C' || c === 'Z') return Shape.Scissors;

  throw new Error(`Failed to convert letter (${c}) to shape`);
}

function letterToGameResult(c: string): GameResult {
  if (c === 'X') return GameResult.Lose;
  if (c === 'Y') return GameResult.Draw;
  if (c === 'Z') return GameResult.Win;

  throw new Error(`Failed to convert letter (${c}) to game result`);
}

function pointsFromShape(shape: Shape): number {
  if (shape === Shape.Rock) return 1;
  if (shape === Shape.Paper) return 2;
  if (shape === Shape.Scissors) return 3;
  throw new Error(`Failed to convert ${shape} into number of points`);
}

function pointsFromGame(player: Shape, opponent: Shape): number {
  let win = false;
  if (player === Shape.Rock && opponent === Shape.Scissors ||
    player === Shape.Paper && opponent === Shape.Rock ||
    player === Shape.Scissors && opponent === Shape.Paper) {
    win = true;
  }
  const draw = (player === opponent);

  const points = pointsFromShape(player);

  return win ? points + 6 : (draw ? points + 3 : points);
}

function decideShapeFromResult(opponent: Shape, result: GameResult): Shape {
  if (opponent === Shape.Rock) {
    if (result === GameResult.Win) return Shape.Paper;
    if (result === GameResult.Draw) return Shape.Rock;
    if (result === GameResult.Lose) return Shape.Scissors;
  }

  if (opponent === Shape.Paper) {
    if (result === GameResult.Win) return Shape.Scissors;
    if (result === GameResult.Draw) return Shape.Paper;
    if (result === GameResult.Lose) return Shape.Rock;
  }

  if (opponent === Shape.Scissors) {
    if (result === GameResult.Win) return Shape.Rock;
    if (result === GameResult.Draw) return Shape.Scissors;
    if (result === GameResult.Lose) return Shape.Paper;
  }

  throw new Error('Could not determine what shape to play');
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).map(game => game.map(letter => letterToShape(letter)));

  const result = input.map((game) => pointsFromGame(game[1], game[0])).reduce((prev, curr) => prev + curr, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).map(game => [letterToShape(game[0]), decideShapeFromResult(letterToShape(game[0]), letterToGameResult(game[1]))]);

  const result = input.map((game) => pointsFromGame(game[1], game[0])).reduce((prev, curr) => prev + curr, 0);

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
