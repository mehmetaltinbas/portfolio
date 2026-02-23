import { SkillService } from '@/services/skill.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const response = await SkillService.deleteById(id);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
