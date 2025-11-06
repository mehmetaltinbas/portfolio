import { ReadAllPortfolioItemsResponse } from "@/types/response/portfolio-item/read-all-portfolio-items-response";
import { prisma } from "prisma/prisma-client";

const userId = process.env.USER_ID;

async function readAllByUserId(): Promise<ReadAllPortfolioItemsResponse> {
    const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId }});
    return { isSuccess: true, message: 'all portfolio items read', portfolioItems };
}

export const portfolioItemService = {
    readAllByUserId,
};
