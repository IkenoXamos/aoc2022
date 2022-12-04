import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(','));

type SectionAssignment = {
  from: number;
  to: number;
}

type AssignmentPair = [SectionAssignment, SectionAssignment];

function containsOther(section1: SectionAssignment, section2: SectionAssignment): boolean {
  return (section1.from <= section2.from && section1.to >= section2.to);
}

function overlaps(section1: SectionAssignment, section2: SectionAssignment): boolean {
  return (section1.from <= section2.to && section1.to >= section2.from);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sectionAssignments = input.map((pair => [
    { from: Number(pair[0].split('-')[0]), to: Number(pair[0].split('-')[1]) },
    { from: Number(pair[1].split('-')[0]), to: Number(pair[1].split('-')[1]) }
  ] as AssignmentPair));

  const assignmentsFullyOverlapped = sectionAssignments.map((pair) => containsOther(pair[0], pair[1]) || containsOther(pair[1], pair[0]));

  const result = assignmentsFullyOverlapped.reduce((total, curr) => curr ? total + 1 : total, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sectionAssignments = input.map((pair => [
    { from: Number(pair[0].split('-')[0]), to: Number(pair[0].split('-')[1]) },
    { from: Number(pair[1].split('-')[0]), to: Number(pair[1].split('-')[1]) }
  ] as AssignmentPair));

  const assignmentsFullyOverlapped = sectionAssignments.map((pair) => overlaps(pair[0], pair[1]) || overlaps(pair[1], pair[0]));

  const result = assignmentsFullyOverlapped.reduce((total, curr) => curr ? total + 1 : total, 0);

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
