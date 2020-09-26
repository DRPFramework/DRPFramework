import * as sjcl from 'sjcl';

export class EncryptionUtil {
  public static encryptPassword(password: string): string {
    const saltBits = sjcl.random.randomWords(2, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(password, saltBits, 2000, 256));
    return `${key}$${salt}`;
  }

  public static verifyPassword(password: string, storedPasswordHash: string): boolean {
    const [_key, _salt] = storedPasswordHash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    return _key === derivedBaseKey;
  }

  public static sha256(data: string): string {
    const hashBytes = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBytes);
  }
}
