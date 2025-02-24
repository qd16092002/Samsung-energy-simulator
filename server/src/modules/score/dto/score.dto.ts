import { IsNumber, Max, Min } from 'class-validator';

export class ScoreDto {

  @IsNumber()
  resultId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  score: number;
}
