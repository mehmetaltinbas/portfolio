import { experienceService } from '@/services/experience.service';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { title, company, isCurrent, startDate, endDate } = reqBody;

    const dto: CreateExperienceDto = {
        title,
        company,
        isCurrent,
        startDate,
        endDate,
    };

    const response = await experienceService.create(dto);
    return NextResponse.json(response);
}
