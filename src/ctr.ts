import { AES } from "./aes.ts";
import { Counter } from "./counter.ts";

/**
 *  Mode Of Operation - Counter (CTR)
 */
export class CTR {
  public description: string = "Counter";
  public name: string = "ctr";

  #counter: Counter;
  #remainingCounter: number[];
  #remainingCounterIndex: number;
  #aes: AES;

  constructor(key: number[], counter?: Counter) {
    this.#counter = counter || new Counter();
    this.#remainingCounter = new Array(16);
    this.#remainingCounterIndex = 16;
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    for (let i = 0; i < plaintext.length; i++) {
      if (this.#remainingCounterIndex === 16) {
        this.#aes.encrypt(this.#counter.bytes(), this.#remainingCounter);
        this.#remainingCounterIndex = 0;
        this.#counter.increment();
      }
      result[i] = plaintext[i] ^ this.#remainingCounter[this.#remainingCounterIndex];
      this.#remainingCounterIndex++;
    }
  }

  // Decryption is symetric
  decrypt(plaintext: number[], result: number[]) {
    return this.encrypt(plaintext, result);
  }
}
