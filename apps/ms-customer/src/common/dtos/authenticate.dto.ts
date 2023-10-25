import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  public password: string;
}
