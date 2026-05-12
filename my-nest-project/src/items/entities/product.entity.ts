// src/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'varchar', nullable: true })
    category!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'varchar', nullable: true })
    baseImage!: string; // Главное фото, которое видно в каталоге

    // Связь: Много товаров могут принадлежать одному пользователю
    @ManyToOne(() => User, (user) => user.products, {
        nullable: false, // Продукт не может существовать без автора
        onDelete: 'CASCADE' // Если юзер удален, его товары тоже удалятся
    })
    user!: User;

    // Связь: Один товар имеет много вариантов (цветов/размеров)
    @OneToMany(() => ProductVariant, (variant) => variant.product, {
        cascade: true,
        eager: true // Автоматически подгружать варианты при запросе продукта
    })
    variants!: ProductVariant[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}