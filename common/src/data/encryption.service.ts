import { Encryption, Encryptor } from '..';
import { compareSync, hashSync, genSaltSync } from 'bcryptjs';
import aes from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export class Bcrypt implements Encryptor {
  encrypt(message: string): string {
    if (this.isBcrypt(message)) return message;
    const salt = genSaltSync();
    return hashSync(message, salt);
  }

  decrypt(encrypted: string): string {
    return undefined;
  }

  private isBcrypt(message: string) {
    return message && message.length == 60 && message.startsWith('$2');
  }

  compare(message: string, encrypted: string): boolean {
    return compareSync(message, encrypted);
  }
}

export class Aes implements Encryptor {
  #key = 'dnwpftkfkdcp%';

  encrypt(message: string, key: string = this.#key): string {
    return aes.encrypt(message, key).toString();
  }

  decrypt(encrypted: string, key: string = this.#key): string {
    try {
      return aes.decrypt(encrypted, key).toString(Utf8);
    } catch {
      return encrypted;
    }
  }

  compare(message: string, encrypted: string, key: string = this.#key): boolean {
    return this.decrypt(encrypted, key) === message;
  }
}

export class EncryptionService implements Record<Encryption, Encryptor> {
  bcrypt = new Bcrypt();
  aes = new Aes();
}
