import { National } from 'src/modules/user/entities/national.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('energy_data')
export class EnergyData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'varchar' })
  capacity: string;

  @Column({ name: 'energy_star', type: 'varchar' })
  energyStar: string;

  @Column({ name: 'is_inverter', type: 'bool', nullable: true })
  isInverter: boolean;

  @Column({ type: 'float', nullable: true })
  eer: number;

  @Column({ type: 'float', nullable: true })
  cspf: number;

  @Column({ type: 'float', nullable: true })
  iseer: number;

  @Column({ type: 'bool', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'national_id' })
  nationalId: number;

  @ManyToOne(() => National, { nullable: true })
  @JoinColumn({ name: 'national_id', referencedColumnName: 'id' })
  national?: National;
}
