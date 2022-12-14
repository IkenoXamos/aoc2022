import run from "aocrunner";
import { match, P } from "ts-pattern";
import { range } from "../utils/index.js";

type LiteralArgument = { type: "literal", value: number };
type DynamicArgument = { type: "dynamic" };
type Argument = LiteralArgument | DynamicArgument;

function isDynamic(arg: Argument): arg is DynamicArgument {
  return match(arg).with({ type: "dynamic" }, () => true).otherwise(() => false);
}

function isLiteral(arg: Argument): arg is LiteralArgument {
  return match(arg).with({ type: "literal" }, () => true).otherwise(() => false);
}

type Operation = {
  type: "*" | "+";
  arg: Argument;
}

type Monkey = {
  items: number[];
  operation: Operation;
  toss: (worryLevel: number) => number;
  inspections: number;
  inspect: (worryLevel: number) => number;
}

const parseInput = (rawInput: string): Monkey[] => rawInput.split("\n\n").map((group) => {
  const lines = group.split("\n");
  // Line will be of the format: "  Starting items: <items, separated by commas>"
  const items = lines[1].split(": ")[1].split(", ").map(value => Number(value));

  // Line will be of the format: "  Operation: new = old <operation> <arg>"
  const expression = lines[2].split("new = old ")[1];
  const [op, secondArg] = expression.split(" ");
  const operation: Operation = {
    type: (op === "*") ? "*" : "+",
    arg: match<string, Argument>(secondArg)
      .with("old", () => ({ type: "dynamic" }))
      .otherwise((value) => ({ type: "literal", value: Number(value) })),
  };

  const divisibleBy = Number(lines[3].split("by ")[1]);
  const destinationIfTrue = Number(lines[4].split("to monkey ")[1]);
  const destinationIfFalse = Number(lines[5].split("to monkey ")[1]);
  const toss = (worryLevel: number) => (worryLevel % divisibleBy === 0) ? destinationIfTrue : destinationIfFalse;

  // Uses pattern matching to determine the equation to use
  const inspect = match(operation)
    .with({ type: "*", arg: P.when(isDynamic) }, () => ((value: number) => value * value))
    .with({ type: "*", arg: { value: P.select() } }, (literal) => ((value: number) => value * literal))
    .with({ type: "+", arg: P.when(isDynamic) }, () => ((value: number) => value + value))
    .with({ type: "+", arg: { value: P.select() } }, (literal) => ((value: number) => value + literal))
    .exhaustive();

  return { items, operation, toss, inspections: 0, inspect };
});

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);

  for (const round of range(20)) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();

        if (!item) {
          break;
        }

        const itemAfterInspection = Math.floor(monkey.inspect(item) / 3);
        monkey.inspections++;

        const destination = monkey.toss(itemAfterInspection);

        monkeys[destination].items.push(itemAfterInspection);
      }
    }
  }

  return monkeys
    .sort((a, b) => b.inspections - a.inspections) // sort based on number of inspections
    .slice(0, 2) // grab the 2 most active
    .reduce<number>((product, monkey) => product * monkey.inspections, 1); // multiply the values together
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);

  // for (const round of range(10000)) {
  //   for (const monkey of monkeys) {
  //     while (monkey.items.length > 0) {
  //       const item = monkey.items.shift();

  //       if (!item) {
  //         break;
  //       }

  //       const itemAfterInspection = monkey.inspect(item);
  //       monkey.inspections++;

  //       const destination = monkey.toss(itemAfterInspection);

  //       monkeys[destination].items.push(itemAfterInspection);
  //     }
  //   }
  // }

  // return monkeys
  //   .sort((a, b) => b.inspections - a.inspections) // sort based on number of inspections
  //   .slice(0, 2) // grab the 2 most active
  //   .reduce<number>((product, monkey) => product * monkey.inspections, 1); // multiply the values together
  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1`,
        expected: 2713310158n,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
