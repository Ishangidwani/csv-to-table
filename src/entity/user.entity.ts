import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
  })
  age: number;

  @Column({
    nullable: true,
    default: '',
  })
  gender: string;

  @Column('jsonb', { nullable: true })
  address: object;

  @Column('jsonb', { nullable: true })
  additional_info: object;
}
