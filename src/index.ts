import { run01 } from "./01";
import { run02 } from "./02";
import { run03 } from "./03";
import { run04 } from "./04";
import { run05 } from "./05";
import { run06 } from "./06";
import { run07 } from "./07";

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
