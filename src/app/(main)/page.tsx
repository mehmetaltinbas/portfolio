'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { UserImagePlace } from '@/enums/user-image-place.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
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
    const [file, setFile] = useState<File | null>(null);

    function toggleEditMode() {
        setProfileInfo({
            fullName: user.fullName,
            headline: user.headline,
            bio: user.bio
        });
        setIsEditMode(prev => !prev);
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
            alert(response.message);
        }
    }

    async function upsertUserImage() {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('place', UserImagePlace.LANDING_PAGE);

        const response: ResponseBase = await (await fetch('/api/admin/user-image/upsert', {
            method: 'POST',
            body: formData,
        })).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        }
        alert(response.message);

        setFile(null);
    }

    async function deleteUserImage() {
        const response: ResponseBase = await (await fetch('/api/admin/user-image/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ place: UserImagePlace.LANDING_PAGE } as DeleteUserImageDto),
        })).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
            setFile(null);
        }
        alert(response.message);
    }

    async function onSave() {
        await updateProfileInfo();
        await upsertUserImage();
        toggleEditMode();
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
                                    `/default-avatar-profile-icon.jpg`
                                }
                                width={200}
                                height={200}
                                className="rounded-full"
                                alt="profile photo"
                            />
                        </div>

                        <div className="h-full flex flex-col justify-start items-center gap-2 py-2">
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
                        <Button
                            onClick={onSave} 
                            className='absolute top-2 right-2'
                        >
                            Save
                        </Button>

                        <div className="relative w-full h-full flex justify-center items-start">
                            <Image
                                src={
                                    (file ? URL.createObjectURL(file) : null) ??
                                    user.userImages.find(userImage => userImage.place === UserImagePlace.LANDING_PAGE)?.url ?? 
                                    `/default-avatar-profile-icon.jpg`
                                }
                                width={200}
                                height={200}
                                className="rounded-full"
                                alt="profile photo"
                            />
                            <div className='absolute top-2 left-2 flex flex-col justify-center items-center gap-2'>
                                <label 
                                    className='cursor-pointer right-0 px-2 py-0.5 
                                    border-2 border-black rounded-[10px]
                                    bg-black text-white text-s
                                    hover:bg-white hover:text-black
                                        duration-300'
                                >
                                    Edit
                                    <input
                                        name='file'
                                        type='file'
                                        className='hidden'
                                        onChange={event => {
                                            if (event.currentTarget.files?.[0].type.startsWith('image/'))
                                                setFile(event.currentTarget.files?.[0] ?? null);
                                            else alert('uploaded file should be in type of image');
                                        }}
                                    />
                                </label>
                                <Button
                                    className='bg-red-700 border-[1px] border-transparent 
                                        hover:text-red-700 hover:border-red-700'
                                    onClick={deleteUserImage}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="w-full h-full flex flex-col justify-start items-center gap-2 py-2">
                            <Input
                                name='fullName'
                                onChange={event => handleOnChange(event)}
                                value={profileInfo.fullName} 
                                className="text-2xl font-bold text-center text-[#003366]"
                                placeholder='fullname...'
                            />
                            <TextArea
                                name='headline'
                                onChange={event => handleOnChange(event)}
                                value={profileInfo.headline}
                                className="w-full text-l font-semibold text-center text-[#174978] resize-none whitespace-pre-wrap break-words"
                                placeholder='headline...' 
                            />
                            <TextArea
                                name='bio'
                                onChange={event => handleOnChange(event)}
                                value={profileInfo.bio}
                                className="w-full text-center resize-none whitespace-pre-wrap break-words"
                                placeholder='bio...'
                            />
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
