import { userService } from "@/services/user-service";
import { UpdateUserDto } from "@/types/dto/user/update-user-dto";
import { NextResponse } from "next/server";

export async function GET() {
    const response = await userService.readExtendedById();
    return NextResponse.json(response);
}

export async function PATCH(req: Request) {
    const reqBody: UpdateUserDto = await req.json();
    const response = await userService.update(reqBody);
    return NextResponse.json(response);
}
