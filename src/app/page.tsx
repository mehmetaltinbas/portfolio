import Image from "next/image";

export default function Page() {
    return (
        <div className="w-auto h-full grid grid-cols-1 md:grid-cols-2 gap-16 p-12">
            <div className="flex justify-center items-center">
                <Image
                    src='/batfleck-symbol.jpg'
                    width={200}
                    height={200}
                    className=""
                    alt="profile photo"
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-2xl font-bold text-center text-[#003366]">
                    full name
                </p>
                <p className="text-l font-semibold text-center text-[#174978]">headline</p>
                <p className="text-center">bio</p>
                <button className="py-1 px-4 border-[1px] border-gray rounded-full hover:border-black">
                    Download CV
                </button>
            </div>
        </div>
    );
}
