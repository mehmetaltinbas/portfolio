import { userService } from '@/services/user.service';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody: UpdateUserDto = await req.json();
    const response = await userService.update(reqBody);
    return NextResponse.json(response);
}
