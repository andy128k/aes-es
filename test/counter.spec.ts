import { describe, it, type TestContext } from "node:test";
import { Counter } from "../src/index.ts";

function hex(data: string): number[] {
  const block = new Array(data.length / 2);
  for (let i = 0; i < data.length; i += 2) {
    block[i / 2] = parseInt(data.substring(i, i + 2), 16);
  }
  return block;
}

describe("Counter", () => {
  it("can be created from a number", (t: TestContext) => {
    const testCases: [number, number[]][] = [
      [0, hex("00000000000000000000000000000001")],
      [1, hex("00000000000000000000000000000002")],
      [254, hex("000000000000000000000000000000ff")],
      [255, hex("00000000000000000000000000000100")],
      [256, hex("00000000000000000000000000000101")],
    ];
    for (const [number, expected] of testCases) {
      let counter = new Counter(number);
      counter.increment();
      t.assert.deepStrictEqual(counter.bytes(), expected);

      counter.setValue(number);
      counter.increment();
      t.assert.deepStrictEqual(counter.bytes(), expected);

      counter = new Counter();
      counter.setValue(number);
      counter.increment();
      t.assert.deepStrictEqual(counter.bytes(), expected);
    }
  });

  it("can be created from bytes", (t: TestContext) => {
    for (const [bytes, expected] of [
      [hex("00000000000000000000000000000000"), hex("00000000000000000000000000000001")],
      [hex("000000000000000000000000000000ff"), hex("00000000000000000000000000000100")],
      [hex("ffffffffffffffffffffffffffffffff"), hex("00000000000000000000000000000000")],
      [hex("deadbeefdeadbeefdeadbeefdeadbeef"), hex("deadbeefdeadbeefdeadbeefdeadbef0")],
    ]) {
      let counter = new Counter(bytes);
      counter.increment();
      t.assert.deepStrictEqual(counter.bytes(), expected);
    }
  });
});
