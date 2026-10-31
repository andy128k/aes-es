import { describe, it, type TestContext } from "node:test";
import { bigintToBytes } from "../src/ctr.ts";

describe("bigintToBytes", () => {
  it("converts number to bytes", (t: TestContext) => {
    t.assert.deepStrictEqual(bigintToBytes(0n), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    t.assert.deepStrictEqual(bigintToBytes(1n), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
    t.assert.deepStrictEqual(bigintToBytes(2n), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
    t.assert.deepStrictEqual(
      bigintToBytes(254n),
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254],
    );
    t.assert.deepStrictEqual(
      bigintToBytes(255n),
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    );
    t.assert.deepStrictEqual(bigintToBytes(256n), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
    t.assert.deepStrictEqual(bigintToBytes(257n), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]);
    t.assert.deepStrictEqual(
      bigintToBytes(0xdeadbeefdeadbeefdeadbeefdeadbeefn),
      [
        0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe,
        0xef,
      ],
    );
    t.assert.deepStrictEqual(
      bigintToBytes(0xffffffffffffffffffffffffffffffffn),
      [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
    );
  });
});
