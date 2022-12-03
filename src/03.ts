import * as fs from "fs";
import { group } from "./utils";

type Compartment = string;
type Bag = [Compartment, Compartment];

function items([c1, c2]: Bag): string {
  return c1 + c2;
}

function priority(item: string) {
  return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item);
}

function commonItem([c1, c2]: Bag) {
  for (const i of c1) {
    if (c2.includes(i)) {
      return i;
    }
  }
  throw new Error(`No common items between compartments ${c1} and ${c2}`);
}

function badgeItem(b1: Bag, b2: Bag, b3: Bag) {
  for (const i of items(b1)) {
    if (items(b2).includes(i) && items(b3).includes(i)) {
      return i;
    }
  }
  throw new Error(`No common items between bags ${b1} and ${b2} and ${b3}`);
}

export function run03() {
  const lines = fs.readFileSync("inputs/03.txt", "utf8").split("\n");
  const bags: Bag[] = lines.map((bag) => [
    bag.slice(0, bag.length / 2),
    bag.slice(bag.length / 2),
  ]);

  const totalPart1Priority = bags
    .map(commonItem)
    .map(priority)
    .reduce((a, b) => a + b);

  console.log(`Total priority for part 1 is ${totalPart1Priority}`);

  const totalPart2Priority = group(bags, 3)
    .map(([b1, b2, b3]) => badgeItem(b1, b2, b3))
    .map(priority)
    .reduce((a, b) => a + b);

  console.log(`Total priority for part 2 is ${totalPart2Priority}`);
}
