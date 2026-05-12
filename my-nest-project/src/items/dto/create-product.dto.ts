import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Сначала опишем структуру варианта (цвет, размер, количество)
export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  size!: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  variantImage?: string;
}

// Основной DTO для создания продукта
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  baseImage?: string;

  // Описываем массив вариантов
  @IsArray()
  @ValidateNested({ each: true }) // Валидирует каждый объект внутри массива
  @Type(() => CreateProductVariantDto) // Указывает class-transformer, в какой класс превращать объекты
  variants!: CreateProductVariantDto[];
}