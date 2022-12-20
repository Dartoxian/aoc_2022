import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

const part2 = (encryptedFile: number[]) => {
  let decryptedFile = encryptedFile.map((v) => ({
    value: v * 811589153,
    mixRound: 1,
  }));
  for (const round of inclusiveRange(1, 10)) {
    let i = 0;
    while (i < decryptedFile.length) {
      const symbol = decryptedFile[i];
      if (symbol.mixRound === round) {
        let newPosition = i + symbol.value;
        while (newPosition < 0) {
          newPosition += decryptedFile.length - 1;
        }

        while (newPosition >= decryptedFile.length) {
          newPosition -= decryptedFile.length - 1;
        }
        decryptedFile = [
          ...decryptedFile.slice(0, i),
          ...decryptedFile.slice(i + 1, decryptedFile.length),
        ];
        decryptedFile = [
          ...decryptedFile.slice(0, newPosition),
          { ...symbol, mixRound: round + 1 },
          ...decryptedFile.slice(newPosition, decryptedFile.length),
        ];
        i = 0;
      } else {
        i++;
      }
    }
    console.log(`Finished round ${round}`);
  }

  const zeroAt = decryptedFile.findIndex((v) => v.value === 0);
  console.log([
    decryptedFile[(zeroAt + 1000) % decryptedFile.length],
    decryptedFile[(zeroAt + 2000) % decryptedFile.length],
    decryptedFile[(zeroAt + 3000) % decryptedFile.length],
  ]);
  const p1Answer = [
    decryptedFile[(zeroAt + 1000) % decryptedFile.length],
    decryptedFile[(zeroAt + 2000) % decryptedFile.length],
    decryptedFile[(zeroAt + 3000) % decryptedFile.length],
  ]
    .map(({ value }) => value)
    .reduce((a, b) => a + b);
  console.log(`p2 answer is ${p1Answer}`);
};

export function run20() {
  const lines = fs.readFileSync("inputs/20.txt", "utf8").split("\n");

  const encryptedFile: number[] = [];
  for (const line of lines) {
    encryptedFile.push(parseInt(line));
  }

  let decryptedFile = encryptedFile.map((v) => ({ value: v, unmixed: true }));
  let i = 0;
  while (i < decryptedFile.length) {
    const symbol = decryptedFile[i];
    if (symbol.unmixed) {
      let newPosition = i + symbol.value;
      while (newPosition < 0) {
        newPosition += decryptedFile.length - 1;
      }

      while (newPosition >= decryptedFile.length) {
        newPosition -= decryptedFile.length - 1;
      }
      decryptedFile = [
        ...decryptedFile.slice(0, i),
        ...decryptedFile.slice(i + 1, decryptedFile.length),
      ];
      decryptedFile = [
        ...decryptedFile.slice(0, newPosition),
        { ...symbol, unmixed: false },
        ...decryptedFile.slice(newPosition, decryptedFile.length),
      ];
      i = 0;
    } else {
      i++;
    }
  }

  const zeroAt = decryptedFile.findIndex((v) => v.value === 0);
  console.log([
    decryptedFile[(zeroAt + 1000) % decryptedFile.length],
    decryptedFile[(zeroAt + 2000) % decryptedFile.length],
    decryptedFile[(zeroAt + 3000) % decryptedFile.length],
  ]);
  const p1Answer = [
    decryptedFile[(zeroAt + 1000) % decryptedFile.length],
    decryptedFile[(zeroAt + 2000) % decryptedFile.length],
    decryptedFile[(zeroAt + 3000) % decryptedFile.length],
  ]
    .map(({ value }) => value)
    .reduce((a, b) => a + b);
  console.log(`p1 answer is ${p1Answer}`);

  part2(encryptedFile);
}
