import RootBody from '@/components/RootBody';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Mehmet Altınbaş',
    description: "Mehmet Altınbaş's personal portfolio website.",
    icons: `${process.env.APP_BASE_URL}/icon.jpg`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="w-full h-full">
            <body className={`w-full h-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
                <RootBody>{children}</RootBody>
            </body>
        </html>
    );
}
