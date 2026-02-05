'use client';

import { Button } from '@/components/Button';
import PortfolioItemEditor from '@/components/portfolio/PortfolioItemEditor';
import PortfolioViewer from '@/components/portfolio/PortfolioItemViewer';
import { useAppSelector } from '@/store/hooks';
import { PortfolioItemRow } from '@/types/db/portfolio-item-row';
import { ResponseBase } from '@/types/response/response-base';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PageClient({ portfolioItem }: { portfolioItem: PortfolioItemRow }) {
    const [content, setContent] = useState<object>(portfolioItem.content as object);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        console.log(content);
    }, [content]);

    async function handleSave() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/portfolio-item/update/${portfolioItem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })
            ).json();
            alert(response.message);
        } catch (error) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full h-full">
            <div className="w-full h-auto flex justify-start items-center gap-8 p-6">
                <Link href={'/portfolio'}>
                    <Button>←</Button>
                </Link>
                <p className="font-semibold text-2xl">{portfolioItem.title}</p>
            </div>
            <div className="w-full h-auto p-6">
                <p>{portfolioItem.description}</p>
            </div>
            <span className="block w-[full] h-[2px] rounded-full bg-black"></span>
            {/* <div className="w-full h-auto flex flex-col justify-start items-center gap-4">
                <p className="font-semibold text-lg">Gallery</p>
            </div> */}
            <div className="p-[25px]">
                {isAdmin ? (
                    <PortfolioItemEditor
                        initialContent={content}
                        onContentChange={setContent}
                        portfolioItemId={portfolioItem.id}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                ) : (
                    <PortfolioViewer content={content} />
                )}
            </div>
        </div>
    );
}
