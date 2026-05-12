import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../items/entities/product.entity';

@Entity('users') // Название таблицы в базе данных
export class User {
  @PrimaryGeneratedColumn('uuid') // Генерирует уникальный ID (UUID)
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Пароль не будет возвращаться в обычных запросах SELECT
  password!: string;

  @Column({ nullable: true })
  userName!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string = 'user';

  @Column({ default: ''})
  avatarPath: string = '';

  @OneToMany(() => Product, (product) => product.user)
  products: Product[] | undefined;
  
  @CreateDateColumn() // Автоматически ставит дату создания
  createdAt!: Date;

  @UpdateDateColumn() // Автоматически обновляет дату при изменении записи
  updatedAt!: Date;
}