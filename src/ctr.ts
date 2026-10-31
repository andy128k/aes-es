import { AES } from "./aes.ts";

/**
 *  Mode Of Operation - Counter (CTR)
 */
export class CTR {
  public description: string = "Counter";
  public name: string = "ctr";

  #counter: bigint;
  #remainingCounter: number[];
  #remainingCounterIndex: number;
  #aes: AES;

  constructor(key: number[], counter?: bigint) {
    this.#counter = counter ?? 0n;
    this.#remainingCounter = new Array(16);
    this.#remainingCounterIndex = 16;
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    for (let i = 0; i < plaintext.length; i++) {
      if (this.#remainingCounterIndex === 16) {
        this.#aes.encrypt(bigintToBytes(this.#counter), this.#remainingCounter);
        this.#remainingCounterIndex = 0;
        this.#counter += 1n;
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

export const bigintToBytes = (value: bigint): number[] => {
  const counter = Array(16);
  for (let index = 15; index >= 0; --index) {
    counter[index] = Number(value % 256n);
    value = value >> 8n;
  }
  return counter;
};
