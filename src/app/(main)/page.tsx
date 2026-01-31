'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { UserImagePlace } from '@/enums/user-image-place.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isAdminActions } from '@/store/slices/is-admin-slice';
import { userActions } from '@/store/slices/user-slice';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

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

    function resetProfileInfo() {
        setProfileInfo({
            fullName: user.fullName,
            headline: user.headline,
            bio: user.bio
        });
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setProfileInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function updateProfileInfo() {
        const response: ResponseBase = await (await fetch('/api/admin/user/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileInfo),
        })).json();
        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else if (!response.isSuccess) {
            dispatch(isAdminActions.set(false));
            resetProfileInfo();
            alert(response.message);
        }
    }

    function toggleEditMode() {
        setIsEditMode(prev => !prev);
    }

    return (
        <div className='w-full h-full flex justify-center items-start'>
            <div className="relative w-[700px] h-[300px] grid grid-cols-1 md:grid-cols-2 gap-0 pt-10">
                {!isEditMode ? (
                    <>
                        {isAdmin && <Button onClick={toggleEditMode} className='absolute top-2 right-2'>Edit</Button>}

                        <div className="h-full flex justify-center items-start">
                            <Image
                                src={
                                    user.userImages.find(userImage => userImage.place === UserImagePlace.LANDING_PAGE)?.url 
                                    ?? 
                                    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/default-avatar-profile-icon.jpg`
                                }
                                width={200}
                                height={200}
                                className="rounded-full"
                                alt="profile photo"
                            />
                        </div>

                        <div className="h-full flex flex-col justify-start items-center gap-2">
                            <p className="text-2xl font-bold text-center text-[#003366]">{user.fullName}</p>
                            <p className="text-l font-semibold text-center text-[#174978]">{user.headline}</p>
                            <p className="text-center">{user.bio}</p>
                            <Button>
                                Download CV
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Button onClick={event => { updateProfileInfo(); toggleEditMode(); }} className='absolute top-2 right-2'>Save</Button>

                        <div className="w-full h-full flex justify-center items-start">
                            <Image
                                src="/batfleck-symbol.jpg"
                                width={200}
                                height={200}
                                className="rounded-[10px]"
                                alt="profile photo"
                            />
                        </div>

                        <div className="w-[200px] h-full  flex flex-col justify-start items-center gap-2">
                            <Input name='fullName' onChange={event => handleOnChange(event)} value={profileInfo.fullName} className="text-2xl font-bold text-center text-[#003366]" placeholder='fullname...' />
                            <textarea name='headline' onChange={event => handleOnChange(event)} value={profileInfo.headline} className="w-full text-l font-semibold text-center text-[#174978] resize-none whitespace-pre-wrap break-words" placeholder='headline...' />
                            <textarea name='bio' onChange={event => handleOnChange(event)} value={profileInfo.bio} className="w-full text-center resize-none whitespace-pre-wrap break-words" placeholder='bio...' />
                            <Button>
                                Download CV
                            </Button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
