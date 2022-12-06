import * as fs from "fs";


export function run06() {
  const lines = fs.readFileSync("inputs/06.txt", "utf8").split("\n");
  const line = lines[0];

  let i = 0;
  const moveToNextStartOfPacketMarker = () => {
    while (i < line.length && (i < 3 || new Set(line.slice(i - 4, i).split('')).size !== 4)) {
      i += 1
    }
  }

  moveToNextStartOfPacketMarker();
  console.log(`The first start of packet marker has been found at ${i}`)

  i = 0;
  const moveToNextStartOfMessageMarker = () => {
    while (i < line.length && (i < 13 || new Set(line.slice(i - 14, i).split('')).size !== 14)) {
      i += 1
    }
  }

  moveToNextStartOfMessageMarker();
  console.log(`The first start of message marker has been found at ${i}`)
}
