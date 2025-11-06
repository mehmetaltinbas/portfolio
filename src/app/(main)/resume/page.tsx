'use client';

import Experiences from '@/components/Experiences';
import { useAppSelector } from '@/store/hooks';

export default function Page() {
    const user = useAppSelector(state => state.user);

    return (
        <div className="w-full h-full flex flex-col items-center gap-16 px-24">
            <div className="w-[700px] grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
                <div className="w-full flex justify-between items-center gap-6">
                    <p className="text-xl font-bold whitespace-nowrap">About</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div></div>
                <div className="w-full mx-auto flex flex-col justify-center items-center gap-2">
                    <p>{user.about}</p>
                    <p className="underline">Skills</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {user.skills.map((skill, index) => (
                            <p key={`skill-${index}-${skill}`}>{skill}</p>
                        ))}
                    </div>
                </div>
                <div className="w-full mx-auto flex justify-center">
                    <img
                    />
                </div>
            </div>

            <div className="w-[700px] grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                <div className="w-full md:col-span-2 flex justify-between items-center gap-6">
                    <p className="text-xl font-bold">Experience</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div className="w-full md:col-span-3 flex flex-col justify-start items-start">
                    <Experiences user={user} />
                </div>
            </div>
        </div>
    );
}
