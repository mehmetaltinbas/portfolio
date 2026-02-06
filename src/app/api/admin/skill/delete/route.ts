import { skillService } from '@/services/skill.service';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody = await req.json();

    const { id } = reqBody;

    const response = await skillService.deleteById(id);
    return NextResponse.json(response);
}
