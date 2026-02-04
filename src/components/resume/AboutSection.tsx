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
        <div className="relative w-[700px] grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
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
            <div></div>
            <div className="w-full mx-auto flex flex-col justify-start items-center gap-8">
                {!isEditMode ? (
                    <>
                        <p>{user.about}</p>
                        <div className="flex flex-col justify-start items-center gap-2">
                            <p className="font-semibold underline">Skills</p>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {user.skills.map((skill, index) => (
                                    <p key={`skill-${index}-${skill}`}>
                                        <span className="flex-semibold">-</span> {skill}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <TextArea
                            name="about"
                            onChange={handleAboutChange}
                            value={profileInfo.about ?? ''}
                            className="w-full text-center resize-none whitespace-pre-wrap break-words"
                            placeholder="About..."
                        />
                        <div className="flex flex-col justify-start items-center gap-2">
                            <p className="font-semibold underline">Skills</p>
                            <Input
                                name="skills"
                                onChange={handleSkillsChange}
                                value={skillsInput}
                                className="w-full text-center"
                                placeholder="Skills (comma-separated)..."
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="w-full mx-auto flex justify-center">
                {!isEditMode ? (
                    resumeImageUrl && (
                        <Image
                            src={resumeImageUrl}
                            width={200}
                            height={400}
                            className="rounded-[10px]"
                            alt="resume photo"
                        />
                    )
                ) : (
                    <div className="relative flex flex-col items-center gap-2">
                        <Image
                            src={
                                (userImageFile ? URL.createObjectURL(userImageFile) : null) ??
                                resumeImageUrl ??
                                '/default-avatar-profile-icon.jpg'
                            }
                            width={200}
                            height={400}
                            className="rounded-[10px]"
                            alt="resume photo"
                        />
                        <div className="flex gap-2">
                            <label
                                className="cursor-pointer px-2 py-0.5
                                border-2 border-black rounded-[10px]
                                bg-black text-white text-s
                                hover:bg-white hover:text-black
                                duration-300"
                            >
                                Edit
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
                                className="bg-red-700 border-[1px] border-transparent
                                    hover:text-red-700 hover:border-red-700"
                                onClick={deleteUserImage}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
