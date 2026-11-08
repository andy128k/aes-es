import { describe, it, type TestContext } from "node:test";
import { bigintToBytes } from "../src/ctr.ts";

describe("bigintToBytes", () => {
  it("converts number to bytes", (t: TestContext) => {
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(0n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(1n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(2n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(254n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(255n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(256n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(257n).buffer),
      Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(0xdeadbeefdeadbeefdeadbeefdeadbeefn).buffer),
      Uint8Array.of(
        0xde,
        0xad,
        0xbe,
        0xef,
        0xde,
        0xad,
        0xbe,
        0xef,
        0xde,
        0xad,
        0xbe,
        0xef,
        0xde,
        0xad,
        0xbe,
        0xef,
      ),
    );
    t.assert.deepStrictEqual(
      new Uint8Array(bigintToBytes(0xffffffffffffffffffffffffffffffffn).buffer),
      Uint8Array.of(255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255),
    );
  });
});
