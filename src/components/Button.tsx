import type React from 'react';

export function Button({
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
            className={`cursor-pointer px-2 py-0.5 border-2 border-black rounded-[10px]
                bg-black text-white text-s
                hover:bg-white hover:text-black
                duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                ${className ?? ''}
            `}
            {...rest}
        >
            {children}
        </button>
    );
}
