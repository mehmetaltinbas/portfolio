'use client';

import PortfolioItemCard from "@/components/PortfolioItemCard";
import { useAppSelector } from "@/store/hooks";

export default function Page() {
    const user = useAppSelector(state => state.user);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <p className="text-2xl font-bold text-center md:col-span-2 xl:col-span-3">Portfolio</p>
            {user.portfolioItems.map((portfolioItem, index) => (
                <PortfolioItemCard key={portfolioItem.id} portfolioItem={portfolioItem} />
            ))}
        </div>
    );
}
