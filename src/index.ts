import { run01 } from "./01";
import { run02 } from "./02";
import { run03 } from "./03";
import { run04 } from "./04";
import { run05 } from "./05";
import { run06 } from "./06";
import { run07 } from "./07";
import { run08 } from "./08";
import { run09 } from "./09";
import { run10 } from "./10";
import { run11 } from "./11";
import { run12 } from "./12";
import { run13 } from "./13";
import { run14 } from "./14";

const port = parseInt(process.env.PORT || "42069");
if (isNaN(port)) {
  throw new Error(`Cannot parse port -p ${process.env.PORT}`);
}

const solutions: Record<string, (port: number) => void> = {
  "01": run01,
  "02": run02,
  "03": run03,
  "04": run04,
  "05": run05,
  "06": run06,
  "07": run07,
  "08": run08,
  "09": run09,
  "10": run10,
  "11": run11,
  "12": run12,
  "13": run13,
  "14": run14,
};

const arg = process.argv[2];

if (solutions[arg]) {
  solutions[arg](port);
} else {
  console.error(
    `No solution specified (got arg ${arg}), usage: yarn run dev -- <${Object.keys(
      solutions
    ).join(", ")}>`
  );
}
