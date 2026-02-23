import { YEAR_MONTH_REGEX } from '@/constants/year-month-regex.constant';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateExperienceDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    company!: string;

    @IsBoolean()
    @IsNotEmpty()
    isCurrent!: boolean;

    @IsString()
    @IsNotEmpty()
    @Matches(YEAR_MONTH_REGEX, { message: 'startDate must be in YYYY-MM format' })
    startDate!: string;

    @IsString()
    @IsOptional()
    @Matches(YEAR_MONTH_REGEX, { message: 'endDate must be in YYYY-MM format' })
    endDate?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
