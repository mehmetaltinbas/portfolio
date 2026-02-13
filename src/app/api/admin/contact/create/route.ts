import { ContactService } from '@/services/contact.service';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const reqBody = await req.json();

    const { label, name, value } = reqBody;

    const dto: CreateContactDto = {
        label,
        name,
        value,
    };

    const response = await ContactService.create(dto);
    return NextResponse.json(response);
}
