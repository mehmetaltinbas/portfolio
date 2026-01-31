import { userId } from "@/constants/user-id.constant";
import { InputJsonValue } from "@/generated/client/runtime/library";
import { CreatePortfolioItemDto } from "@/types/dto/portfolio-item/create-portfolio-item.dto";
import { UpdatePortfolioItemDto } from "@/types/dto/portfolio-item/update-portfolio-item.dto";
import { ReadAllPortfolioItemsResponse } from "@/types/response/portfolio-item/read-all-portfolio-items-response";
import { ReadSinglePortfolioItemResponse } from "@/types/response/portfolio-item/read-single-portfolio-item-response";
import { ResponseBase } from "@/types/response/response-base";
import { prisma } from "prisma/prisma-client";

export const portfolioItemService = {
    async create(createPortfolioItemDto: CreatePortfolioItemDto): Promise<ResponseBase> {
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
    },

    async readById(id: string): Promise<ReadSinglePortfolioItemResponse> {
        const portfolioItem = await prisma.portfolioItem.findUnique({ where: { id }});

        if (!portfolioItem) return { isSuccess: false, message: "portfolio item couldn't read" };

        return { isSuccess: true, message: 'portfolio item read', portfolioItem };
    },

    async readAllByUserId(): Promise<ReadAllPortfolioItemsResponse> {
        const portfolioItems = await prisma.portfolioItem.findMany({ where: { userId }});
        return { isSuccess: true, message: 'all portfolio items read', portfolioItems };
    },

    async updateById(id: string, updatePortfolioItemDto: UpdatePortfolioItemDto): Promise<ResponseBase> {
        await prisma.portfolioItem.update(
            {
                where: {
                    id
                },
                data: {
                    ...updatePortfolioItemDto,
                    content: updatePortfolioItemDto.content as InputJsonValue
                }
            },
        );
        return { isSuccess: true, message: 'updated' };
    }
};
