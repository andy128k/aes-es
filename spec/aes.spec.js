const { createCipheriv } = require('node:crypto');
const aes = require('..');

const ROUNDS = [1, 2, 3, 4, 5];

describe.each(ROUNDS)('Compare with built-in implementation (Round %i)', () => {
  const randomByte = () => Math.floor(Math.random() * 256);
  const randomArray = (length) => Array.from({ length }).map(randomByte);

  const encryptArray = (cipher, plaintext) => {
    let result = new Uint8Array(plaintext.length);
    cipher.update(Buffer.from(plaintext)).copy(result);
    cipher.final().copy(result, result.length);
    return [...result];
  };

  const KEY_SIZES = [128, 192, 256];

  describe('ECB mode', () => {
    it.each(KEY_SIZES)('encrypts and decrypts with a key of size %i', (keySize) => {
      const key = randomArray(keySize / 8 | 0);
      const plaintext = randomArray(16);

      const encrypted = new Array(plaintext.length);
      new aes.ECB(key).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-ecb`, Buffer.from(key), null), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.ECB(key).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });
  });

  describe('CFB mode', () => {
    it.each(KEY_SIZES)('encrypts and decrypts with a key of size %i in CFB8 mode', (keySize) => {
      const segmentSize = 1;

      const key = randomArray(keySize / 8 | 0);
      const iv = randomArray(16);
      const plaintext = randomArray(16);

      const encrypted = new Array(plaintext.length);
      new aes.CFB(key, iv, segmentSize).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-cfb8`, Buffer.from(key), Buffer.from(iv)), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.CFB(key, iv, segmentSize).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });

    it.each(KEY_SIZES)('encrypts and decrypts with a key of size %i in CFB mode', (keySize) => {
      const segmentSize = 16;

      const key = randomArray(keySize / 8 | 0);
      const iv = randomArray(16);
      const plaintext = randomArray(segmentSize);

      const encrypted = new Array(plaintext.length);
      new aes.CFB(key, iv, segmentSize).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-cfb`, Buffer.from(key), Buffer.from(iv)), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.CFB(key, iv, segmentSize).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });
  });

  describe('OFB mode', () => {
    it.each(KEY_SIZES)('encrypts and decrypts with a key of size %i', (keySize) => {
      const key = randomArray(keySize / 8 | 0);
      const iv = randomArray(16);
      const plaintext = randomArray(16);

      const encrypted = new Array(plaintext.length);
      new aes.OFB(key, iv).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-ofb`, Buffer.from(key), Buffer.from(iv)), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.OFB(key, iv).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });
  });

  describe('CBC mode', () => {
    it.each(KEY_SIZES)('encrypts and decrypts with a key of size %i', (keySize) => {
      const key = randomArray(keySize / 8 | 0);
      const iv = randomArray(16);
      const plaintext = randomArray(16);

      const encrypted = new Array(plaintext.length);
      new aes.CBC(key, iv).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-cbc`, Buffer.from(key), Buffer.from(iv)), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.CBC(key, iv).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });
  });

  describe('CTR mode', () => {
    const LENGTHS = [0, 1, 2, 3, 16, 127, 128, 129, 1500, 10000, 100000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008];
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

    it.each(testCases())('encrypts and decrypts with a key of size $keySize and length $length', ({ keySize, length }) => {
      const key = randomArray(keySize / 8 | 0);
      const plaintext = randomArray(length);

      const encrypted = new Array(plaintext.length);
      new aes.CTR(key, new aes.Counter(0)).encrypt(plaintext, encrypted);
      expect(encrypted).toEqual(encryptArray(createCipheriv(`aes-${keySize}-ctr`, Buffer.from(key), Buffer.from(ZERO)), plaintext));

      const decrypted = new Array(encrypted.length);
      new aes.CTR(key, new aes.Counter(0)).decrypt(encrypted, decrypted);
      expect(decrypted).toEqual(plaintext);
    });
  });
});
