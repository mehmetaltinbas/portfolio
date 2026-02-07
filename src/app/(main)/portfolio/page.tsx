'use client';

import { Button } from '@/components/Button';
import CreatePortfolioItemForm from '@/components/portfolio/CreatePortfolioItemForm';
import PortfolioItemCard from '@/components/portfolio/PortfolioItemCard';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { useAppSelector } from '@/store/hooks';
import { useRef, useState } from 'react';

export default function Page() {
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isCreatePortfolioItemFormHidden, setIsCreatePortfolioItemFormHidden] = useState<boolean>(true);
    const createPortfolioItemFormRef = useRef<HTMLDivElement>(null);

    function toggleCreatePortfolioItemForm(button: HTMLButtonElement) {
        if (!createPortfolioItemFormRef.current) return;
        setIsCreatePortfolioItemFormHidden((prev) => !prev);

        const buttonRect = button.getBoundingClientRect();
        const parentRect = createPortfolioItemFormRef.current.offsetParent?.getBoundingClientRect();
        if (!parentRect) return;

        const buttonCenterX = buttonRect.left + Math.floor(buttonRect.width / 2);
        const formWidth = createPortfolioItemFormRef.current.offsetWidth;

        createPortfolioItemFormRef.current.style.left = `${buttonCenterX - parentRect.left - formWidth / 2}px`;
        createPortfolioItemFormRef.current.style.top = `${buttonRect.bottom - parentRect.top + 4}px`;
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-16 px-24">
            <div className="relative w-[700px] h-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center items-center gap-4 md:col-span-2 xl:col-span-3">
                    <div className="flex justify-center items-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path // the collection
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path // universal showcase
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" 
                            />
                        </svg> */}
                        {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path // window/presentation showcase
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                        </svg> */}
                        <p className="text-2xl font-bold text-center md:col-span-2 xl:col-span-3 p-4">Portfolio</p>
                    </div>
                    {isAdmin && (
                        <Button
                            onClick={(event) => toggleCreatePortfolioItemForm(event.currentTarget)}
                            variant={ButtonVariant.PRIMARY}
                        >
                            +
                        </Button>
                    )}
                </div>
                {user.portfolioItems.map((portfolioItem, index) => (
                    <PortfolioItemCard key={portfolioItem.id} portfolioItem={portfolioItem} />
                ))}

                <CreatePortfolioItemForm
                    createPortfolioItemFormRef={createPortfolioItemFormRef}
                    isCreatePortfolioItemFormHidden={isCreatePortfolioItemFormHidden}
                    setIsCreatePortfolioItemFormHidden={setIsCreatePortfolioItemFormHidden}
                />
            </div>
        </div>
    );
}
