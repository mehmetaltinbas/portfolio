import { skillService } from '@/services/skill.service';
import { UpdateSkillDto } from '@/types/dto/skill/update-skill.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { id, name, content, order } = reqBody;

    const dto: UpdateSkillDto = { id, name, content, order };

    const response = await skillService.updateById(id, dto);
    return NextResponse.json(response);
}
