import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetOneDto } from 'src/modules/energy-data/dto/get-all.dto';

export class CalculateEnergySavingDto {
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1600000,
  })
  @Type(() => Number)
  @IsNumber()
  monthlyBill: number;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 12,
  })
  @Type(() => Number)
  @IsNumber()
  annualAirConditioner: number;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 60,
  })
  @Type(() => Number)
  @IsNumber()
  portionOfAC: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'AR24CYHAAWKNSV',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  modelCode: string;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 1600000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  newModelPrice: number;

  @ApiProperty({ type: GetOneDto })
  @Type(() => GetOneDto)
  existingAirConditioner: GetOneDto;
}
