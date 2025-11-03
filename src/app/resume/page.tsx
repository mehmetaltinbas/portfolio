import Experiences from '@/components/Experiences';

export default function Page() {
    return (
        <div className="flex flex-col gap-16">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
                <div className="w-full flex justify-between items-center gap-6">
                    <p className="text-xl font-bold whitespace-nowrap">About Me</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div></div>
                <div className="w-full mx-auto flex flex-col justify-center items-center gap-2">
                    <p>user about</p>
                    <p className="underline">Skills</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">skills</div>
                </div>
                <div className="w-full mx-auto flex justify-center">
                    <img
                    // user skills
                    />
                </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                <div className="w-full md:col-span-2 flex justify-between items-center gap-6">
                    <p className="text-xl font-bold">Experience</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div className="w-full md:col-span-3 flex flex-col justify-start items-start">
                    {/* <Experiences user={user} /> */}
                </div>
            </div>
        </div>
    );
}
