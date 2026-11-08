import { AES } from "./aes.ts";
import type { Cipher } from "./types.ts";

/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
export class ECB implements Cipher {
  public name: string = "ecb";
  public description: string = "Electronic Code Block";

  #aes: AES;

  constructor(key: DataView) {
    this.#aes = new AES(key);
  }

  encrypt(plaintext: DataView, result: DataView) {
    this.#aes.encrypt(plaintext, result);
  }

  decrypt(ciphertext: DataView, result: DataView) {
    this.#aes.decrypt(ciphertext, result);
  }
}
