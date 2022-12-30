import run from "aocrunner";
import { ObjectSet } from "../utils/index.js";
import 'lodash.combinations';
import _ from "lodash";

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

function getPerimeterAtDistance(position: Position, distance: number, predicate: (a: Position) => boolean = () => true): ObjectSet<Position> {
  const perimeterPositions = new ObjectSet<Position>();

  const [x, y] = position;

  for (let i = 0; i < distance; i++) {
    const positions = [
      [x + distance - i, y - i],
      [x - i, y - distance + i],
      [x - distance + i, y + i],
      [x + i, y + distance - i]
    ] as Position[];

    positions.forEach((position) => {
      if (predicate(position)) perimeterPositions.add(position);
    });
  }

  return perimeterPositions;
}

function tuningFrequency(position: Position): number {
  const [x, y] = position;

  return x * 4000000 + y;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const perimeters = input.map(({sensor, beacon}) => {
    const manhattanDistanceBetweenSensorAndBeacon = manhattanDistance(sensor, beacon);
    return getPerimeterAtDistance(sensor, manhattanDistanceBetweenSensorAndBeacon + 1, ([x, y]) => x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000);
  });

  const intersections = _.combinations(perimeters, 2).map(([a, b]) => a.intersection(b));

  // Quick check that we aren't getting too many possible candidate positions
  // There should ultimately be exactly 1 possible position
  // intersections.forEach((intersection) => {
  //   if (intersection.size > 1) {
  //     throw new Error('Too many candidate positions found');
  //   }
  // });

  const result: Position = intersections.filter((intersection) => intersection.size > 0)[0].values().next().value;

  return tuningFrequency(result);
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
        expected: 0,
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
