import { userService } from "@/services/user-service";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("hit to api route");
    const response = await userService.readExtendedById();
    return NextResponse.json(response);
}
