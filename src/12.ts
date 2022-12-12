import * as fs from "fs";
import { inclusiveRange } from "./utils";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
type Point = { x: number; y: number };

const pointsEqual = (p1: Point, p2: Point) => p1.y === p2.y && p1.x === p2.x;
const pointToString = ({ x, y }: Point) => `${x}|${y}`;

export function run12() {
  const lines = fs.readFileSync("inputs/12.txt", "utf8").split("\n");

  const charAt = ({ x, y }: Point) => lines[lines.length - 1 - y][x];

  const heightAt = (p: Point) => {
    const c = charAt(p);
    switch (c) {
      case "S":
        return 0;
      case "E":
        return 26;
      default:
        return alphabet.indexOf(charAt(p));
    }
  };

  const validPoint = ({ x, y }) =>
    y >= 0 && y < lines.length && x >= 0 && x < lines[y].length;

  const find = (char: string): Point => {
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (charAt({ x, y }) === char) {
          return { x, y };
        }
      }
    }
  };

  const start = find("S");
  const end = find("E");

  const part1 = () => {
    const allowedMoves = ({ x, y }: Point) => {
      const h = heightAt({ x, y });
      return [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ]
        .filter(validPoint)
        .filter((p) => heightAt(p) <= h + 1);
    };

    const unexploredPoints = [start];
    const pointDistance = { [pointToString(start)]: 0 };
    const pointInQueue = (p: Point) =>
      unexploredPoints.some((p2) => pointsEqual(p, p2));

    while (unexploredPoints.length > 0) {
      const pointToExplore = unexploredPoints.shift();
      const d = pointDistance[pointToString(pointToExplore)];
      if (charAt(pointToExplore) === "E") {
        console.log(`The distance to E is ${d}`);
        break;
      }
      for (const p of allowedMoves(pointToExplore)) {
        if (!pointInQueue(p) && pointDistance[pointToString(p)] === undefined) {
          unexploredPoints.push(p);
          pointDistance[pointToString(p)] = d + 1;
        }
      }
    }
  };

  const part2 = () => {
    const allowedMoves = ({ x, y }: Point) => {
      const h = heightAt({ x, y });
      return [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      ]
        .filter(validPoint)
        .filter((p) => heightAt(p) >= h - 1);
    };

    const unexploredPoints = [end];
    const pointDistance = { [pointToString(end)]: 0 };
    const pointInQueue = (p: Point) =>
      unexploredPoints.some((p2) => pointsEqual(p, p2));

    while (unexploredPoints.length > 0) {
      const pointToExplore = unexploredPoints.shift();
      const d = pointDistance[pointToString(pointToExplore)];
      if (charAt(pointToExplore) === "a") {
        console.log(`The distance to a is ${d}`);
        break;
      }
      for (const p of allowedMoves(pointToExplore)) {
        if (!pointInQueue(p) && pointDistance[pointToString(p)] === undefined) {
          unexploredPoints.push(p);
          pointDistance[pointToString(p)] = d + 1;
        }
      }
    }
  };

  part1();
  part2();
}
