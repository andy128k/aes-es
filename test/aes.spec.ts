import { describe, it, type TestContext } from "node:test";
import { createCipheriv, type Cipheriv } from "node:crypto";
import * as aes from "../src/index.ts";

function* repeat<T>(testCases: Iterable<T>, times: number = 5): Generator<T> {
  for (let round = 1; round <= times; ++round) {
    for (const testCase of testCases) {
      yield testCase;
    }
  }
}

describe("Compare with built-in implementation", () => {
  const randomByte = (): number => Math.floor(Math.random() * 256);

  const randomArray = (length: number): DataView => {
    const data = new DataView(new ArrayBuffer(length));
    for (let i = 0; i < length; i += 1) {
      data.setUint8(i, randomByte());
    }
    return data;
  };

  const encryptArray = (cipher: Cipheriv, plaintext: DataView): DataView => {
    let result = new Uint8Array(plaintext.byteLength);
    cipher.update(plaintext).copy(result);
    cipher.final().copy(result, result.length);
    return new DataView(result.buffer);
  };

  const KEY_SIZES = [128, 192, 256];

  describe("ECB mode", () => {
    it("encrypts and decrypts", (t: TestContext) => {
      for (const keySize of repeat(KEY_SIZES)) {
        const key = randomArray((keySize / 8) | 0);
        const plaintext = randomArray(16);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.ECB(key).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-ecb`, key, null), plaintext),
          encrypted,
          `key of size ${keySize}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.ECB(key).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(plaintext, decrypted, `key of size ${keySize}`);
      }
    });
  });

  describe("CFB mode", () => {
    it("encrypts and decrypts in CFB8 mode", (t: TestContext) => {
      for (const keySize of repeat(KEY_SIZES)) {
        const segmentSize = 1;

        const key = randomArray((keySize / 8) | 0);
        const iv = randomArray(16);
        const plaintext = randomArray(16);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.CFB(key, iv, segmentSize).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-cfb8`, key, iv), plaintext),
          encrypted,
          `key of size ${keySize}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.CFB(key, iv, segmentSize).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(plaintext, decrypted, `key of size ${keySize}`);
      }
    });

    it("encrypts and decrypts in CFB mode", (t: TestContext) => {
      for (const keySize of repeat(KEY_SIZES)) {
        const segmentSize = 16;

        const key = randomArray((keySize / 8) | 0);
        const iv = randomArray(16);
        const plaintext = randomArray(segmentSize);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.CFB(key, iv, segmentSize).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-cfb`, key, iv), plaintext),
          encrypted,
          `key of size ${keySize}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.CFB(key, iv, segmentSize).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(plaintext, decrypted, `key of size ${keySize}`);
      }
    });
  });

  describe("OFB mode", () => {
    it("encrypts and decrypts", (t: TestContext) => {
      for (const keySize of repeat(KEY_SIZES)) {
        const key = randomArray((keySize / 8) | 0);
        const iv = randomArray(16);
        const plaintext = randomArray(16);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.OFB(key, iv).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-ofb`, key, iv), plaintext),
          encrypted,
          `key of size ${keySize}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.OFB(key, iv).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(plaintext, decrypted, `key of size ${keySize}`);
      }
    });
  });

  describe("CBC mode", () => {
    it("encrypts and decrypts", (t: TestContext) => {
      for (const keySize of repeat(KEY_SIZES)) {
        const key = randomArray((keySize / 8) | 0);
        const iv = randomArray(16);
        const plaintext = randomArray(16);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.CBC(key, iv).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-cbc`, key, iv), plaintext),
          encrypted,
          `key of size ${keySize}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.CBC(key, iv).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(plaintext, decrypted, `key of size ${keySize}`);
      }
    });
  });

  describe("CTR mode", () => {
    const LENGTHS = [
      0, 1, 2, 3, 16, 127, 128, 129, 1500, 10000, 100000, 10001, 10002, 10003, 10004, 10005, 10006,
      10007, 10008,
    ];
    const ZERO = Array.from({ length: 16 }).map(() => 0);

    const testCases = () => {
      let cases = [];
      for (const keySize of KEY_SIZES) {
        for (const length of LENGTHS) {
          cases.push({ keySize, length });
        }
      }
      return cases;
    };

    it("encrypts and decrypts", (t: TestContext) => {
      for (const { keySize, length } of repeat(testCases())) {
        const key = randomArray((keySize / 8) | 0);
        const plaintext = randomArray(length);

        const encrypted = new DataView(new ArrayBuffer(plaintext.byteLength));
        new aes.CTR(key, 0n).encrypt(plaintext, encrypted);
        t.assert.deepStrictEqual(
          encryptArray(createCipheriv(`aes-${keySize}-ctr`, key, new Uint8Array(ZERO)), plaintext),
          encrypted,
          `key of size ${keySize} and length ${length}`,
        );

        const decrypted = new DataView(new ArrayBuffer(encrypted.byteLength));
        new aes.CTR(key, 0n).decrypt(encrypted, decrypted);
        t.assert.deepStrictEqual(
          plaintext,
          decrypted,
          `key of size ${keySize} and length ${length}`,
        );
      }
    });
  });
});
