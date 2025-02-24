import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOneByModelCode {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  modelCode: string;
}
