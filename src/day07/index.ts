import run from "aocrunner";
import { Stack } from "stack-typescript";

type File = {
  name: string;
  size: number;
  parent: Directory;
}

type Directory = {
  name: string;
  children: Array<File | Directory>;
  parent: Directory | null;
  size: number;
}

const parseInput = (rawInput: string) => {
  const root: Directory = {
    name: '/',
    children: [],
    parent: null,
    size: 0,
  };

  let runner: Directory = root;

  // The idea is to skip the first line which is already handled by the definition of the root directory above
  // From there, we can still end up ignoring most lines
  // All we care about are tracking which directory we are in (determined by each cd command)
  // As well as any discovered file
  // When we cd into a new directory, we add that node, and track it as the current directory
  // When we find a file, we add its size to each parent directory all the way back to the root
  // And when we cd back up, we switch to tracking the parent directory
  // This lets us skip processing ~37% of lines
  rawInput.split("\n").slice(1).forEach((line) => {

    // The case where we found a file in the current directory
    if (line.split(' ')[0].match(/[0-9]/)) {
      const [size, name] = line.split(' ');
      runner.children.push({
        name: `${runner.name}${name}`,
        size: Number(size),
        parent: runner,
      });

      updateDirectorySizes(runner, Number(size));

      // The case where we switch into a new directory
    } else if (line.startsWith('$ cd') && !line.includes('..')) {
      const parent = runner;
      runner = {
        name: `${parent.name}${line.slice(5)}/`,
        children: [],
        parent,
        size: 0,
      }
      parent.children.push(runner);

      // The case where we switch back up into the parent directory
    } else if (line.includes('cd ..')) {
      if (!runner.parent) {
        throw new Error('Missing parent directory');
      }

      runner = runner.parent;
    }
  });

  return root;
}

function isDirectory(node: File | Directory): node is Directory {
  return ('children' in node);
}

function updateDirectorySizes(node: Directory, size: number): void {
  let runner: Directory | null = node;

  while (runner) {
    runner.size += size;
    runner = runner.parent;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let result = 0;

  const toVisit = new Stack<File | Directory>(...input.children);
  while (toVisit.length > 0) {
    const current = toVisit.pop();

    if (isDirectory(current) && current.size <= 100000) {
      result += current.size;
    }

    if (isDirectory(current)) current.children.forEach((node) => toVisit.push(node));
  }

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const unusedSpace = 70000000 - input.size;
  const spaceNeeded = 30000000 - unusedSpace;

  let smallestDirectoryFound = Number.MAX_VALUE;

  const toVisit = new Stack<File | Directory>(...input.children);
  while (toVisit.length > 0) {
    const current = toVisit.pop();

    if (isDirectory(current)) {
      if (current.size >= spaceNeeded && current.size < smallestDirectoryFound) {
        smallestDirectoryFound = current.size;
      }

      current.children.forEach((node) => toVisit.push(node))
    }
  }

  return smallestDirectoryFound;
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
