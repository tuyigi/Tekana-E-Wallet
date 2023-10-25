import * as bcrypt from 'bcryptjs';
import { JwtService as Jwt } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class JwtService {
  private readonly jwt: Jwt;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }

  /**
   * Decoding the JWT Token
   * @param token
   */

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  /**
   * Get customer by ID
   * @param decoded
   */

  public async validateCustomer(decoded: any): Promise<Customer> {
    return await Customer.findOneBy({ id: decoded.toString() });
  }

  // Generate JWT Token
  public generateToken(auth: Customer): string {
    return this.jwt.sign({ id: auth.id, email: auth.email });
  }

  // Validate customer's password
  public isPasswordMatch(password: string, customerPassword: string): boolean {
    return bcrypt.compareSync(password, customerPassword);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }
}
