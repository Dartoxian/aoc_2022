import * as fs from "fs";
import { inclusiveRange } from "./utils";
import * as console from "console";

type Packet = (number | Packet)[];

const maybePacketToPacket = (p: Packet | number): Packet =>
  typeof p === "number" ? [p] : p;

const packetEqual = (l: Packet, r: Packet): boolean => {
  if (l.length !== r.length) {
    return false;
  }
  for (const l1 of l) {
    for (const r1 of r) {
      if (typeof l1 === "number" && typeof r1 === "number") {
        if (l1 !== r1) {
          return false;
        }
      } else if (Array.isArray(l1) && Array.isArray(r1)) {
        if (!packetEqual(l1, r1)) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
};

const isPacketInRightOrder = (l: Packet, r: Packet): boolean | null => {
  for (let i = 0; i < l.length; i++) {
    if (i >= r.length) {
      return false;
    }
    if (typeof l[i] === "number" && typeof r[i] === "number") {
      if (l[i] < r[i]) {
        return true;
      }
      if (l[i] > r[i]) {
        return false;
      }
    } else {
      const subPacketInRightOrder = isPacketInRightOrder(
        maybePacketToPacket(l[i]),
        maybePacketToPacket(r[i])
      );
      if (subPacketInRightOrder !== null) {
        return subPacketInRightOrder;
      }
    }
  }
  if (l.length < r.length) {
    return true;
  }
  return null;
};

export function run13() {
  const lines = fs.readFileSync("inputs/13.txt", "utf8").split("\n");
  const pairsInRightOrder = [];
  const packets: Packet[] = [];
  let i = 0;
  while (i * 3 < lines.length) {
    const left: Packet = JSON.parse(lines[3 * i]);
    const right: Packet = JSON.parse(lines[3 * i + 1]);
    packets.push(left, right);
    const correctOrder = isPacketInRightOrder(left, right);
    if (correctOrder || correctOrder === null) {
      pairsInRightOrder.push(i + 1);
    }
    i++;
  }

  const p1Total = pairsInRightOrder.reduce((a, b) => a + b);
  console.log(`p1Total is ${p1Total}`);

  const sortedWithDecoders = [...packets, [[6]], [[2]]].sort((a, b) =>
    isPacketInRightOrder(a, b) ? -1 : 1
  );
  const decoderKey =
    (sortedWithDecoders.findIndex((p) => packetEqual(p, [[6]])) + 1) *
    (sortedWithDecoders.findIndex((p) => packetEqual(p, [[2]])) + 1);
  console.log(`The decoder key is ${decoderKey}`);
}
