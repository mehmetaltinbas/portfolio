import { UserService } from '@/services/user.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextResponse } from 'next/server';

export async function DELETE() {
    try {
        const response = await UserService.deleteCv();

        return NextResponse.json(response);
    } catch (error) {
        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        return NextResponse.json(response);
    }
}
