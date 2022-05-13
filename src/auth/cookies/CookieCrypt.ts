import crypto from 'crypto'
export default class StringCrypt{
  private static key = 'nf9vo51sJWYYATeJC3KBnvIQm4M8TkZ3'; // 32 Chars
  private static algorith = 'aes-256-cbc';
  private static IV_LENGTH = 16;
  private static separator = ":IGP:";
  public static encrypt(value: string): string {
    let iv = crypto.randomBytes(this.IV_LENGTH);
    let cipher = crypto.createCipheriv(this.algorith, this.key, iv);
    let encrypted = cipher.update(value, 'utf8');
    let encryptedBuffer = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + this.separator + encryptedBuffer.toString('hex');
  }
  public static decrypt(value: string): string {
    let textArray = value.split(this.separator);
    let iv = Buffer.from(textArray[0], 'hex');
    let encryptedText = Buffer.from(textArray[1], 'hex');
    let decipher = crypto.createDecipheriv(this.algorith, this.key, iv);
    let decrypted = decipher.update(encryptedText);
    let decryptedBuffer = Buffer.concat([decrypted, decipher.final()]);
    return decryptedBuffer.toString();
  }
}