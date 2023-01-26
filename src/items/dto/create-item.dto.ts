import { IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;
}
