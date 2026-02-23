import { ContactService } from '@/services/contact.service';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(UpdateContactDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse);
        }

        const response = await ContactService.update(id, validateDtoResponse.body);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
