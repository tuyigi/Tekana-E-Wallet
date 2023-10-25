import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerService } from '../../microservice_modules/customers/services/customer.service';
import { checkAuthorizationResponseDto } from '@app/common/types/ms_customer';

/**
 * Guard for checking the authorization of user
 * And if token if not expired, it will be intercepted to some requests for security purpose
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Inject customer service
   */
  @Inject(CustomerService) customerService: CustomerService;
  async canActivate(context: ExecutionContext): Promise<boolean> | never {
    const request = context.switchToHttp().getRequest();
    const authorization: string = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException();
    }
    const bearer: string[] = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }
    const token: string = bearer[1];
    let authorityCheckResponse: checkAuthorizationResponseDto;
    this.customerService
      .checkAuthorization({ token })
      .subscribe((v) => (authorityCheckResponse = v));
    if (!authorityCheckResponse.isAuthorized) {
      throw new UnauthorizedException();
    }
    request.user = authorityCheckResponse.id;
    return true;
  }
}
