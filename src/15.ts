import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

const sensorPattern =
  /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

class RangeCoveredMap {
  rangesCovered: [number, number][] = [];

  addRange(start: number, end: number) {
    this.rangesCovered = [
      ...this.rangesCovered,
      [start, end] as [number, number],
    ]
      .sort(([startA, endA], [startB, endB]) =>
        startA - startB === 0 ? endA - endB : startA - startB
      )
      .reduce((arr: [number, number][], [start, end]) => {
        if (arr.length === 0) {
          return [[start, end]];
        }
        const [lastStart, lastEnd] = arr[arr.length - 1];
        if (start <= lastEnd) {
          arr[arr.length - 1] = [lastStart, Math.max(lastEnd, end)];
          return arr;
        }
        arr.push([start, end]);
        return arr;
      }, []);
  }

  covers(point: number) {
    return this.rangesCovered.some(
      ([start, end]) => start <= point && point <= end
    );
  }

  size(excludedPoints: number[]) {
    console.log(excludedPoints);
    let totalSize = this.rangesCovered
      .map(([start, end]) => end - start + 1)
      .reduce((a, b) => a + b, 0);

    for (const [start, end] of this.rangesCovered) {
      for (const p of excludedPoints) {
        if (start <= p && p <= end) {
          totalSize--;
        }
      }
    }
    return totalSize;
  }
}

const part1 = () => {
  const lines = fs.readFileSync("inputs/15.txt", "utf8").split("\n");

  const targetRow = 2000000;
  const rangesCovered = new RangeCoveredMap();
  const beacons: [number, number][] = [];

  for (const line of lines) {
    const m = sensorPattern.exec(line);
    const sensorX = parseInt(m[1]);
    const sensorY = parseInt(m[2]);
    const beaconX = parseInt(m[3]);
    const beaconY = parseInt(m[4]);
    beacons.push([beaconX, beaconY]);

    const manhattanDistance =
      Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

    if (
      sensorY + manhattanDistance >= targetRow &&
      sensorY - manhattanDistance <= targetRow
    ) {
      rangesCovered.addRange(
        sensorX - (manhattanDistance - Math.abs(sensorY - targetRow)),
        sensorX + (manhattanDistance - Math.abs(sensorY - targetRow))
      );
    }
  }

  console.log(
    rangesCovered.size(
      beacons
        .filter(([x, y]) => y === targetRow)
        .map(([x, y]) => x)
        .filter((x, i, arr) => arr.indexOf(x) === i)
    )
  );
};

const part2 = () => {
  const lines = fs.readFileSync("inputs/15.txt", "utf8").split("\n");
  const limit = 4000000;

  const sensors: [number, number][] = [];
  const beacons: [number, number][] = [];
  for (const line of lines) {
    const m = sensorPattern.exec(line);
    const sensorX = parseInt(m[1]);
    const sensorY = parseInt(m[2]);
    const beaconX = parseInt(m[3]);
    const beaconY = parseInt(m[4]);
    sensors.push([sensorX, sensorY]);
    beacons.push([beaconX, beaconY]);
  }

  for (const y of inclusiveRange(0, limit)) {
    const rangesCovered = new RangeCoveredMap();

    const pointsToTest = [];
    for (let i = 0; i < sensors.length; i++) {
      const [sensorX, sensorY] = sensors[i];
      const [beaconX, beaconY] = beacons[i];

      const manhattanDistance =
        Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

      if (
        sensorY + manhattanDistance >= y &&
        sensorY - manhattanDistance <= y
      ) {
        rangesCovered.addRange(
          sensorX - (manhattanDistance - Math.abs(sensorY - y)),
          sensorX + (manhattanDistance - Math.abs(sensorY - y))
        );
        pointsToTest.push(
          sensorX - (manhattanDistance - Math.abs(sensorY - y)) - 1
        );
        pointsToTest.push(
          sensorX + (manhattanDistance - Math.abs(sensorY - y)) + 1
        );
      }
    }

    for (const p of pointsToTest.filter(
      (p, i, arr) => p >= 0 && p <= limit && arr.indexOf(p) === i
    )) {
      if (!rangesCovered.covers(p)) {
        console.log(p, y);
        console.log(p * 4000000 + y);
      }
    }
  }
};

export function run15() {
  part1();
  part2();
}
