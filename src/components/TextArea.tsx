import type React from 'react';

export function TextArea({
    className,
    ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`w-full py-1 px-3 border border-black rounded-[10px]
                text-s text-black placeholder-gray-400
                outline-none
                duration-300
                ${className ?? ''}
            `}
            {...rest}
        />
    );
}
