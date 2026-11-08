import { AES } from "./aes.ts";
import type { Cipher } from "./types.ts";

// Shift the register
const shift = (register: DataView, data: DataView): void => {
  const newBytes = data.byteLength;
  const oldBytes = register.byteLength - newBytes;
  for (let i = 0; i < oldBytes; i += 1) {
    register.setUint8(i, register.getUint8(i + newBytes));
  }
  for (let i = 0; i < newBytes; i += 1) {
    register.setUint8(oldBytes + i, data.getUint8(i));
  }
};

/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
export class CFB implements Cipher {
  public name: string = "cfb";
  public description: string = "Cipher Feedback";

  #segmentSize: number;
  #shiftRegister: DataView;
  #aes: AES;

  constructor(key: DataView, iv?: DataView | undefined, segmentSize?: number | undefined) {
    if (iv && iv.byteLength !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }
    this.#segmentSize = segmentSize ?? 1;
    this.#shiftRegister = new DataView(iv ? iv.buffer.slice() : new ArrayBuffer(16));
    this.#aes = new AES(key);
  }

  encrypt(plaintext: DataView, result: DataView) {
    if (plaintext.byteLength % this.#segmentSize !== 0) {
      throw new Error(
        "plaintext must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }
    if (result.byteLength % this.#segmentSize !== 0) {
      throw new Error(
        "result must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }

    const xorSegment = new DataView(new ArrayBuffer(16));
    for (let i = 0; i < plaintext.byteLength; i += this.#segmentSize) {
      this.#aes.encrypt(this.#shiftRegister, xorSegment);
      for (let j = 0; j < this.#segmentSize; j++) {
        result.setUint8(i + j, plaintext.getUint8(i + j) ^ xorSegment.getUint8(j));
      }

      shift(
        this.#shiftRegister,
        new DataView(result.buffer, result.byteOffset + i, this.#segmentSize),
      );
    }
  }

  decrypt(ciphertext: DataView, result: DataView) {
    if (ciphertext.byteLength % this.#segmentSize !== 0) {
      throw new Error(
        "ciphertext must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }
    if (result.byteLength % this.#segmentSize !== 0) {
      throw new Error(
        "result must be a block of size module segmentSize (" + this.#segmentSize + ")",
      );
    }

    const xorSegment = new DataView(new ArrayBuffer(16));
    for (let i = 0; i < ciphertext.byteLength; i += this.#segmentSize) {
      this.#aes.encrypt(this.#shiftRegister, xorSegment);
      for (let j = 0; j < this.#segmentSize; j++) {
        result.setUint8(i + j, ciphertext.getUint8(i + j) ^ xorSegment.getUint8(j));
      }

      shift(
        this.#shiftRegister,
        new DataView(ciphertext.buffer, ciphertext.byteOffset + i, this.#segmentSize),
      );
    }
  }
}
