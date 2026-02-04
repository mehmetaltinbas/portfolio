'use client';

import { AboutSection } from '@/components/resume/AboutSection';
import { SkillsSection } from '@/components/resume/SkillsSection';
import { ExperiencesSection } from '@/components/resume/ExperiencesSection';
import { EducationsSection } from '@/components/resume/EducationsSection';

export default function Page() {
    return (
        <div className="w-full h-full flex flex-col items-center gap-16 px-24">
            <AboutSection />
            <SkillsSection />
            <ExperiencesSection />
            <EducationsSection />
        </div>
    );
}
