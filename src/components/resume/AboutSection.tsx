'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
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
    const [profileInfo, setProfileInfo] = useState<UpdateUserDto>({
        about: user.about ?? undefined,
        skills: user.skills ?? [],
    });
    const [skillsInput, setSkillsInput] = useState<string>(user.skills?.join(', ') ?? '');
    const [userImageFile, setUserImageFile] = useState<File | null>(null);

    function toggleEditMode() {
        setProfileInfo({
            about: user.about ?? undefined,
            skills: user.skills ?? [],
        });
        setSkillsInput(user.skills?.join(', ') ?? '');
        setUserImageFile(null);
        setIsEditMode((prev) => !prev);
    }

    function handleAboutChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value;
        console.log("value: ", value);
        setProfileInfo((prev) => ({
            ...prev,
            about: value,
        }));
    }

    function handleSkillsChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        setSkillsInput(value);
        setProfileInfo((prev) => ({
            ...prev,
            skills: value.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        }));
    }

    async function updateProfileInfo() {
        const response: ResponseBase = await (
            await fetch('/api/admin/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileInfo),
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
    }

    async function onSave() {
        await updateProfileInfo();
        await upsertUserImage();
        toggleEditMode();
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
                <Button onClick={onSave} className="absolute top-2 right-2">
                    Save
                </Button>
            )}
            <SectionHeader title="About" />

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-6">
                {/* Text Content - Left on desktop, top on mobile */}
                <div className="flex-1 flex flex-col gap-6">
                    {!isEditMode ? (
                        <>
                            {/* About Me Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">About Me</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{user.about}</p>
                            </div>

                            {/* Skills Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Skills</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <span
                                            key={`skill-${index}-${skill}`}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* About Me Edit */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">About Me</h3>
                                </div>
                                <TextArea
                                    name="about"
                                    onChange={handleAboutChange}
                                    value={profileInfo.about ?? ''}
                                    rows={6}
                                    className="w-full resize-y min-h-[120px] whitespace-pre-wrap break-words"
                                    placeholder="About..."
                                />
                            </div>

                            {/* Skills Edit */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Skills</h3>
                                </div>
                                <Input
                                    name="skills"
                                    onChange={handleSkillsChange}
                                    value={skillsInput}
                                    className="w-full"
                                    placeholder="Skills (comma-separated)..."
                                />
                                {/* Skill Preview */}
                                {profileInfo.skills && profileInfo.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {profileInfo.skills.map((skill, index) => (
                                            <span
                                                key={`skill-preview-${index}-${skill}`}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Image - Right on desktop, bottom on mobile */}
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
