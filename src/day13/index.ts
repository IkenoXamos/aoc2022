import run from "aocrunner";
import { inspect } from "util";
import { match, P } from "ts-pattern";
import _ from "lodash";

type Packet = number | Array<Packet>;
type Pair = [Packet, Packet];

enum Order {
  Right,
  Wrong,
  Unknown
}

const parseInput = (rawInput: string): Pair[] => rawInput.split("\n\n").map(pair => pair.split("\n").map((line) => JSON.parse(line)) as Pair);

function compare(a: Packet, b: Packet): Order {
  return match([a, b])
    .with([P.number, P.number], ([a, b]) => a < b, () => Order.Right)
    .with([P.number, P.number], ([a, b]) => a > b, () => Order.Wrong)
    .with([P.number, P.number], ([a, b]) => a === b, () => Order.Unknown)
    .with([P.number, P.array(P._)], () => compare([a], b))
    .with([P.array(P._), P.number], () => compare(a, [b]))
    .with([P.array(P._), P.array(P._)], () => {
      for (const [one, two] of _.zip(a as Packet[], b as Packet[])) {
        if (one !== undefined && two !== undefined) {
          switch(compare(one, two)) {
            case Order.Right: return Order.Right;
            case Order.Wrong: return Order.Wrong;
          }
        }
        if (one !== undefined && two === undefined) return Order.Wrong;
        if (one === undefined) return Order.Right;
      }

      return Order.Unknown;
    })
    .run();
    // .otherwise(() => {throw new Error('Failed to properly determine case 2')});
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.log(inspect(input, {showHidden: false, depth: null, colors: true}));

  const results = input.map(([left, right]) => compare(left, right));
  // console.log(results);

  return results.reduce<number>((prev: number, current: Order, index: number) => prev + (current === Order.Right ? index + 1 : 0), 0);
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
        [9]
        [[8,7,6]]`,
        expected: 0,
      },
      {
        input: `
        [1,1,3,1,1]
        [1,1,5,1,1]

        [[1],[2,3,4]]
        [[1],4]

        [9]
        [[8,7,6]]

        [[4,4],4,4]
        [[4,4],4,4,4]

        [7,7,7,7]
        [7,7,7]

        []
        [3]

        [[[]]]
        [[]]

        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
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
  onlyTests: false,
});
