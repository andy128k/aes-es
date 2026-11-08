import { AES } from "./aes.ts";
import type { Cipher } from "./types.ts";

/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
export class OFB implements Cipher {
  public name: string = "ofb";
  public description: string = "Output Feedback";

  #lastPrecipher: DataView;
  #lastPrecipherIndex: number;
  #aes: AES;

  constructor(key: DataView, iv?: DataView | undefined) {
    if (iv && iv.byteLength !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }

    this.#lastPrecipher = new DataView(iv ? iv.buffer.slice() : new ArrayBuffer(16));
    this.#lastPrecipherIndex = 16;
    this.#aes = new AES(key);
  }

  encrypt(plaintext: DataView, result: DataView) {
    for (let i = 0; i < plaintext.byteLength; i++) {
      if (this.#lastPrecipherIndex === 16) {
        this.#aes.encrypt(this.#lastPrecipher, this.#lastPrecipher);
        this.#lastPrecipherIndex = 0;
      }
      result.setUint8(
        i,
        plaintext.getUint8(i) ^ this.#lastPrecipher.getUint8(this.#lastPrecipherIndex),
      );
      this.#lastPrecipherIndex++;
    }
  }

  decrypt(ciphertext: DataView, result: DataView) {
    return this.encrypt(ciphertext, result);
  }
}
