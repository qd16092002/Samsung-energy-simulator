import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'dev',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255)
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
