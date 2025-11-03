'use client';

import { useState } from 'react';
import { UserRow } from '@/types/db-row/user.row';

export default function Experiences({ user }: { user: UserRow }) {
    const [selectedExperience, setSelectedExperience] = useState();

    function SelectExperience(experienceId: string) {
        const experience = user.experiences.find((e) => e._id == experienceId);
        setSelectedExperience(experience);
    }

    return (
        <div className="flex justify-center items-start gap-2">
            <div className="flex flex-col justify-start items-start">
                {user.experiences?.map((experience) => (
                    <div
                        key={experience._id}
                        data-id={experience._id}
                        onClick={() => SelectExperience(experience._id)}
                        className={`flex justify-center items-center gap-2
                    cursor-pointer hover:bg-blue-100 transition`}
                    >
                        <span
                            id={experience._id}
                            className={`w-[2px] h-[32px] bg-black ${selectedExperience._id === experience._id ? 'bg-blue-400' : ''}`}
                        ></span>
                        <p className="w-[100px] font-medium">{experience.company}</p>
                    </div>
                ))}
            </div>
            <div
                className={`
            flex flex-col justify-start items-start gap-2`}
            >
                <div className="">
                    <p className="text-lg font-medium">
                        {selectedExperience?.position}{' '}
                        <a
                            href={selectedExperience?.websiteLink}
                            target="_blank"
                            className="text-blue-800 hover:text-purple-800 underline"
                        >
                            @{selectedExperience?.company}
                        </a>
                    </p>
                    <p className="text-sm font-light">
                        {selectedExperience?.startDate} - {selectedExperience?.endDate}
                    </p>
                </div>

                {selectedExperience?.tasks?.map((task) => (
                    <p>- {task}</p>
                ))}
            </div>
        </div>
    );
}
