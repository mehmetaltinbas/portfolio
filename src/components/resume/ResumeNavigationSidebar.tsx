'use client';

import { RESUME_NAVIGATION_ITEMS } from '@/constants/resume-navigation-items.constant';
import { useEffect, useState } from 'react';

export function ResumeNavigationSidebar() {
    const [activeId, setActiveId] = useState<string>('about');

    useEffect(() => {
        let rafId = 0;

        function onScroll() {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                let current = RESUME_NAVIGATION_ITEMS[0].id;
                for (const item of RESUME_NAVIGATION_ITEMS) {
                    const el = document.getElementById(item.id);
                    if (el && el.getBoundingClientRect().top <= 100) {
                        current = item.id;
                    }
                }
                setActiveId(current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <nav className="hidden md:flex fixed left-8 lg:left-16 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
            {RESUME_NAVIGATION_ITEMS.map((item) => (
                <a
                    key={item.id}
                    href={`/resume#${item.id}`}
                    className={`text-sm transition-colors duration-200 ${
                        activeId === item.id ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-700'
                    }`}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
