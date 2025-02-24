import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { National } from './national.entity';

@Entity()
export class LoginLog {
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
}
