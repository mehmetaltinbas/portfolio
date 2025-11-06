'use client';

import { useAppSelector } from '@/store/hooks';
import { Link as LinkInterface } from '@/types/link';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const links: LinkInterface[] = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Resume',
        href: '/resume',
    },
    {
        name: 'Portfolio',
        href: '/portfolio',
    },
];

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const isAdmin = useAppSelector(state => state.isAdmin);

    return (
        <nav className="relative w-full h-auto flex flex-col justify-center items-center bg-black">
            {isAdmin && (<p className='absolute left-0 top-0 text-red-500'>Admin</p>)}

            <div className="w-full h-auto bg-black flex justify-end md:hidden py-2 pr-2">
                <button onClick={() => setIsOpen((prev) => !prev)}>
                    {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
                </button>
            </div>

            <div
                className={`w-full h-auto px-4 pb-4 md:p-4 bg-black shadow-2xl flex md:flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-white text-sm
                    ${isOpen ? 'flex' : 'hidden'}`}
            >
                {links.map((link, index) => (
                    <Link
                        key={`link-${index}-${link.name}`}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-gray-400 duration-250"
                    >
                        <p>{link.name}</p>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
