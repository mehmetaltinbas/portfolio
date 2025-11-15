'use client';

import { BlackButton } from "@/components/BlackButton";
import PortfolioItemCard from "@/components/PortfolioItemCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { isAdminActions } from "@/store/slices/is-admin-slice";
import { userActions } from "@/store/slices/user-slice";
import { CreatePortfolioItemDto } from "@/types/dto/portfolio-item/create-portfolio-item-dto";
import { ResponseBase } from "@/types/response/response-base";
import { ChangeEvent, useRef, useState } from "react";

export default function Page() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.isAdmin);
    const [isPortfolioItemFormHidden, setIsPortfolioItemFormHidden] = useState<boolean>(true);
    const createPortfolioItemForm = useRef<HTMLDivElement>(null);
    const [createPortfolioItemDto, setCreatePortfolioItemDto] = useState<CreatePortfolioItemDto>({
        title: '',
        description: ''
    });

    function toggleCreatePortfolioItemForm(button: HTMLButtonElement) {
        if (!createPortfolioItemForm.current) return;
        setIsPortfolioItemFormHidden(prev => !prev);
        const rects = button.getBoundingClientRect();
        createPortfolioItemForm.current.style.left = `${rects.left}px`;
        createPortfolioItemForm.current.style.top = `${rects.top - 52}px`;
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        const inputElement = event.currentTarget;
        setCreatePortfolioItemDto(prev => {
            return {
                ...prev,
                [inputElement.name]: inputElement.value
            };
        });
    }

    async function createPortfolioItem() {
        const response = await (await fetch('/api/admin/portfolio-item/create', {
            method: 'POST',
            body: JSON.stringify(createPortfolioItemDto),
            headers: {
                "Content-Type": 'application/json'
            },
        })).json() as ResponseBase;
        setIsPortfolioItemFormHidden(prev => !prev);
        alert(response.message);
        if (!response.isSuccess) dispatch(isAdminActions.set(false));
        else if (response.isSuccess) {
            dispatch(userActions.refresh());
        }
    }

    return (
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="flex justify-center items-center gap-4 md:col-span-2 xl:col-span-3">
                <p className="text-2xl font-bold text-center md:col-span-2 xl:col-span-3">Portfolio</p>
                {isAdmin && <BlackButton onClick={event => toggleCreatePortfolioItemForm(event.currentTarget)}>+</BlackButton>}
            </div>
            {user.portfolioItems.map((portfolioItem, index) => (
                <PortfolioItemCard key={portfolioItem.id} portfolioItem={portfolioItem} />
            ))}

            <div ref={createPortfolioItemForm} className={`${isPortfolioItemFormHidden ? 'hidden' : ''} absolute w-auto h-auto p-4 border rounded-xl flex flex-col justify-start items-center`}>
                <input onChange={event => handleOnChange(event)} name="title" placeholder="name..." />
                <input onChange={event => handleOnChange(event)} name="description" placeholder="description..." />
                <BlackButton onClick={async (event) => await createPortfolioItem()}>submit</BlackButton>
            </div>
        </div>
    );
}
