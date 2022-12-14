export function assertNotNull<T>(v: T | null | undefined): asserts v is T {
  if (v === null || v === undefined) {
    throw new Error(`${v} is not the right type`);
  }
}

export function assertNumber(
  v: number | null | undefined
): asserts v is number {
  if (typeof v !== "number") {
    throw new Error(`${v} is not a number`);
  }
}

export function assertEqual<T>(v: T, t: T) {
  if (v !== t) {
    throw new Error(`${v} does not equal ${t}`);
  }
}

export function group<T>(items: T[], groupSize: number): T[][] {
  const r = [[]];
  items.forEach((item) => {
    if (r[r.length - 1].length === groupSize) {
      r.push([]);
    }
    r[r.length - 1].push(item);
  });
  return r;
}

export function* inclusiveRange(
  start: number,
  end: number,
  interval: number = 1
) {
  for (let i = Math.min(start, end); i <= Math.max(start, end); i += interval) {
    yield i;
  }
}
