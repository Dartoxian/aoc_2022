import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

class Cube {
  readonly x: number;
  readonly y: number;
  readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  key() {
    return `${this.x},${this.y},${this.z}`;
  }

  touches(other: Cube): boolean {
    return (
      (this.x === other.x &&
        this.y === other.y &&
        Math.abs(other.z - this.z) === 1) ||
      (this.y === other.y &&
        this.z === other.z &&
        Math.abs(other.x - this.x) === 1) ||
      (this.z === other.z &&
        this.x === other.x &&
        Math.abs(other.y - this.y) === 1)
    );
  }

  *neightbours() {
    for (const dx of inclusiveRange(-1, 1)) {
      for (const dy of inclusiveRange(-1, 1)) {
        for (const dz of inclusiveRange(-1, 1)) {
          if (dx === 0 && dy === 0 && dz === 0) {
            continue;
          }
          yield new Cube(this.x + dx, this.y + dy, this.z + dz);
        }
      }
    }
  }
}

export function run18() {
  const lines = fs.readFileSync("inputs/18.txt", "utf8").split("\n");
  const lavaCubes: Cube[] = [];
  for (const line of lines) {
    const [x, y, z] = line.split(",").map((c) => parseInt(c));
    lavaCubes.push(new Cube(x, y, z));
  }

  let visibleFaces = 0;
  for (const cube of lavaCubes) {
    visibleFaces += 6 - lavaCubes.filter((other) => cube.touches(other)).length;
  }
  console.log(`There are ${visibleFaces} visible faces.`);

  // Starting from some arbitrary cube, lets explore all of the faces on that surface
  const lavaCubeSet = new Set<string>(lavaCubes.map((lc) => lc.key()));
  const allAirCubes = lavaCubes
    .flatMap((lc) => [...lc.neightbours()])
    .filter((lc) => !lavaCubeSet.has(lc.key()))
    .filter(
      (lc, i, arr) => i === arr.findIndex((olc) => olc.key() === lc.key())
    );
  const allAirCubeSet = new Set<string>(allAirCubes.map((ac) => ac.key()));
  console.log(
    `There are ${lavaCubeSet.size} lava cubes, and ${allAirCubes.length} air cubes around them`
  );

  const exploredCubes = new Set<string>();
  while (allAirCubeSet.size > 0) {
    const unexploredCubes: Cube[] = [
      allAirCubes.find((c) => allAirCubeSet.has(c.key())),
    ];
    let lavaFacesCovered = 0;
    while (unexploredCubes.length > 0) {
      const airCube = unexploredCubes.pop();
      if (exploredCubes.has(airCube.key())) {
        continue;
      }
      for (const neighbor of airCube.neightbours()) {
        if (
          exploredCubes.has(neighbor.key()) ||
          !(
            allAirCubeSet.has(neighbor.key()) || lavaCubeSet.has(neighbor.key())
          )
        ) {
          continue;
        }
        if (lavaCubeSet.has(neighbor.key()) && airCube.touches(neighbor)) {
          lavaFacesCovered++;
          continue;
        }
        if (lavaCubeSet.has(neighbor.key())) {
          continue;
        }
        if (airCube.touches(neighbor)) {
          unexploredCubes.push(neighbor);
        }
      }
      exploredCubes.add(airCube.key());
    }
    console.log(`There are ${lavaFacesCovered} external faces covered`);
    exploredCubes.forEach((k) => allAirCubeSet.delete(k));
  }
}
