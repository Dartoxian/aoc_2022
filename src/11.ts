import * as fs from "fs";
import { inclusiveRange } from "./utils";

const monkeyIdParser = /Monkey (\d+)/;
const startingItemsParser = /(?: (\d+),?)/g;
const operationParser = /\s+Operation: new = old (\*|\+) (\d+|old)/;
const testParser = /\s+Test: divisible by (\d+)/;
const testTrueParser = /\s+If true: throw to monkey (\d+)/;
const testFalseParser = /\s+If false: throw to monkey (\d+)/;

type ThrowTester = {
  factor: number;
  ifTrue: number;
  ifFalse: number;
};

// Update this for part 1 solution (relief should be /3)
const reliefUpdater = (worry: number) => Math.floor(worry / 1);

class Monkey {
  inspectionCount = 0n;
  private itemWorry: number[];
  private readonly worryUpdater: (worry: number) => number;
  readonly throwTester: ThrowTester;

  constructor(
    startingItems: number[],
    worryUpdater: (worry: number) => number,
    throwTester: ThrowTester
  ) {
    this.itemWorry = startingItems;
    this.worryUpdater = worryUpdater;
    this.throwTester = throwTester;
  }

  receiveItem(worry: number) {
    this.itemWorry.push(worry);
  }

  holding() {
    return this.itemWorry.length;
  }

  inspectItems() {
    this.inspectionCount += BigInt(this.itemWorry.length);
    this.itemWorry = this.itemWorry.map(this.worryUpdater).map(reliefUpdater);
  }

  processRound(throwTo: (worry: number, monkeyId: number) => void) {
    this.inspectItems();
    this.itemWorry.forEach((worry) =>
      throwTo(
        worry,
        worry % this.throwTester.factor === 0
          ? this.throwTester.ifTrue
          : this.throwTester.ifFalse
      )
    );
    this.itemWorry = [];
  }
}

export function run11() {
  const lines = fs.readFileSync("inputs/11.txt", "utf8").split("\n");

  let i = 0;
  const monkeys: Monkey[] = [];
  while (i < lines.length) {
    const id = parseInt(monkeyIdParser.exec(lines[i])[1]);
    i++;
    const startingWorry = [...lines[i].matchAll(startingItemsParser)].map((m) =>
      parseInt(m[1])
    );
    i++;
    const mOp = operationParser.exec(lines[i]);
    const operation = (worry: number) => {
      const v = mOp[2] === "old" ? worry : parseInt(mOp[2]);
      return mOp[1] === "*" ? worry * v : worry + v;
    };
    i++;
    const mTest = testParser.exec(lines[i]);
    i++;
    const mTrue = testTrueParser.exec(lines[i]);
    i++;
    const mFalse = testFalseParser.exec(lines[i]);
    const tester: ThrowTester = {
      factor: parseInt(mTest[1]),
      ifTrue: parseInt(mTrue[1]),
      ifFalse: parseInt(mFalse[1]),
    };
    i++;
    monkeys[id] = new Monkey(startingWorry, operation, tester);
    i++;
  }

  const worryFactor = monkeys
    .map((monkey) => monkey.throwTester.factor)
    .reduce((a, b) => a * b);

  const throwTo = (worry: number, monkey: number) =>
    monkeys[monkey].receiveItem(worry % worryFactor);

  for (const round of inclusiveRange(1, 10000)) {
    for (const monkey of monkeys) {
      monkey.processRound(throwTo);
    }
  }

  const inspectionCounts = monkeys
    .map((monkey) => monkey.inspectionCount)
    .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  console.log(
    `The part 1 solution is ${inspectionCounts[0] * inspectionCounts[1]}`
  );
}
