import { AES } from "./aes.ts";

/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
export class ECB {
  public name: string = "ecb";
  public description: string = "Electronic Code Block";

  #aes: AES;

  constructor(key: number[]) {
    this.#aes = new AES(key);
  }

  encrypt(plaintext: number[], result: number[]) {
    this.#aes.encrypt(plaintext, result);
  }

  decrypt(ciphertext: number[], result: number[]) {
    this.#aes.decrypt(ciphertext, result);
  }
}
