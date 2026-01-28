import { IsUrl, IsOptional, Length } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL không hợp lệ' })
  originalUrl: string;

  @IsOptional()
  @Length(4, 10, { message: 'Short code phải có từ 4-10 ký tự' })
  customCode?: string;
}
