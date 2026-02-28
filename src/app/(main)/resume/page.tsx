'use client';

import { AboutSection } from '@/components/resume/AboutSection';
import { EducationsSection } from '@/components/resume/educations/EducationsSection';
import { ExperiencesSection } from '@/components/resume/experiences/ExperiencesSection';
import { ResumeNavigationSidebar } from '@/components/resume/ResumeNavigationSidebar';
import { SkillsSection } from '@/components/resume/skills/SkillsSection';
import { useEffect } from 'react';

export default function Page() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    return (
        <div className="relative w-full h-full">
            <ResumeNavigationSidebar />
            <div className="w-full h-auto flex flex-col items-center gap-16 px-24 pb-32">
                <AboutSection id="about" />
                <SkillsSection id="skills" />
                <ExperiencesSection id="experiences" />
                <EducationsSection id="educations" />
            </div>
        </div>
    );
}
