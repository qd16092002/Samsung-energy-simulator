import { ResultData } from 'src/modules/models/entities/result-data.entity';
import { National } from 'src/modules/user/entities/national.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Check(`"score" BETWEEN 1 AND 10`)  // score가 1~10 사이의 값인지를 체크
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  regdate: Date;

  @Column()
  ipaddress: string;

  @Column({ name: 'national_id' })
  nationalId: number;

  @ManyToOne(() => National, { nullable: true })
  @JoinColumn({ name: 'national_id', referencedColumnName: 'id' })
  national?: National;

  @Column({ name: 'result_id' })
  resultId: number;

  @OneToOne(() => ResultData, { nullable: true })
  @JoinColumn({ name: 'result_id', referencedColumnName: 'id' })
  result?: ResultData;

  @Column({
    type: 'int',
  })
  score: number;
}
