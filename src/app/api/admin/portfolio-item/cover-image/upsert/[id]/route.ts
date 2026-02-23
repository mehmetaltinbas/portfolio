import { PortfolioItemService } from '@/services/portfolio-item.service';
import { ResponseBase } from '@/types/response/response-base';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;

        const formData = await req.formData();

        const file = formData.get('file');

        if (!file || !(file instanceof File))
            return NextResponse.json({ isSuccess: false, message: "file isn't given or isn't File" });
        if (!file.type.startsWith('image/'))
            return NextResponse.json({ isSuccess: false, message: 'file must be an image' });

        const response = await PortfolioItemService.upsertCoverImage(params.id, file);
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);

        const response: ResponseBase = {
            isSuccess: false,
            message: 'internal server error'
        };
        
        return NextResponse.json(response);
    }
}
