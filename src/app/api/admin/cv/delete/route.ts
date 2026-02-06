import { userService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function DELETE() {
    const response = await userService.deleteCv();
    return NextResponse.json(response);
}
