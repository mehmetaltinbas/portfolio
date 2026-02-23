import { SkillService } from '@/services/skill.service';
import { CleanUpOrphanedSkillImagesDto } from '@/types/dto/skill/clean-up-orphaned-skill-images.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(CleanUpOrphanedSkillImagesDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse);
        }

        const response = await SkillService.cleanUpOrphanedImages(validateDtoResponse.body);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
