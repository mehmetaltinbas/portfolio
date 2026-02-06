'use client';

import { Button } from '@/components/Button';
import { TextArea } from '@/components/TextArea';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { UserImagePlace } from '@/enums/user-image-place.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export function AboutSection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [about, setAbout] = useState<string>(user.about ?? '');
    const [userImageFile, setUserImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    function toggleEditMode() {
        setAbout(user.about ?? '');
        setUserImageFile(null);
        setIsEditMode((prev) => !prev);
    }

    function handleAboutChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value;
        setAbout(value);
    }

    async function updateProfileInfo() {
        const dto: UpdateUserDto = { about: about || undefined };
        const response: ResponseBase = await (
            await fetch('/api/admin/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            })
        ).json();
        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }
    }

    async function upsertUserImage() {
        if (!userImageFile) return;

        const formData = new FormData();
        formData.append('file', userImageFile);
        formData.append('place', UserImagePlace.RESUME_PAGE);

        const response: ResponseBase = await (
            await fetch('/api/admin/user-image/upsert', {
                method: 'POST',
                body: formData,
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }

        setUserImageFile(null);
    }

    async function deleteUserImage() {
        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/user-image/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ place: UserImagePlace.RESUME_PAGE } as DeleteUserImageDto),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setUserImageFile(null);
            }
            alert(response.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function onSave() {
        setIsSaving(true);
        try {
            await updateProfileInfo();
            await upsertUserImage();
            toggleEditMode();
        } finally {
            setIsSaving(false);
        }
    }

    const resumeImageUrl = user.userImages.find(
        (userImage) => userImage.place === UserImagePlace.RESUME_PAGE
    )?.url;

    return (
        <div className="relative w-full max-w-[700px] py-10 px-4 md:px-0">
            {isAdmin && !isEditMode && (
                <Button onClick={toggleEditMode} className="absolute top-2 right-2">
                    Edit
                </Button>
            )}
            {isEditMode && (
                <Button onClick={onSave} className="absolute top-2 right-2" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            )}
            <SectionHeader title={(
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>About</p>
                </>
            )} />

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-6">
                <div className="flex-1 flex flex-col gap-6">
                    {!isEditMode ? (
                        <p className="leading-relaxed">{user.about}</p>
                    ) : (
                        <TextArea
                            name="about"
                            onChange={handleAboutChange}
                            value={about}
                            rows={6}
                            className="w-full resize-y min-h-[120px] whitespace-pre-wrap break-words"
                            placeholder="About..."
                        />
                    )}
                </div>

                <div className="flex justify-center md:order-2">
                    {!isEditMode ? (
                        resumeImageUrl && (
                            <Image
                                src={resumeImageUrl}
                                width={180}
                                height={240}
                                className="rounded-lg border border-gray-200 shadow-sm object-cover"
                                alt="resume photo"
                            />
                        )
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Image
                                src={
                                    (userImageFile ? URL.createObjectURL(userImageFile) : null) ??
                                    resumeImageUrl ??
                                    '/default-avatar-profile-icon.jpg'
                                }
                                width={180}
                                height={240}
                                className="rounded-lg border border-gray-200 shadow-sm object-cover"
                                alt="resume photo"
                            />
                            <div className="flex gap-2">
                                <label
                                    className="cursor-pointer px-3 py-1.5
                                    border-2 border-gray-800 rounded-lg
                                    bg-gray-800 text-white text-sm font-medium
                                    hover:bg-white hover:text-gray-800
                                    transition-colors duration-300"
                                >
                                    Change
                                    <input
                                        name="file"
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => {
                                            if (event.currentTarget.files?.[0].type.startsWith('image/'))
                                                setUserImageFile(event.currentTarget.files?.[0] ?? null);
                                            else alert('uploaded file must be type of image');
                                        }}
                                    />
                                </label>
                                <Button
                                    className="bg-red-800 border-transparent hover:bg-white hover:text-red-800 hover:border-red-800"
                                    onClick={deleteUserImage}
                                    disabled={isSaving}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
