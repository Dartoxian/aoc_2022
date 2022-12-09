import * as fs from "fs";

const inputPattern = /(U|D|L|R) (\d+)/;

type Direction = "U" | "D" | "L" | "R";
type Point = { x: number; y: number };

export function run09() {
  const lines = fs.readFileSync("inputs/09.txt", "utf8").split("\n");

  const movePoint = ({ x, y }: Point, direction: Direction) => {
    switch (direction) {
      case "D":
        return { x, y: y - 1 };
      case "U":
        return { x, y: y + 1 };
      case "L":
        return { x: x - 1, y };
      case "R":
        return { x: x + 1, y };
    }
  };

  const chasePoint = (head: Point, tail: Point): Point => {
    const offset = { x: head.x - tail.x, y: head.y - tail.y };
    if (
      [
        [-2, 1],
        [-2, 2],
        [-1, 2],
      ].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(movePoint(tail, "U"), "L");
    }
    if (
      [
        [1, 2],
        [2, 2],
        [2, 1],
      ].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(movePoint(tail, "U"), "R");
    }
    if (
      [
        [2, -1],
        [2, -2],
        [1, -2],
      ].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(movePoint(tail, "D"), "R");
    }
    if (
      [
        [-1, -2],
        [-2, -2],
        [-2, -1],
      ].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(movePoint(tail, "D"), "L");
    }
    if (
      [[0, 2]].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(tail, "U");
    }
    if (
      [[2, 0]].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(tail, "R");
    }
    if (
      [[0, -2]].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(tail, "D");
    }
    if (
      [[-2, 0]].some(([hitX, hitY]) => hitX === offset.x && hitY === offset.y)
    ) {
      return movePoint(tail, "L");
    }
    return tail;
  };

  const getTailLocations = (rope: Point[]): Point[] => {
    const tailLocations: Point[] = [rope[rope.length - 1]];
    for (const line of lines) {
      const m = inputPattern.exec(line);
      if (!m) {
        throw new Error(`Cannot parse line ${line}`);
      }
      const direction = m[1] as Direction;
      const steps = m[2];
      for (let i = 0; i < parseInt(steps); i++) {
        const oldRope = [...rope];
        rope = [movePoint(rope[0], direction)];
        for (let j = 1; j < oldRope.length; j++) {
          rope.push(chasePoint(rope[j - 1], oldRope[j]));
        }
        tailLocations.push(rope[rope.length - 1]);
      }
    }
    return tailLocations;
  };

  const p1TailLocations = getTailLocations([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const numTailPositionsVisited = p1TailLocations.filter(
    (p, i, arr) => i === arr.findIndex((p2) => p2.x === p.x && p2.y === p.y)
  ).length;
  console.log(`The tail visited ${numTailPositionsVisited} positions`);

  const p2TailLocations = getTailLocations([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const numTailPositionsVisitedP2 = p2TailLocations.filter(
    (p, i, arr) => i === arr.findIndex((p2) => p2.x === p.x && p2.y === p.y)
  ).length;
  console.log(`The longer tail visited ${numTailPositionsVisitedP2} positions`);
}
