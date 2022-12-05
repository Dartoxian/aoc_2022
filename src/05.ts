import * as fs from "fs";

const stackPattern = /(?:(?:\[(\w)])|(?: ( ) )) ?/g;
const stackNumberPattern = /^( \d *)+$/;
const instructionPattern = /move (\d+) from (\d+) to (\d+)/;

type Stack = string[];

function parseInput(lines: string[]): [Stack[], number] {
  let i = 0;
  const stacks: Stack[] = [];
  while (i < lines.length && !stackNumberPattern.test(lines[i])) {
    const line = lines[i];
    const m = [...line.matchAll(stackPattern)];
    let j = 0;
    while (j < m.length) {
      while (j >= stacks.length) {
        stacks.push([]);
      }
      if (m[j][2] !== " ") {
        stacks[j] = [m[j][1], ...stacks[j]];
      }
      j++;
    }
    i++;
  }
  // i is on the stack label row
  i += 2;
  // is is on the first instruction
  return [stacks, i];
}

function part1() {
  const lines = fs.readFileSync("inputs/05.txt", "utf8").split("\n");
  let [stacks, i] = parseInput(lines);

  while (i < lines.length) {
    const m = instructionPattern.exec(lines[i]);
    for (let j = 0; j < parseInt(m[1]); j++) {
      const item = stacks[parseInt(m[2]) - 1].pop();
      stacks[parseInt(m[3]) - 1].push(item);
    }
    i++;
  }

  const topItems = stacks.map((stack) => stack[stack.length - 1]).join("");
  console.log(`The top items are ${topItems}`);
}

export function part2() {
  const lines = fs.readFileSync("inputs/05.txt", "utf8").split("\n");
  let [stacks, i] = parseInput(lines);

  while (i < lines.length) {
    const m = instructionPattern.exec(lines[i]);
    const items = stacks[parseInt(m[2]) - 1].splice(
      stacks[parseInt(m[2]) - 1].length - parseInt(m[1])
    );
    stacks[parseInt(m[3]) - 1].push(...items);
    i++;
  }

  const topItems = stacks.map((stack) => stack[stack.length - 1]).join("");
  console.log(`The top items are ${topItems}`);
}

export function run05() {
  part1();
  part2();
}
