import * as fs from "fs";
import * as console from "console";
import { inclusiveRange } from "./utils";

const flowPattern =
  /Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? ((?:\w\w(?:, )?)+)/;

type FlowRateGraph = Record<string, { flowRate: number; leadsTo: string[] }>;
type SolutionStep = {
  flows: Record<string, number>;
  locations: string[];
};

function filterToBestSolutions(
  s: SolutionStep[],
  graph: FlowRateGraph
): SolutionStep[] {
  const locations = s
    .map(({ locations }) => locations.sort().join(","))
    .filter((loc, i, arr) => arr.indexOf(loc) === i);

  const allKey =
    "AA," +
    Object.entries(graph)
      .filter(([k, v]) => v.flowRate > 0)
      .map(([k, v]) => k)
      .sort()
      .join(",");
  const allKeySolutions: SolutionStep[] = [];

  const solutions = locations.flatMap((valveLocations) => {
    const solutionsAtLocation = s.filter(
      ({ locations }) => valveLocations === locations.sort().join(",")
    );
    const solutionsGroupedByActiveValves = solutionsAtLocation.reduce(
      (acc: Record<string, SolutionStep>, sol) => {
        const key = Object.keys(sol.flows)
          .sort((a, b) => a.localeCompare(b))
          .join(",");
        if (key === allKey) {
          allKeySolutions.push(sol);
          return acc;
        }
        if (!acc[key]) {
          acc[key] = sol;
        } else {
          if (
            Object.values(sol.flows).reduce((a, b) => a + b) >
            Object.values(acc[key].flows).reduce((a, b) => a + b)
          ) {
            acc[key] = sol;
          }
        }
        return acc;
      },
      {}
    );
    return Object.values(solutionsGroupedByActiveValves);
  });

  if (allKeySolutions.length > 0) {
    // Only need to keep the best all key solution
    solutions.push(
      allKeySolutions
        .map((sol): [number, SolutionStep] => [
          Object.values(sol.flows).reduce((a, b) => a + b),
          sol,
        ])
        .reduce(([aT, aSol], [bT, bSol]) =>
          aT > bT ? [aT, aSol] : [bT, bSol]
        )[1]
    );
  }

  return solutions;
}

const part1 = (graph: FlowRateGraph) => {
  // At minute Zero there is no flow at position AA
  const solutionsAtMinute: SolutionStep[][] = [
    [{ flows: { AA: 0 }, locations: ["AA"] }],
  ];
  for (const minute of inclusiveRange(1, 29)) {
    console.log(
      minute - 1,
      solutionsAtMinute.map((l) => l.length).reduce((a, b) => a + b)
    );
    solutionsAtMinute[minute] = solutionsAtMinute[minute - 1].flatMap(
      ({ flows, locations }) => {
        const newTotalFlows = Object.entries(flows).reduce(
          (acc: Record<string, number>, [valve, flow]) => {
            acc[valve] = flow + graph[valve].flowRate;
            return acc;
          },
          {}
        );
        let r: SolutionStep[] = [{ flows: newTotalFlows, locations: [] }];
        for (const location of locations) {
          const oldR = r;
          r = r.flatMap((s) =>
            graph[location].leadsTo.map((destination) => ({
              ...s,
              locations: [...s.locations, destination],
            }))
          );
          if (flows[location] === undefined && graph[location].flowRate > 0) {
            r.push(
              ...oldR.map((oldS) => ({
                flows: {
                  ...oldS.flows,
                  [location]: graph[location].flowRate,
                },
                locations: [...oldS.locations, location],
              }))
            );
          }
        }

        return r;
      }
    );
    solutionsAtMinute[minute] = filterToBestSolutions(
      solutionsAtMinute[minute],
      graph
    );
  }
  console.log(
    solutionsAtMinute[29]
      .map(({ flows }) => Object.values(flows).reduce((a, b) => a + b))
      .reduce((a, b) => (a > b ? a : b))
  );
};

const part2 = (graph: FlowRateGraph) => {
  // At minute Zero there is no flow at position AA
  const solutionsAtMinute: SolutionStep[][] = [
    [{ flows: { AA: 0 }, locations: ["AA", "AA"] }],
  ];
  const seenStates = new Set<string>();
  for (const minute of inclusiveRange(1, 25)) {
    solutionsAtMinute[0]
      .map((sol) => JSON.stringify(sol))
      .forEach((s) => seenStates.add(s));
    console.log(
      minute - 1,
      solutionsAtMinute.map((l) => l.length).reduce((a, b) => a + b)
    );
    solutionsAtMinute[minute] = solutionsAtMinute[minute - 1].flatMap(
      ({ flows, locations }) => {
        const newTotalFlows = Object.entries(flows).reduce(
          (acc: Record<string, number>, [valve, flow]) => {
            acc[valve] = flow + graph[valve].flowRate;
            return acc;
          },
          {}
        );
        let r: SolutionStep[] = [{ flows: newTotalFlows, locations: [] }];
        for (const location of locations) {
          const oldR = r;
          r = r.flatMap((s) =>
            graph[location].leadsTo.map((destination) => ({
              ...s,
              locations: [...s.locations, destination].sort(),
            }))
          );
          if (flows[location] === undefined && graph[location].flowRate > 0) {
            r.push(
              ...oldR.map((oldS) => ({
                flows: {
                  ...oldS.flows,
                  [location]: graph[location].flowRate,
                },
                locations: [...oldS.locations, location].sort(),
              }))
            );
          }
        }

        return r;
      }
    );
    solutionsAtMinute[minute] = filterToBestSolutions(
      solutionsAtMinute[minute],
      graph
    ).filter((sol) => !seenStates.has(JSON.stringify(sol)));
  }
  console.log(
    solutionsAtMinute[25]
      .map(({ flows }) => Object.values(flows).reduce((a, b) => a + b))
      .reduce((a, b) => (a > b ? a : b))
  );
};

export function run16() {
  const lines = fs.readFileSync("inputs/16.txt", "utf8").split("\n");

  const graph: FlowRateGraph = {};
  for (const line of lines) {
    const m = flowPattern.exec(line);
    graph[m[1]] = { flowRate: parseInt(m[2]), leadsTo: m[3].split(", ") };
  }
  console.log(graph);

  //part1(graph);
  part2(graph);
}
