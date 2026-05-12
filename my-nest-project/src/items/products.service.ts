import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
// 1. Создаем объект продукта на основе DTO
    // Мы передаем userId в поле user, TypeORM поймет, что это связь ManyToOne
    const product = this.productRepository.create({
      ...createProductDto,
      user: { id: userId } as User, // Привязываем автора
    });

    // 2. Сохраняем в базу. 
    // Благодаря { cascade: true } в Entity, варианты (variants) сохранятся автоматически
    return await this.productRepository.save(product);
  }

  findAll() {
    return `This action returns all products`;
  }

findOne(id: string) {
  return this.productRepository.findOne({
    where: { id },
    relations: ['user', 'variants'], // Подгружаем владельца и варианты
  });
}

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
