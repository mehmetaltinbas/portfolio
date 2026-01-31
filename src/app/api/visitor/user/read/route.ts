import { userService } from "@/services/user.service";
import { NextResponse } from "next/server";

export async function GET() {
    const response = await userService.readExtendedById();
    return NextResponse.json(response);
}
