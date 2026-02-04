'use client';

import { AboutSection } from '@/components/resume/AboutSection';
import { ExperiencesSection } from '@/components/resume/ExperiencesSection';

export default function Page() {
    return (
        <div className="w-full h-full flex flex-col items-center gap-16 px-24">
            <AboutSection />
            <ExperiencesSection />
        </div>
    );
}
