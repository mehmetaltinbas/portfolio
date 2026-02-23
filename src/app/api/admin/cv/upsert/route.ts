import { UserService } from '@/services/user.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get('file');

        if (!file || !(file instanceof File))
            return NextResponse.json({ isSuccess: false, message: "file doesn't exist" });
        if (file.type !== 'application/pdf')
            return NextResponse.json({ isSuccess: false, message: 'file must be a pdf' });

        const response = await UserService.upsertCv(file);

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
