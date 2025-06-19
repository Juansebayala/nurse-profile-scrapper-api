import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class BaseGetAllDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
