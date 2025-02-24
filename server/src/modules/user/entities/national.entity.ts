import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class National {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  national: string;
}
