import * as fs from "fs";
import { inclusiveRange } from "./utils";
import * as console from "console";

const pointPattern = /(\d+),(\d+)/g;

export function run14() {
  const lines = fs.readFileSync("inputs/14.txt", "utf8").split("\n");

  const points = new Set<string>();
  const pointToString = (x: number, y: number) => `${x},${y}`;
  let lowestPoint = 0;

  for (const line of lines) {
    const m = [...line.matchAll(pointPattern)];
    for (let i = 1; i < m.length; i++) {
      for (const x of inclusiveRange(
        parseInt(m[i - 1][1]),
        parseInt(m[i][1])
      )) {
        for (const y of inclusiveRange(
          parseInt(m[i - 1][2]),
          parseInt(m[i][2])
        )) {
          points.add(pointToString(x, y));
          if (y > lowestPoint) {
            lowestPoint = y;
          }
        }
      }
    }
  }

  console.log(`Lowest point is at ${lowestPoint}`);

  const platformSize = points.size;
  SAND_ADD_LOOP: while (true) {
    let x = 500;
    let y = 0;
    let pointSettled = false;
    while (!pointSettled) {
      if (y >= lowestPoint) {
        break SAND_ADD_LOOP;
      }
      if (!points.has(pointToString(x, y + 1))) {
        y = y + 1;
        continue;
      }
      if (!points.has(pointToString(x - 1, y + 1))) {
        x = x - 1;
        y = y + 1;
        continue;
      }
      if (!points.has(pointToString(x + 1, y + 1))) {
        x = x + 1;
        y = y + 1;
        continue;
      }
      pointSettled = true;
    }
    points.add(pointToString(x, y));
  }

  console.log(`${points.size - platformSize} grains of sand settled`);

  while (true) {
    let x = 500;
    let y = 0;
    if (points.has(pointToString(x, y))) {
      break;
    }
    let pointSettled = false;
    while (!pointSettled) {
      if (y === lowestPoint + 1) {
        pointSettled = true;
        break;
      }
      if (!points.has(pointToString(x, y + 1))) {
        y = y + 1;
        continue;
      }
      if (!points.has(pointToString(x - 1, y + 1))) {
        x = x - 1;
        y = y + 1;
        continue;
      }
      if (!points.has(pointToString(x + 1, y + 1))) {
        x = x + 1;
        y = y + 1;
        continue;
      }
      pointSettled = true;
    }
    points.add(pointToString(x, y));
  }

  console.log(
    `${
      points.size - platformSize
    } grains of sand settled, now that there is a floor`
  );
}
