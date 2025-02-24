import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: '+84834242311',
    required: true,
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '	891012012345678901',
    required: true,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  deviceId: string;
}
