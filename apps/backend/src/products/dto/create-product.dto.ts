import { Transform } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  @Max(100_000)
  price: number;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isNsfw?: boolean;

  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
