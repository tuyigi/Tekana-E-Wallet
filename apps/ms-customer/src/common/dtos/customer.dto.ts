import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CustomerDto {
  @IsString()
  public first_name: string;
  @IsString()
  public last_name: string;
  @IsEmail()
  public email: string;
  @IsString()
  @Length(12)
  public phone_number: string;
  @IsNotEmpty()
  public id_type: 'NID' | 'PASSPORT';
  @IsString()
  @IsNotEmpty()
  public id_number: string;
  @IsNotEmpty()
  public gender: 'FEMALe' | 'MALE';
  @MinLength(6)
  public password: string;
}
