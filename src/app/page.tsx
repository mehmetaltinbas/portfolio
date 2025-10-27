export default function Home() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div className="flex flex-col justify-center items-center gap-2">
                <img
                    className="w-[200px] h-[200px] object-cover rounded-full"
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-2xl font-bold text-center text-[#003366]">
                    first and last name
                </p>
                <p className="text-l font-semibold text-center text-[#174978]">position</p>
                <p className="text-center">bio</p>
                <button
                    className="py-1 px-4 border-[1px] border-gray rounded-full hover:border-black"
                >
                    Download CV
                </button>
            </div>
        </div>
    );
}
