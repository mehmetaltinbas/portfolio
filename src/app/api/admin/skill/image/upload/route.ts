import { skillService } from '@/services/skill.service';
import { UploadSkillImageDto } from '@/types/dto/skill/upload-skill-image.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const formData = await req.formData();

    const dto: UploadSkillImageDto = {
        file: formData.get('file') as File,
        skillId: formData.get('skillId') as string,
    };

    const response = await skillService.uploadImage(dto);
    return NextResponse.json(response);
}
