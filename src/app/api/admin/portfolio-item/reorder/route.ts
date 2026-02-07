import { portfolioItemService } from '@/services/portfolio-item.service';
import { ReorderPortfolioItemsDto } from '@/types/dto/portfolio-item/reorder-portfolio-items.dto';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    const reqBody = await req.json();

    const { orderedIds } = reqBody;

    const dto: ReorderPortfolioItemsDto = { orderedIds };

    const response = await portfolioItemService.reorder(dto);
    return NextResponse.json(response);
}
