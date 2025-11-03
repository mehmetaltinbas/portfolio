import { userService } from '@/services/user-service';
import type { NextApiRequest, NextApiResponse } from 'next';
 
export async function GET() {
    return Response.json({
        message: "done"
    });
}