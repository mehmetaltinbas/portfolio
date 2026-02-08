import { contactService } from '@/services/contact.service';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { id, label, name, value } = reqBody;

    const dto: UpdateContactDto = {
        id,
        label,
        name,
        value,
    };

    const response = await contactService.update(dto);
    return NextResponse.json(response);
}
