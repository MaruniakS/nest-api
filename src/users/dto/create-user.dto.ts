import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(1024)
  readonly email: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  readonly fullName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(512)
  readonly password: string;
}
