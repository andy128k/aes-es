/**
 *  Counter object for CTR common mode of operation
 */
export class Counter {
  #counter: number[];

  constructor(initialValue: number | number[] = 1) {
    if (typeof initialValue === "number") {
      this.#counter = new Array(16);
      this.setValue(initialValue);
    } else {
      if (initialValue.length !== 16) {
        throw new Error("invalid counter bytes size (must be 16)");
      }
      this.#counter = initialValue.slice();
    }
  }

  bytes(): number[] {
    return this.#counter.slice();
  }

  setValue(value: number) {
    if (typeof value !== "number") {
      throw new Error("value must be a number");
    }

    for (let index = 15; index >= 0; --index) {
      this.#counter[index] = value % 256;
      value = value >> 8;
    }
  }

  increment() {
    for (let i = 15; i >= 0; i--) {
      const digit = this.#counter[i];
      if (digit === 255) {
        this.#counter[i] = 0;
      } else {
        this.#counter[i] = digit + 1;
        break;
      }
    }
  }
}
