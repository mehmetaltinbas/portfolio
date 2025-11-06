'use client';

import WhiteButton from '@/components/WhiteButton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import { ChangeEvent, Fragment, useState } from 'react';

export default function Page() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [profileInfo, setProfileInfo] = useState({
        fullName: user.fullName,
        headline: user.headline,
        bio: user.bio
    });

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setProfileInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function updateProfileInfo() {
        const response: ResponseBase = await (await fetch('/api/admin', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileInfo),
        })).json();
        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else if (!response.isSuccess) {
            alert(response.message);
        }
    }

    function toggleEditMode() {
        setIsEditMode(prev => !prev);
    }

    return (
        <div className='w-full h-full flex justify-center items-start'>
            <div className="relative w-[600px] h-[300px] grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                {!isEditMode ? (
                    <Fragment>
                        {/* {isAdmin && */<WhiteButton onClick={toggleEditMode} className='absolute top-0 right-0'>Edit</WhiteButton>}

                        <div className="w-full h-full flex justify-center items-start">
                            <Image
                                src="/batfleck-symbol.jpg"
                                width={200}
                                height={200}
                                className="rounded-[10px]"
                                alt="profile photo"
                            />
                        </div>

                        <div className="w-full h-full flex flex-col justify-start items-center gap-2">
                            <p className="text-2xl font-bold text-center text-[#003366]">{user.fullName}</p>
                            <p className="text-l font-semibold text-center text-[#174978]">{user.headline}</p>
                            <p className="text-center">{user.bio}</p>
                            <button className="py-1 px-4 border-[1px] border-gray rounded-full hover:border-black">
                                Download CV
                            </button>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <WhiteButton onClick={event => { updateProfileInfo(); toggleEditMode(); }} className='absolute top-0 right-0'>Save</WhiteButton>

                        <div className="w-full h-full flex justify-center items-start">
                            <Image
                                src="/batfleck-symbol.jpg"
                                width={200}
                                height={200}
                                className="rounded-[10px]"
                                alt="profile photo"
                            />
                        </div>

                        <div className="w-full h-full  flex flex-col justify-start items-center gap-2">
                            <input name='fullName' onChange={event => handleOnChange(event)} value={profileInfo.fullName} className="w-full text-2xl font-bold text-center text-[#003366]" placeholder='fullname...' />
                            <textarea name='headline' onChange={event => handleOnChange(event)} value={profileInfo.headline} className="w-full text-l font-semibold text-center text-[#174978] resize-none whitespace-pre-wrap break-words" placeholder='headline...' />
                            <textarea name='bio' onChange={event => handleOnChange(event)} value={profileInfo.bio} className="w-full text-center resize-none whitespace-pre-wrap break-words" placeholder='bio...' />
                            <WhiteButton className="py-1 px-4 border-[1px] border-gray rounded-full hover:border-black">
                                Download CV
                            </WhiteButton>
                        </div>
                    </Fragment>
                )}

            </div>
        </div>
    );
}
