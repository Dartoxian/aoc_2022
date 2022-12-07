import * as fs from "fs";

const cdPattern = /\$ cd (\w+)/;
const dirPattern = /dir (\w+)/;
const filePattern = /(\d+) ([\w.]+)/;

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  files: File[];
  parent: Directory | null;
  subdirectories: Directory[];
};

export function run07() {
  const lines = fs.readFileSync("inputs/07.txt", "utf8").split("\n");

  const filesystem: Directory = {
    name: "/",
    files: [],
    parent: null,
    subdirectories: [],
  };

  // Skip the first line as it's always cd /
  let i = 1;
  let currentDirectory = filesystem;
  while (i < lines.length) {
    const line = lines[i];
    i++;
    if (line === "$ ls") {
      continue;
    }
    if (line === "$ cd ..") {
      currentDirectory = currentDirectory.parent;
      continue;
    }
    const matchCd = cdPattern.exec(line);
    if (matchCd) {
      const subName = currentDirectory.name + "/" + matchCd[1];
      currentDirectory = currentDirectory.subdirectories.find(
        ({ name }) => name === subName
      );
      continue;
    }
    const matchDir = dirPattern.exec(line);
    if (matchDir) {
      const directory = currentDirectory.name + "/" + matchDir[1];
      if (
        !currentDirectory.subdirectories.some(({ name }) => name === directory)
      ) {
        currentDirectory.subdirectories.push({
          name: directory,
          files: [],
          parent: currentDirectory,
          subdirectories: [],
        });
      }
      continue;
    }
    const matchFile = filePattern.exec(line);
    if (matchFile) {
      const size = parseInt(matchFile[1]);
      const filename = currentDirectory.name + "/" + matchFile[2];
      if (!currentDirectory.files.some(({ name }) => name === filename)) {
        currentDirectory.files.push({
          name: filename,
          size,
        });
      }
      continue;
    }
    throw new Error(`Cannot parse ${line}`);
  }

  const directorySizeCache: Record<string, number> = {};
  const totalSizeDirectory = (directory: Directory): number => {
    if (directorySizeCache[directory.name] !== undefined) {
      return directorySizeCache[directory.name];
    }
    let total = 0;
    total += directory.files.map(({ size }) => size).reduce((a, b) => a + b, 0);
    total += directory.subdirectories
      .map(totalSizeDirectory)
      .reduce((a, b) => a + b, 0);
    directorySizeCache[directory.name] = total;
    return total;
  };

  const totalSize = totalSizeDirectory(filesystem);
  const sumPart1 = Object.values(directorySizeCache)
    .filter((size) => size <= 100000)
    .reduce((a, b) => a + b);

  console.log(`The part 1 sum is ${sumPart1}`);

  const freeSpace = 70000000 - totalSize;
  const freeSpaceRequired = 30000000 - freeSpace;
  const part2 = Object.values(directorySizeCache)
    .filter((size) => size >= freeSpaceRequired)
    .reduce((a, b) => Math.min(a, b));

  console.log(`The smallest directory to delete has size ${part2}`);
}
