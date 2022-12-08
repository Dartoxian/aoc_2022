import * as fs from "fs";

type Direction = { x: number; y: number };
const UP: Direction = { x: 0, y: 1 };
const RIGHT: Direction = { x: 1, y: 0 };
const DOWN: Direction = { x: 0, y: -1 };
const LEFT: Direction = { x: -1, y: 0 };

export function run08() {
  const lines = fs.readFileSync("inputs/08.txt", "utf8").split("\n");
  const trees: number[][] = lines.map((line) =>
    line.split("").map((s) => {
      return parseInt(s);
    })
  );

  const heightAt = (x: number, y: number) => trees[trees.length - y - 1][x];
  const isTallestInDirection = (
    x: number,
    y: number,
    d: Direction
  ): boolean => {
    const h = heightAt(x, y);
    let i = x + d.x;
    let j = y + d.y;
    while (j >= 0 && j < trees.length && i >= 0 && i < trees[j].length) {
      if (heightAt(i, j) >= h) {
        return false;
      }
      i += d.x;
      j += d.y;
    }
    return true;
  };

  let visibleCount = 0;
  for (let j = 0; j < trees.length; j++) {
    for (let i = 0; i < trees[j].length; i++) {
      if (
        isTallestInDirection(i, j, UP) ||
        isTallestInDirection(i, j, RIGHT) ||
        isTallestInDirection(i, j, DOWN) ||
        isTallestInDirection(i, j, LEFT)
      ) {
        visibleCount++;
      }
    }
  }

  console.log(`There are ${visibleCount} visible trees`);

  const viewingDistance = (x: number, y: number, d: Direction) => {
    let viewingDistance = 0;
    let i = x + d.x;
    let j = y + d.y;
    let h = heightAt(x, y);
    while (j >= 0 && j < trees.length && i >= 0 && i < trees[j].length) {
      viewingDistance += 1;
      if (h <= heightAt(i, j)) {
        return viewingDistance;
      }
      i += d.x;
      j += d.y;
    }
    return viewingDistance;
  };

  let bestScenicScore = 0;
  for (let j = 0; j < trees.length; j++) {
    for (let i = 0; i < trees[j].length; i++) {
      const score =
        viewingDistance(i, j, UP) *
        viewingDistance(i, j, RIGHT) *
        viewingDistance(i, j, DOWN) *
        viewingDistance(i, j, LEFT);
      if (score > bestScenicScore) {
        bestScenicScore = score;
      }
    }
  }

  console.log(`The best scenic score is ${bestScenicScore}`);
}
