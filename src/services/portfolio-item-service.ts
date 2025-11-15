import { CreatePortfolioItemDto } from "@/types/dto/portfolio-item/create-portfolio-item-dto";
import { ReadAllPortfolioItemsResponse } from "@/types/response/portfolio-item/read-all-portfolio-items-response";
import { ResponseBase } from "@/types/response/response-base";
import { prisma } from "prisma/prisma-client";

const userId = process.env.USER_ID;

async function create(createPortfolioItemDto: CreatePortfolioItemDto): Promise<ResponseBase> {
    try {
        if (!userId) return { isSuccess: false, message: 'userId is undefined' };
        await prisma.portfolioItem.create({
            data: {
                userId,
                ...createPortfolioItemDto
            }
        });
        return { isSuccess: true, message: 'portfolio item created' };
    } catch(error) {
        return { isSuccess: false, message: "portfolio item couldn't created" };
    }
}

async function readAllByUserId(): Promise<ReadAllPortfolioItemsResponse> {
    const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId }});
    return { isSuccess: true, message: 'all portfolio items read', portfolioItems };
}

export const portfolioItemService = {
    create,
    readAllByUserId,
};
