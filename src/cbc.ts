import { AES } from "./aes.ts";
import type { Cipher } from "./types.ts";

function xorBlocks(result: DataView, first: DataView, second: DataView) {
  for (let i = 0; i < result.byteLength; i += 4) {
    result.setUint32(i, first.getUint32(i) ^ second.getUint32(i));
  }
}

function copyBlock(target: DataView, source: DataView) {
  for (let i = 0; i < target.byteLength; i += 4) {
    target.setUint32(i, source.getUint32(i));
  }
}

/**
 *  Mode Of Operation - Cipher Block Chaining (CBC)
 */
export class CBC implements Cipher {
  public name: string = "cbc";
  public description: string = "Cipher Block Chaining";

  #lastCipherBlock: DataView;
  #aes: AES;

  constructor(key: DataView, iv?: DataView | undefined) {
    if (iv && iv.byteLength !== 16) {
      throw new Error("initialation vector iv must be of length 16");
    }
    this.#lastCipherBlock = new DataView(iv ? iv.buffer.slice() : new ArrayBuffer(16));
    this.#aes = new AES(key);
  }

  encrypt(plaintext: DataView, result: DataView) {
    if (plaintext.byteLength !== 16) {
      throw new Error("plaintext must be a block of size 16");
    }
    if (result.byteLength !== 16) {
      throw new Error("result must be a block of size 16");
    }

    xorBlocks(result, this.#lastCipherBlock, plaintext);
    this.#aes.encrypt(result, this.#lastCipherBlock);
    copyBlock(result, this.#lastCipherBlock);
  }

  decrypt(ciphertext: DataView, result: DataView) {
    if (ciphertext.byteLength !== 16) {
      throw new Error("ciphertext must be a block of size 16");
    }
    if (result.byteLength !== 16) {
      throw new Error("result must be a block of size 16");
    }

    this.#aes.decrypt(ciphertext, result);
    xorBlocks(result, result, this.#lastCipherBlock);
    copyBlock(this.#lastCipherBlock, ciphertext);
  }
}
