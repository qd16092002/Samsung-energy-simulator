import { Injectable } from '@nestjs/common';
import { Score } from './entities/score.entity';
import { ScoreRepository } from './repositories/score.repository';

@Injectable()
export class ScoreService {
    
  constructor(
    private readonly scoreRepo: ScoreRepository,
  ) {}

  async addScore(scoreData: Partial<Score>): Promise<Score> {
    // 새로운 Score 객체를 생성하고, scoreData로 초기화한다.
    const newScore = this.scoreRepo.create(scoreData);

    // 데이터베이스에 새로운 Score 객체를 저장한다.
    return this.scoreRepo.save(newScore);
  }
}
