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
  type WeightedFlowRateGraph = Record<
    string,
    { flowRate: number; leadsTo: { destination: string; cost: number }[] }
  >;
  const weightedGraph: WeightedFlowRateGraph = {};
  for (const [valve, details] of Object.entries(graph)) {
    if (details.flowRate === 0 && valve !== "AA") {
      continue;
    }
    const leadsTo: { destination: string; cost: number }[] = [];
    const destinationCosts: Record<string, number> = details.leadsTo.reduce(
      (acc, d) => ({ ...acc, [d]: 1 }),
      {}
    );
    const explored = new Set<string>();
    explored.add(valve);
    const exploreQueue = [...details.leadsTo];
    while (exploreQueue.length > 0) {
      const d = exploreQueue.shift();
      if (explored.has(d)) {
        continue;
      }
      explored.add(d);
      if (graph[d].flowRate > 0) {
        leadsTo.push({ destination: d, cost: destinationCosts[d] });
      } else {
        for (const d2 of graph[d].leadsTo) {
          if (destinationCosts[d2] === undefined) {
            destinationCosts[d2] = destinationCosts[d] + 1;
            exploreQueue.push(d2);
          }
        }
      }
    }

    weightedGraph[valve] = {
      flowRate: details.flowRate,
      leadsTo,
    };
  }
  console.log(JSON.stringify(weightedGraph, undefined, 4));

  type WeightedSolutionStep = {
    flows: Record<string, number>;
    // s starts at, e ends at, t steps remaining
    workers: { s: string; e: string; t: number }[];
  };

  // At minute Zero there is no flow at position AA
  const solutionsAtMinute: WeightedSolutionStep[][] = [
    [
      {
        flows: { AA: 0 },
        workers: [
          { s: "AA", e: "AA", t: 0 },
          { s: "AA", e: "AA", t: 0 },
        ],
      },
    ],
  ];

  const solutionKey = (sol: WeightedSolutionStep): string => {
    return JSON.stringify({
      f: sol.flows,
      w: sol.workers.map(({ s, e, t }) => `s:${s},e:${e},t:${t}`).sort(),
    });
  };

  const removeDuplicatedWeightedSolutions = (
    solutions: WeightedSolutionStep[]
  ): WeightedSolutionStep[] => {
    const seenSolutions = new Set<string>();
    const keep: WeightedSolutionStep[] = [];
    for (const sol of solutions) {
      const k = solutionKey(sol);
      if (seenSolutions.has(k)) {
        continue;
      }
      seenSolutions.add(k);
      keep.push(sol);
    }
    return keep;
  };

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
      ({ flows, workers }) => {
        const newTotalFlows = Object.entries(flows).reduce(
          (acc: Record<string, number>, [valve, flow]) => {
            acc[valve] = flow + graph[valve].flowRate;
            return acc;
          },
          {}
        );
        let r: WeightedSolutionStep[] = [{ flows: newTotalFlows, workers: [] }];
        for (const oldWorker of workers) {
          if (oldWorker.t > 1) {
            // This worker is still travelling and there is nothing novel for it to do
            r.forEach((s) =>
              s.workers.push({ ...oldWorker, t: oldWorker.t - 1 })
            );
            continue;
          }
          // This worker is at a location, it can either move from there or open a valve
          const worker = { s: oldWorker.e, e: oldWorker.e, t: 0 };
          const oldR = r;
          r = r.flatMap((s) =>
            weightedGraph[worker.s].leadsTo.map((destination) => ({
              ...s,
              workers: [
                ...s.workers,
                { ...worker, e: destination.destination, t: destination.cost },
              ],
            }))
          );
          if (flows[worker.s] === undefined && graph[worker.s].flowRate > 0) {
            r.push(
              ...oldR
                .filter((oldS) => oldS.flows[worker.s] === undefined)
                .map((oldS) => ({
                  flows: {
                    ...oldS.flows,
                    [worker.s]: weightedGraph[worker.s].flowRate,
                  },
                  workers: [...oldS.workers, worker],
                }))
            );
          }
        }

        return r;
      }
    );
    solutionsAtMinute[minute] = removeDuplicatedWeightedSolutions(
      solutionsAtMinute[minute]
    );
    const scores: [WeightedSolutionStep, number][] = solutionsAtMinute[
      minute
    ].map((sol) => [sol, Object.values(sol.flows).reduce((a, b) => a + b)]);
    const highestScore = scores
      .map(([s, score]) => score)
      .reduce((a, b) => (a > b ? a : b));
    // discard bottom 70% of the scores
    solutionsAtMinute[minute] = scores
      .filter(([sol, score]) => score >= highestScore * 0.9 - 100)
      .map(([sol]) => sol);

    solutionsAtMinute[minute - 1] = [];
    const allOpen = solutionsAtMinute[minute].find((sol) =>
      Object.keys(weightedGraph).every((v) => sol.flows[v] || v === "AA")
    );
    if (allOpen) {
      console.log("ALL OPEN");
    }
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
