import { IsString, IsBoolean, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  displayName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'ユーザーIDは英数字とアンダースコアのみ使用できます' })
  handle?: string;

  @IsBoolean()
  @IsOptional()
  isNsfwEnabled?: boolean;
}
