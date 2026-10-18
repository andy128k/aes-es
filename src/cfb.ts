import { AES } from "./aes.ts";
import { copyIV } from "./iv.ts";

/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
export class CFB {
  public name: string = "cfb";
  public description: string = "Cipher Feedback";

  #segmentSize: number;
  #shiftRegister: number[];
  #aes: AES;

  constructor(key: number[], iv: number[], segmentSize: number) {
    if (iv && iv.length !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }
    this.#segmentSize = segmentSize || 1;
    this.#shiftRegister = copyIV(iv);
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    if (plaintext.length % this.#segmentSize !== 0) {
      throw new Error(
        "plaintext must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }
    if (result.length % this.#segmentSize !== 0) {
      throw new Error(
        "result must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }

    const xorSegment = new Array(16);
    for (let i = 0; i < plaintext.length; i += this.#segmentSize) {
      this.#aes.encrypt(this.#shiftRegister, xorSegment);
      for (let j = 0; j < this.#segmentSize; j++) {
        result[i + j] = plaintext[i + j] ^ xorSegment[j];
      }

      // Shift the register
      this.#shiftRegister.splice(0, this.#segmentSize);
      for (let j = 0; j < this.#segmentSize; ++j) {
        this.#shiftRegister.push(result[i + j]);
      }
    }
  }

  decrypt(ciphertext: number[], result: number[]) {
    if (ciphertext.length % this.#segmentSize !== 0) {
      throw new Error(
        "ciphertext must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }
    if (result.length % this.#segmentSize !== 0) {
      throw new Error(
        "result must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }

    const xorSegment = new Array(16);
    for (let i = 0; i < ciphertext.length; i += this.#segmentSize) {
      this.#aes.encrypt(this.#shiftRegister, xorSegment);
      for (let j = 0; j < this.#segmentSize; j++) {
        result[i + j] = ciphertext[i + j] ^ xorSegment[j];
      }

      // Shift the register
      this.#shiftRegister.splice(0, this.#segmentSize);
      for (let j = 0; j < this.#segmentSize; ++j) {
        this.#shiftRegister.push(ciphertext[i + j]);
      }
    }
  }
}
