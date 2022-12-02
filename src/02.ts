import * as fs from "fs";

enum Hand {
  Rock,
  Paper,
  Scissors,
}

function getP2Points(p1: Hand, p2: Hand): number {
  if (p1 === p2) {
    return 3 + p2.valueOf() + 1;
  }
  if (
    (p1 === Hand.Paper && p2 === Hand.Scissors) ||
    (p1 === Hand.Rock && p2 === Hand.Paper) ||
    (p1 === Hand.Scissors && p2 === Hand.Rock)
  ) {
    return 6 + p2.valueOf() + 1;
  }
  return 0 + p2.valueOf() + 1;
}

function lookupP1(symbol: string) {
  switch (symbol) {
    case "A":
      return Hand.Rock;
    case "B":
      return Hand.Paper;
    case "C":
      return Hand.Scissors;
    default:
      throw new Error(`Can't handle input ${symbol}`);
  }
}
function lookupP2(symbol: string) {
  switch (symbol) {
    case "X":
      return Hand.Rock;
    case "Y":
      return Hand.Paper;
    case "Z":
      return Hand.Scissors;
    default:
      throw new Error(`Can't handle input ${symbol}`);
  }
}

function determineP2HandWithOutcome(p1Hand: Hand, p2Outcome: string): Hand {
  switch (p2Outcome) {
    case "X":
      switch (p1Hand) {
        case Hand.Paper:
          return Hand.Rock;
        case Hand.Rock:
          return Hand.Scissors;
        case Hand.Scissors:
          return Hand.Paper;
      }
    case "Y":
      return p1Hand;
    case "Z":
      switch (p1Hand) {
        case Hand.Paper:
          return Hand.Scissors;
        case Hand.Rock:
          return Hand.Paper;
        case Hand.Scissors:
          return Hand.Rock;
      }
  }
}

export function run02() {
  const lines = fs.readFileSync("inputs/02.txt", "utf8").split("\n");
  const games = lines.map((line) => {
    const [p1Symbol, _ignore, p2Symbol] = line.split("");
    return [lookupP1(p1Symbol), lookupP2(p2Symbol)];
  });

  const part1Score = games
    .map(([p1, p2]) => getP2Points(p1, p2))
    .reduce((a, b) => a + b);

  console.log(`The score on part 1 is ${part1Score}`);

  const part2Games = lines.map((line) => {
    const [p1Symbol, _ignore, p2Symbol] = line.split("");
    const p1Hand = lookupP1(p1Symbol);
    const p2Hand = determineP2HandWithOutcome(p1Hand, p2Symbol);
    return [p1Hand, p2Hand];
  });

  const part2Score = part2Games
    .map(([p1, p2]) => getP2Points(p1, p2))
    .reduce((a, b) => a + b);

  console.log(`The score on part 2 is ${part2Score}`);
}
