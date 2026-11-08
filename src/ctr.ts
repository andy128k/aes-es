import { AES } from "./aes.ts";
import type { Cipher } from "./types.ts";

/**
 *  Mode Of Operation - Counter (CTR)
 */
export class CTR implements Cipher {
  public description: string = "Counter";
  public name: string = "ctr";

  #counter: bigint;
  #remainingCounter: DataView;
  #remainingCounterIndex: number;
  #aes: AES;

  constructor(key: DataView, counter?: bigint) {
    this.#counter = counter ?? 0n;
    this.#remainingCounter = new DataView(new ArrayBuffer(16));
    this.#remainingCounterIndex = 16;
    this.#aes = new AES(key);
  }

  encrypt(plaintext: DataView, result: DataView) {
    for (let i = 0; i < plaintext.byteLength; i++) {
      if (this.#remainingCounterIndex === 16) {
        this.#aes.encrypt(bigintToBytes(this.#counter), this.#remainingCounter);
        this.#remainingCounterIndex = 0;
        this.#counter += 1n;
      }
      result.setUint8(
        i,
        plaintext.getUint8(i) ^ this.#remainingCounter.getUint8(this.#remainingCounterIndex),
      );
      this.#remainingCounterIndex++;
    }
  }

  // Decryption is symmetric
  decrypt(ciphertext: DataView, result: DataView) {
    return this.encrypt(ciphertext, result);
  }
}

export const bigintToBytes = (value: bigint): DataView => {
  const counter = new DataView(new ArrayBuffer(16));
  for (let index = 15; index >= 0; --index) {
    counter.setUint8(index, Number(value % 256n));
    value = value >> 8n;
  }
  return counter;
};
