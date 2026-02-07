import { skillService } from '@/services/skill.service';
import { ReorderSkillsDto } from '@/types/dto/skill/reorder-skills.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { orderedIds } = reqBody;

    const dto: ReorderSkillsDto = { orderedIds };

    const response = await skillService.reorder(dto);
    return NextResponse.json(response);
}
