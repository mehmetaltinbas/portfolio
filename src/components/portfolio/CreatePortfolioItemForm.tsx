'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { useAppDispatch } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin-slice';
import { userActions } from '@/store/slices/user-slice';
import { CreatePortfolioItemDto } from '@/types/dto/portfolio-item/create-portfolio-item.dto';
import { ResponseBase } from '@/types/response/response-base';
import React, { useState } from 'react';

export default function CreatePortfolioItemForm({
    createPortfolioItemFormRef,
    isCreatePortfolioItemFormHidden,
    setIsCreatePortfolioItemFormHidden,
}: {
    createPortfolioItemFormRef: React.RefObject<HTMLDivElement | null>;
    isCreatePortfolioItemFormHidden: boolean;
    setIsCreatePortfolioItemFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [createPortfolioItemDto, setCreatePortfolioItemDto] = React.useState<CreatePortfolioItemDto>({
        title: '',
        description: '',
    });

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const inputElement = event.currentTarget;
        setCreatePortfolioItemDto((prev) => {
            return {
                ...prev,
                [inputElement.name]: inputElement.value,
            };
        });
    }

    async function createPortfolioItem() {
        setIsSaving(true);
        try {
            const response = (await (
                await fetch('/api/admin/portfolio-item/create', {
                    method: 'POST',
                    body: JSON.stringify(createPortfolioItemDto),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ).json()) as ResponseBase;
            setIsCreatePortfolioItemFormHidden((prev) => !prev);
            alert(response.message);
            if (!response.isSuccess) dispatch(isAdminActions.set(false));
            else if (response.isSuccess) {
                dispatch(userActions.refresh());
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            ref={createPortfolioItemFormRef}
            className={`
                ${isCreatePortfolioItemFormHidden ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100'}
                z-50 absolute w-auto h-auto p-4 bg-white
                border rounded-xl
                flex flex-col justify-start items-center gap-2
            `}
        >
            <Input onChange={(event) => handleOnChange(event)} name="title" placeholder="title..." />
            <Input onChange={(event) => handleOnChange(event)} name="description" placeholder="description..." />
            <Button onClick={async (event) => await createPortfolioItem()} variant={ButtonVariant.PRIMARY} disabled={isSaving}>{isSaving ? 'Creating...' : 'Create'}</Button>
        </div>
    );
}
