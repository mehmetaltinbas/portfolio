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
                    <p className="text-2xl font-bold text-center md:col-span-2 xl:col-span-3 p-4">Portfolio</p>
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
