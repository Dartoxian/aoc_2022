import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

type RockOffset = [number, number][];
const rockOffsets: RockOffset[] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
];

export function run17() {
  const lines = fs.readFileSync("inputs/17.txt", "utf8").split("\n");

  let floorRocks: boolean[][] = [];
  const rockAt = (x: number, y: number) =>
    x < 0 || x >= 7 || y < 0 || (y < floorRocks.length && floorRocks[y][x]);
  const putRockAt = (x: number, y: number) => {
    if (floorRocks[y] === undefined) {
      floorRocks[y] = [...inclusiveRange(1, 7)].map((x) => false);
    }
    floorRocks[y][x] = true;
  };

  const collidesAt = (x: number, y: number, rockOffset: RockOffset): boolean =>
    rockOffset.some(([dx, dy]) => rockAt(x + dx, y + dy));
  const putAt = (x: number, y: number, rockOffset: RockOffset) =>
    rockOffset.forEach(([dx, dy]) => putRockAt(x + dx, y + dy));

  let step = 0;
  let rockNumber = 0;
  let height = 0;
  const layoutSeenAt: Record<
    string,
    { rockNumber: number; maxHeight: number }
  > = {};
  const layoutKey = (rockOffsetNumber: number, step: number) => {
    const heights = [...inclusiveRange(0, 7 - 1)].map((x) => {
      let y = floorRocks.length;
      let h = 0;
      while (!rockAt(x, y)) {
        y -= 1;
        h += 1;
      }
      return h;
    });
    return JSON.stringify({ h: heights, r: rockOffsetNumber, s: step });
  };
  while (true) {
    const rockOffset = rockOffsets[rockNumber % rockOffsets.length];
    let y = floorRocks.length + 3;
    let x = 2;
    let done = false;
    while (!done) {
      const shift = lines[0][step % lines[0].length] === "<" ? -1 : 1;
      if (!collidesAt(x + shift, y, rockOffset)) {
        x += shift;
      }
      if (!collidesAt(x, y - 1, rockOffset)) {
        y -= 1;
      } else {
        putAt(x, y, rockOffset);
        done = true;
      }
      step += 1;
    }
    const key = layoutKey(
      rockNumber % rockOffsets.length,
      step % lines[0].length
    );
    if (layoutSeenAt[key] && rockNumber > 5000 && rockNumber < 10000) {
      console.log(
        "Identical layout seen at rockNumber ",
        layoutSeenAt[key],
        key,
        height + floorRocks.length,
        step
      );
      const repeatsEvery = rockNumber - layoutSeenAt[key].rockNumber;
      console.log(`Repeats every ${repeatsEvery}`);
      const repeatHeight =
        height + floorRocks.length - layoutSeenAt[key].maxHeight;
      console.log(`Repeat height is ${repeatHeight}`);
      const repeatsToAdd = Math.floor(
        (1000000000000 - rockNumber) / repeatsEvery
      );
      console.log(`Pattern repeats ${repeatsToAdd} times`);
      rockNumber += repeatsToAdd * repeatsEvery;
      height += repeatHeight * repeatsToAdd;
      console.log(`Height is ${height}`);
    } else {
      layoutSeenAt[key] = { rockNumber, maxHeight: height + floorRocks.length };
    }
    if (rockNumber === 2022 - 1) {
      console.log(`The tower reaches ${height + floorRocks.length}`);
    }
    if (rockNumber === 1000000000000 - 1) {
      console.log(`The tower reaches ${height + floorRocks.length}`);
      break;
    }
    if (floorRocks[floorRocks.length - 1].every(Boolean)) {
      height += floorRocks.length;
      floorRocks = [];
    }
    if (rockNumber % 1000000 === 0) {
      console.log(`Processed ${rockNumber} rocks`);
    }

    rockNumber += 1;
  }
}
