'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { useAppDispatch } from '@/store/hooks';
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

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const element = event.currentTarget;
        setCreatePortfolioItemDto((prev) => {
            return {
                ...prev,
                [element.name]: element.value,
            };
        });
    }

    function cancelCreate() {
        setCreatePortfolioItemDto({ title: '', description: '' });
        setIsCreatePortfolioItemFormHidden(true);
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

            if (!response.isSuccess) {
                alert(response.message);
            } else {
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
                z-50 absolute w-[400px] h-auto p-4 bg-white
                border rounded-xl
                flex flex-col justify-start items-center gap-2
            `}
        >
            <Input name="title" onChange={(event) => handleOnChange(event)} placeholder="title..." />
            <TextArea
                name="description"
                onChange={(event) => handleOnChange(event)}
                placeholder="description..."
                className="min-h-[100px]"
            />
            <div className="flex gap-2">
                <Button
                    onClick={async (event) => await createPortfolioItem()}
                    variant={ButtonVariant.PRIMARY}
                    disabled={isSaving}
                >
                    {isSaving ? 'Creating...' : 'Create'}
                </Button>
                <Button onClick={cancelCreate} variant={ButtonVariant.SECONDARY}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
