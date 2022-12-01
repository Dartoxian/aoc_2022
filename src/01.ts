import * as fs from "fs";

export function run01() {
  const lines = fs.readFileSync("inputs/01.txt", "utf8").split("\n");
  const elfCalories = [];
  let currentElf = 0;
  for (const line of lines) {
    if (line.trim() === "") {
      elfCalories.push(currentElf);
      currentElf = 0;
      continue;
    }
    currentElf += parseInt(line.trim());
  }
  elfCalories.push(currentElf);

  const mostCalories = elfCalories.reduce((max, cur) =>
    max > cur ? max : cur
  );
  console.log(`The elf with the most calories has ${mostCalories}`);

  const top3MostCalories = elfCalories
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b);
  console.log(`The top three most calories are ${top3MostCalories}`);
}
