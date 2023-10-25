import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Customer } from '../../modules/customer/entities/customer.entity';
import { JwtService } from '../../modules/customer/services/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'RSSB_TESTING',
      ignoreExpiration: true,
    });
  }

  private validate(token: string): Promise<Customer | never> {
    return this.jwtService.verify(token);
  }
}
