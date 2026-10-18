import { AES } from "./aes.ts";
import { copyIV } from "./iv.ts";

/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
export class OFB {
  public name: string = "ofb";
  public description: string = "Output Feedback";

  #lastPrecipher: number[];
  #lastPrecipherIndex: number;
  #aes: AES;

  constructor(key: number[], iv: number[]) {
    if (iv && iv.length !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }

    this.#lastPrecipher = copyIV(iv);
    this.#lastPrecipherIndex = 16;
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    for (let i = 0; i < plaintext.length; i++) {
      if (this.#lastPrecipherIndex === 16) {
        this.#aes.encrypt(this.#lastPrecipher, this.#lastPrecipher);
        this.#lastPrecipherIndex = 0;
      }
      result[i] = plaintext[i] ^ this.#lastPrecipher[this.#lastPrecipherIndex];
      this.#lastPrecipherIndex++;
    }
  }

  // Decryption is symetric
  decrypt(plaintext: number[], result: number[]) {
    return this.encrypt(plaintext, result);
  }
}
