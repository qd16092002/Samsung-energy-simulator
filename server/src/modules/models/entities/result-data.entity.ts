import { National } from 'src/modules/user/entities/national.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EModelGrade } from '../enum/model.enum';

@Entity('result_data')
export class ResultData {
  @PrimaryGeneratedColumn()
  id: number;

  // existing
  @Column({ name: 'year_ex', type: 'integer' })
  yearEx: number;

  @Column({ name: 'capacity_ex', type: 'varchar' })
  capacityEx: string;

  @Column({ name: 'energy_star_ex', type: 'varchar' })
  energyStarEx: string;

  @Column({ name: 'is_inverter_ex', type: 'bool', nullable: true })
  isInverterEx: boolean;

  @Column({ name: 'eer_ex', type: 'float', nullable: true })
  eerEx: number;

  @Column({ name: 'cspf_ex', type: 'float', nullable: true })
  cspfEx: number;

  @Column({ name: 'iseer_ex', type: 'float', nullable: true })
  iseerEx: number;

  // desired
  @Column({ name: 'capacity_ds', type: 'varchar', nullable: true })
  capacityDs: string;

  @Column({ name: 'model_code_ds', type: 'varchar' })
  modelCodeDs: string;

  @Column({ name: 'eer_ds', type: 'float', nullable: true })
  eerDs: number;

  @Column({ name: 'cspf_ds', type: 'float', nullable: true })
  cspfDs: number;

  @Column({ name: 'iseer_ds', type: 'float', nullable: true })
  iseerDs: number;

  @Column({ name: 'price_ds'})
  priceDs: number;

  @Column({ name: 'grade_ds', enum: EModelGrade, type: 'enum' })
  gradeDs: EModelGrade;

  @Column({ name: 'energy_star_ds', type: 'varchar', nullable: true })
  energyStarDs: string;

  @Column({ name: 'national_id' })
  nationalId: number;

  @ManyToOne(() => National, { nullable: true })
  @JoinColumn({ name: 'national_id', referencedColumnName: 'id' })
  national?: National;

  // result
  @Column({ type: 'float', name: 'saved_percentage' })
  savedPercentage: number;

  @Column({ name: 'cost_ex' })
  costEx: number;

  @Column({ name: 'cost_ds' })
  costDs: number;

  @Column({ name: 'saved_money' })
  savedMoney: number;
}
