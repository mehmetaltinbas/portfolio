'use client';

import { ExtendedUserRow } from '@/types/db/extended-user-row';

export default function Experiences({ user }: { user: ExtendedUserRow }) {
    return (
        <div className="flex flex-col justify-center items-start gap-4">
            {user.experiences.map((experience, index) => (
                <div key={`experience-${index}`} className="flex flex-col justify-center items-start gap-2">
                    <p>
                        {experience.title} - {experience.company}
                    </p>
                    <p>
                        {experience.startDate.toString()} - {experience.endDate.toString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
