export const encryptions = ['bcrypt', 'aes'] as const;
export type Encryption = typeof encryptions[number];

export interface Encryptor {
  encrypt(message: string, key?: string): string;
  decrypt(encrypted: string, key?: string): string;
  compare(message: string, encrypted: string, key?: string): boolean;
}
