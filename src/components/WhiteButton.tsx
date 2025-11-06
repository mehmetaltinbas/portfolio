'use client';

import React from "react";

export default function WhiteButton({
    children,
    onClick,
    className,
    ...rest
}: {
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    [key: string]: unknown;
}) {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer px-2 py-[2px] border-[1px] border-gray-600 rounded-full 
                hover:border-black ${className ?? ''}
            `}
            {...rest}
        >
            {children}
        </button>
    );
}
