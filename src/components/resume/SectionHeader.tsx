'use client';

export function SectionHeader({ title }: { title: string }) {
    return (
        <div className="w-full flex justify-between items-center gap-6">
            <p className="text-xl font-bold whitespace-nowrap">{title}</p>
            <span className="w-full h-[1px] bg-blue-700"></span>
        </div>
    );
}
