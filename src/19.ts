import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

const blueprintPattern =
  /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;

type Resources = {
  ore: number;
  clay: number;
  obsidian: number;
  openGeodes: number;
  clayRobots: number;
  oreRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
};

type Blueprint = {
  id: number;
  oreRobotOreCost: number;
  clayRobotOreCost: number;
  obsidianRobotOreCost: number;
  obsidianRobotClayCost: number;
  geodeRobotOreCost: number;
  geodeRobotObsidianCost: number;
};

function* allNextReources(r: Resources, b: Blueprint): Generator<Resources> {
  const nextOres: Resources = {
    ...r,
    ore: r.ore + r.oreRobots,
    clay: r.clay + r.clayRobots,
    obsidian: r.obsidian + r.obsidianRobots,
    openGeodes: r.openGeodes + r.geodeRobots,
  };
  let didBuildRobot = false;
  if (r.ore >= b.clayRobotOreCost) {
    didBuildRobot = true;
    yield {
      ...nextOres,
      ore: nextOres.ore - b.clayRobotOreCost,
      clayRobots: r.clayRobots + 1,
    };
  }
  if (r.ore >= b.oreRobotOreCost) {
    didBuildRobot = true;
    yield {
      ...nextOres,
      ore: nextOres.ore - b.oreRobotOreCost,
      oreRobots: r.oreRobots + 1,
    };
  }
  if (r.ore >= b.obsidianRobotOreCost && r.clay >= b.obsidianRobotClayCost) {
    didBuildRobot = true;
    yield {
      ...nextOres,
      ore: nextOres.ore - b.obsidianRobotOreCost,
      clay: nextOres.clay - b.obsidianRobotClayCost,
      obsidianRobots: r.obsidianRobots + 1,
    };
  }
  if (r.ore >= b.geodeRobotOreCost && r.obsidian >= b.geodeRobotObsidianCost) {
    didBuildRobot = true;
    yield {
      ...nextOres,
      ore: nextOres.ore - b.geodeRobotOreCost,
      obsidian: nextOres.obsidian - b.geodeRobotObsidianCost,
      geodeRobots: r.geodeRobots + 1,
    };
  }
  yield nextOres;
}

const bestPossibleScore = (r: Resources, minutesRemaining: number): number => {
  return (
    r.openGeodes +
    r.geodeRobots * minutesRemaining +
    (0.5 * minutesRemaining * (minutesRemaining + 1)) / (r.obsidianRobots || 1)
  );
};

const part1 = (blueprints: Blueprint[]) => {
  const qualityLevels: number[] = [];
  for (const blueprint of blueprints) {
    let possibleResources: Resources[] = [
      {
        clay: 0,
        ore: 0,
        obsidian: 0,
        openGeodes: 0,
        clayRobots: 0,
        geodeRobots: 0,
        obsidianRobots: 0,
        oreRobots: 1,
      },
    ];
    for (const minute of inclusiveRange(1, 24)) {
      console.log(
        `Minute ${minute - 1} had ${possibleResources.length} options`
      );
      possibleResources = possibleResources.flatMap((r) => [
        ...allNextReources(r, blueprint),
      ]);

      const seenConfigs = new Set<string>();
      possibleResources = possibleResources.filter((r) => {
        const key = JSON.stringify(r);
        if (seenConfigs.has(key)) {
          return false;
        } else {
          seenConfigs.add(key);
          return true;
        }
      });

      const bestTotalGeodesSoFar = possibleResources
        .map((r) => r.openGeodes + r.geodeRobots * (24 - minute))
        .reduce((a, b) => (a > b ? a : b));
      possibleResources = possibleResources.filter(
        (r) => bestPossibleScore(r, 24 - minute) >= bestTotalGeodesSoFar
      );
    }
    const mostGeodes = possibleResources
      .map(({ openGeodes }) => openGeodes)
      .reduce((a, b) => (a > b ? a : b));
    console.log(
      `The most geodes for blueprint ${blueprint.id} is ${mostGeodes}`
    );
    qualityLevels.push(mostGeodes * blueprint.id);
  }

  console.log(
    `Total quality levels are ${qualityLevels.reduce((a, b) => a + b)}`
  );
};

const part2 = (blueprints: Blueprint[]) => {
  const qualityLevels: number[] = [];
  for (const blueprint of blueprints.slice(3)) {
    let possibleResources: Resources[] = [
      {
        clay: 0,
        ore: 0,
        obsidian: 0,
        openGeodes: 0,
        clayRobots: 0,
        geodeRobots: 0,
        obsidianRobots: 0,
        oreRobots: 1,
      },
    ];
    for (const minute of inclusiveRange(1, 32)) {
      console.log(
        `Minute ${minute - 1} had ${possibleResources.length} options`
      );
      possibleResources = possibleResources.flatMap((r) => [
        ...allNextReources(r, blueprint),
      ]);

      const seenConfigs = new Set<string>();
      possibleResources = possibleResources.filter((r) => {
        const key = JSON.stringify(r);
        if (seenConfigs.has(key)) {
          return false;
        } else {
          seenConfigs.add(key);
          return true;
        }
      });

      const bestTotalGeodesSoFar = possibleResources
        .map((r) => r.openGeodes + r.geodeRobots * (32 - minute))
        .reduce((a, b) => (a > b ? a : b));
      possibleResources = possibleResources.filter(
        (r) => bestPossibleScore(r, 32 - minute) >= bestTotalGeodesSoFar
      );
    }
    const mostGeodes = possibleResources
      .map(({ openGeodes }) => openGeodes)
      .reduce((a, b) => (a > b ? a : b));
    console.log(
      `The most geodes for blueprint ${blueprint.id} is ${mostGeodes}`
    );
    qualityLevels.push(mostGeodes);
  }

  console.log(
    `Total quality levels are ${qualityLevels.reduce((a, b) => a * b)}`
  );
};

export function run19() {
  const lines = fs.readFileSync("inputs/19.txt", "utf8").split("\n");
  const blueprints: Blueprint[] = [];
  for (const line of lines) {
    const m = blueprintPattern.exec(line);
    blueprints.push({
      id: parseInt(m[1]),
      oreRobotOreCost: parseInt(m[2]),
      clayRobotOreCost: parseInt(m[3]),
      obsidianRobotOreCost: parseInt(m[4]),
      obsidianRobotClayCost: parseInt(m[5]),
      geodeRobotOreCost: parseInt(m[6]),
      geodeRobotObsidianCost: parseInt(m[7]),
    });
  }

  //part1(blueprints);
  part2(blueprints);
}
