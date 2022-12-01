export function assertNotNull<T>(v: T | null | undefined): asserts v is T{
  if (v === null || v === undefined) {
    throw new Error(`${v} is not the right type`);
  }
}

export function assertNumber(v: number | null | undefined): asserts v is number {
  if (typeof v !== 'number') {
    throw new Error(`${v} is not a number`);
  }
}

export function assertEqual<T>(v: T, t: T) {
  if (v !== t) {
    throw new Error(`${v} does not equal ${t}`);
  }
}
