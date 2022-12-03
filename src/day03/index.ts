import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput.split('\n');

function validateCompartmentSize(compartment1: string, compartment2: string): void {
  if (compartment1.length !== compartment2.length) {
    throw new Error('Compartment sizes do match for the rucksack: ' + [compartment1, compartment2].toString());
  }
}

function itemTypePriority(itemType: string): number {
  if (!itemType || itemType.length !== 1 || !itemType.match(/[a-z]/i)) {
    throw new Error(`Invalid item type ${itemType}`);
  }

  const asciiValue = itemType.charCodeAt(0);

  if (asciiValue <= 90) { // Read: Is a capital letter
    return asciiValue - 38;
  } else {
    return asciiValue - 96;
  }
}

function findMatchingItemType(compartment1: string, compartment2: string): string {
  validateCompartmentSize(compartment1, compartment2);

  for (let itemType of compartment1) {
    if (compartment2.includes(itemType)) {
      return itemType;
    }
  }

  throw new Error(`No matching item type found between ${compartment1} and ${compartment2}.`)
}

function findMatchingItemTypeFrom3Rucksacks(rucksack1: string, rucksack2: string, rucksack3: string): string {

  for (let itemType of rucksack1) {
    if (rucksack2.includes(itemType) && rucksack3.includes(itemType)) {
      return itemType;
    }
  }

  throw new Error(`No matching item type found between ${rucksack1}, ${rucksack2}, and ${rucksack3}.`);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
    .map(line => [ // split each rucksack into 2 compartments
      line.slice(0, Math.floor(line.length / 2)),
      line.slice(Math.ceil(line.length / 2))
    ]);
  const matchingItemTypes = input.map(rucksack => findMatchingItemType(rucksack[0], rucksack[1]));

  const itemTypePriorities = matchingItemTypes.map(itemType => itemTypePriority(itemType));

  const result = itemTypePriorities.reduce((a, b) => a + b, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const groupsOf3Rucksacks = _.chunk(input, 3); // Use lodash to group rucksacks 3 at a time

  const matchingItemTypes = groupsOf3Rucksacks.map(group => findMatchingItemTypeFrom3Rucksacks(group[0], group[1], group[2]));

  const itemTypePriorities = matchingItemTypes.map(itemType => itemTypePriority(itemType));

  const result = itemTypePriorities.reduce((a, b) => a + b, 0);

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
