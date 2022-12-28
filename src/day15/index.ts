import run from "aocrunner";
import { ObjectSet } from "../utils/index.js";

type Position = [number, number];
type Survey = { sensor: Position, beacon: Position };

const parseInput = (rawInput: string): Array<Survey> => 
  rawInput
  .split("\n")
  .map((line) => {
    const components = line.split(/x=|, y=|:/);

    return {
      sensor: [Number(components[1]), Number(components[2])] as Position,
      beacon: [Number(components[4]), Number(components[5])] as Position
    } as Survey;
  });

function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const blockedXCoordinates = new Set<number>();
  const beaconPositions = input.reduce<ObjectSet<Position>>((beacons, {beacon}) => beacons.add(beacon), new ObjectSet<Position>());
  const targetRow = 2000000;

  for (const {sensor, beacon} of input) {
    const manhattanDistanceBetweenSensorAndBeacon = manhattanDistance(sensor, beacon);
    const sensorsDistanceFromTargetRow = Math.abs(targetRow - sensor[1]);
    const distance = manhattanDistanceBetweenSensorAndBeacon - sensorsDistanceFromTargetRow;

    if (distance >= 0) new Array(distance + 1).fill(0)
        .flatMap((_, i) => [sensor[0] + i, sensor[0] - i])
        .forEach((x) => {if (!beaconPositions.has([x, targetRow])) blockedXCoordinates.add(x)});
  }

  return blockedXCoordinates.size;
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
        Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 26,
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
