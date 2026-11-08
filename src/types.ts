export interface Cipher {
  name: string;
  description: string;
  encrypt(plaintext: DataView, result: DataView): void;
  decrypt(ciphertext: DataView, result: DataView): void;
}
