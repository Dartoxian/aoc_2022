import * as fs from "fs";

const linePattern = /^(\d+)-(\d+),(\d+)-(\d+)$/;

export function run04() {
  const lines = fs.readFileSync("inputs/04.txt", "utf8").split("\n");
  const pairs = lines.map((line) => {
    const m = linePattern.exec(line);
    return [
      [parseInt(m[1]), parseInt(m[2])],
      [parseInt(m[3]), parseInt(m[4])],
    ];
  });

  const fullyOverlappingPairs = pairs.filter(
    ([[x1, x2], [y1, y2]]) => (x1 <= y1 && x2 >= y2) || (x1 >= y1 && x2 <= y2)
  );

  console.log(
    `There are ${fullyOverlappingPairs.length} fully overlapped pairs.`
  );

  const overlappingPairs = pairs.filter(
    ([[x1, x2], [y1, y2]]) =>
      (x1 >= y1 && x1 <= y2) || (x2 >= y1 && x1 <= y2) || (x1 <= y1 && x2 >= y2)
  );

  console.log(`There are ${overlappingPairs.length} overlapped pairs.`);
}
