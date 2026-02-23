import { EducationService } from '@/services/education.service';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(CreateEducationDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse);
        }

        const response = await EducationService.create(validateDtoResponse.body);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
