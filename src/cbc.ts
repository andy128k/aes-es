import { AES } from "./aes.ts";
import { copyIV } from "./iv.ts";

function xorBlocks(result: number[], first: number[], second: number[]) {
  for (let i = 0; i < result.length; i++) {
    result[i] = first[i] ^ second[i];
  }
}

/**
 *  Mode Of Operation - Cipher Block Chaining (CBC)
 */
export class CBC {
  public name: string = "cbc";
  public description: string = "Cipher Block Chaining";

  #lastCipherblock: number[];
  #aes: AES;

  constructor(key: number[], iv: number[]) {
    if (iv && iv.length !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }
    this.#lastCipherblock = copyIV(iv);
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    if (plaintext.length !== 16) {
      throw new Error("plaintext must be a block of size 16");
    }
    if (result.length !== 16) {
      throw new Error("result must be a block of size 16");
    }

    xorBlocks(result, this.#lastCipherblock, plaintext);
    this.#aes.encrypt(result, result);
    this.#lastCipherblock = result.slice();
  }

  decrypt(ciphertext: number[], result: number[]) {
    if (ciphertext.length !== 16) {
      throw new Error("ciphertext must be a block of size 16");
    }
    if (result.length !== 16) {
      throw new Error("result must be a block of size 16");
    }

    this.#aes.decrypt(ciphertext, result);
    xorBlocks(result, result, this.#lastCipherblock);
    this.#lastCipherblock = ciphertext.slice();
  }
}
