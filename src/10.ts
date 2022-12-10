import * as fs from "fs";
import { inclusiveRange } from "./utils";

const noopPattern = /noop/;
const addXPattern = /addx (-?\d+)/;

export function run10() {
  const lines = fs.readFileSync("inputs/10.txt", "utf8").split("\n");

  let x = 1;
  let cycleCount = 0;
  const signalStrengths = [];
  const crt: string[][] = [...inclusiveRange(0, 6)].map(() => []);

  const incrementCycleCount = () => {
    cycleCount += 1;
    if ((cycleCount - 20) % 40 === 0) {
      signalStrengths.push(x * cycleCount);
    }
    const crtRow = Math.floor(cycleCount / 40) % 6;
    const pixelPosition = (cycleCount - 1) % 40;
    crt[crtRow][pixelPosition] =
      x - 1 <= pixelPosition && pixelPosition <= x + 1 ? "#" : ".";
  };

  for (let i = 0; i < lines.length; i++) {
    let m = noopPattern.exec(lines[i]);
    if (m) {
      incrementCycleCount();
    }
    m = addXPattern.exec(lines[i]);
    if (m) {
      incrementCycleCount();
      incrementCycleCount();
      x += parseInt(m[1]);
    }
  }

  const totalSignal = signalStrengths.reduce((a, b) => a + b);
  console.log(`The total signal strength is ${totalSignal}`);

  crt.forEach((row) => console.log(row.join("")));
}
