import { educationService } from '@/services/education.service';
import { DeleteEducationDto } from '@/types/dto/education/delete-education.dto';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const reqBody = await req.json();

    const { id } = reqBody;

    const dto: DeleteEducationDto = { id };

    const response = await educationService.delete(dto);
    return NextResponse.json(response);
}
