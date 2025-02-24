import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EModelGrade } from '../enum/model.enum';
import { National } from 'src/modules/user/entities/national.entity';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  capacity: string;

  @Column({ name: 'model_code', type: 'varchar' })
  modelCode: string;

  @Column({ type: 'float', nullable: true })
  eer: number;

  @Column({ type: 'float', nullable: true })
  cspf: number;

  @Column({ type: 'float', nullable: true })
  iseer: number;

  @Column()
  price: number;

  @Column({ enum: EModelGrade, type: 'enum' })
  grade: EModelGrade;

  @Column({ name: 'energy_star', type: 'varchar', nullable: true })
  energyStar: string;

  @Column({ name: 'national_id' })
  nationalId: number;

  @ManyToOne(() => National, { nullable: true })
  @JoinColumn({ name: 'national_id', referencedColumnName: 'id' })
  national?: National;
}
