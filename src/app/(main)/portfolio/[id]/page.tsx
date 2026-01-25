'use server';

import PageClient from "@/app/(main)/portfolio/[id]/page-client";
import { portfolioItemService } from "@/services/portfolio-item-service";

export default async function Page({ params, }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const readSinglePortfolioItemResponse = await portfolioItemService.readById(id);

    return (
        <div className="w-full h-full flex justify-center items-start">
            <div className="w-[750px] h-full">
                {(readSinglePortfolioItemResponse.isSuccess && readSinglePortfolioItemResponse.portfolioItem) ? (
                        <PageClient 
                            portfolioItem={readSinglePortfolioItemResponse.portfolioItem}
                        />
                    ) : (
                        <div>PortfolioItem not found</div>
                )}
            </div>
        </div>
    );
}
