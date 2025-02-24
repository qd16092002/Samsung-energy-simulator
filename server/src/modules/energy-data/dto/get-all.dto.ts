import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BasePaginationDto } from 'src/common/base/paignation.dto';

export class GetAllEnergyDto extends BasePaginationDto {}

export class GetOneDto {
  @ApiProperty({
    type: 'integer',
    required: true,
    example: 2024,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  year: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '9k',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  capacity: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '4',
  })
  energyStar: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  isInverter: boolean;
}