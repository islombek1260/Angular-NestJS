// src/products/entities/product-variant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    color!: string; // Например: 'Black', 'White', '#000000'

  @Column()
    size!: string; // Например: 'S', 'M', 'L', 'XL'

  @Column({ type: 'int', default: 0 })
    stock!: number; // Количество именно этой комбинации

  @Column({ unique: true, nullable: true })
    sku!: string; // Артикул (например: TSHIRT-BLK-XL)

  @Column({ type: 'varchar', nullable: true })
    variantImage!: string; // Опционально: фото товара именно в этом цвете

  // Связь: Много вариантов относятся к одному продукту
  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    product!: Product;
}