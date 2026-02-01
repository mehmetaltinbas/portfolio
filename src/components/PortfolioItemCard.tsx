import { PortfolioItemRow } from '@/types/db/portfolio-item-row';
import Link from 'next/link';
import { FaFolder } from 'react-icons/fa';

export default function PortfolioItemCard({ portfolioItem }: { portfolioItem: PortfolioItemRow }) {
    return (
        <Link
            href={`/portfolio/${portfolioItem.id}`}
            className="w-full h-full bg-white p-6 rounded-2xl shadow-md border flex flex-col justify-center items-center gap-0 transition-all hover:border-[#00316E] duration-300 hover:cursor-pointer
            ease-out hover:shadow-xl"
        >
            <div className="w-full flex justify-between items-center gap-2">
                <FaFolder className="text-xl" />
            </div>
            <p className="text-lg font-semibold">{portfolioItem.title}</p>
            {/* <p className="text-gray-600">{portfolioItem.description}</p> */}
            {/* <div className="w-full flex items-center gap-[10px] overflow-x-auto">
                project skills...
            </div> */}
        </Link>
    );
}
