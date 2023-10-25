import * as bcrypt from 'bcryptjs';
export class Shared {
  // this function encrypt and salt password and return encrypted,salted password using bcrypt
  public static encryptPassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * This function used for generating OTP
   */
  public static generateOtp(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
}
