'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { UserImagePlace } from '@/enums/user-image-place.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { ExperienceRow } from '@/types/db/experience-row';
import { DeleteUserImageDto } from '@/types/dto/user-image/delete-user-image.dto';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { ResponseBase } from '@/types/response/response-base';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export default function Page() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isAboutEditMode, setIsAboutEditMode] = useState<boolean>(false);
    const [isExperienceEditMode, setIsExperienceEditMode] = useState<boolean>(false);
    const [profileInfo, setProfileInfo] = useState<UpdateUserDto>({
        about: user.about ?? undefined,
        skills: user.skills ?? [],
    });
    const [skillsInput, setSkillsInput] = useState<string>(user.skills?.join(', ') ?? '');
    const [userImageFile, setUserImageFile] = useState<File | null>(null);
    const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
    const [experienceForm, setExperienceForm] = useState<Partial<CreateExperienceDto & { id?: string }>>({});
    const [isAddingExperience, setIsAddingExperience] = useState<boolean>(false);

    function toggleAboutEditMode() {
        setProfileInfo({
            about: user.about ?? undefined,
            skills: user.skills ?? [],
        });
        setSkillsInput(user.skills?.join(', ') ?? '');
        setUserImageFile(null);
        setIsAboutEditMode((prev) => !prev);
    }

    function toggleExperienceEditMode() {
        setEditingExperienceId(null);
        setExperienceForm({});
        setIsAddingExperience(false);
        setIsExperienceEditMode((prev) => !prev);
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

    async function onAboutSave() {
        await updateProfileInfo();
        await upsertUserImage();
        toggleAboutEditMode();
    }

    function handleExperienceFormChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.currentTarget;
        setExperienceForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function startEditExperience(experience: ExperienceRow) {
        setEditingExperienceId(experience.id);
        setExperienceForm({
            id: experience.id,
            title: experience.title,
            company: experience.company,
            isCurrent: experience.isCurrent,
            startDate: new Date(experience.startDate).toISOString().split('T')[0],
            endDate: new Date(experience.endDate).toISOString().split('T')[0],
        });
        setIsAddingExperience(false);
    }

    function startAddExperience() {
        setIsAddingExperience(true);
        setEditingExperienceId(null);
        setExperienceForm({
            title: '',
            company: '',
            isCurrent: false,
            startDate: '',
            endDate: '',
        });
    }

    function cancelExperienceEdit() {
        setEditingExperienceId(null);
        setIsAddingExperience(false);
        setExperienceForm({});
    }

    async function createExperience() {
        if (!experienceForm.title || !experienceForm.company || !experienceForm.startDate) {
            alert('Please fill in title, company, and start date');
            return;
        }

        const response: ResponseBase = await (
            await fetch('/api/admin/experience/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienceForm),
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
            cancelExperienceEdit();
        } else {
            alert(response.message);
        }
    }

    async function updateExperience() {
        const response: ResponseBase = await (
            await fetch('/api/admin/experience/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienceForm),
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
            cancelExperienceEdit();
        } else {
            alert(response.message);
        }
    }

    async function deleteExperience(id: string) {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        const response: ResponseBase = await (
            await fetch('/api/admin/experience/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
        ).json();

        if (response.isSuccess) {
            await dispatch(userActions.refresh());
        } else {
            alert(response.message);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-16 px-24">
            <div className="relative w-[700px] grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
                {isAdmin && !isAboutEditMode && (
                    <Button onClick={toggleAboutEditMode} className="absolute top-2 right-2">
                        Edit
                    </Button>
                )}
                {isAboutEditMode && (
                    <Button onClick={onAboutSave} className="absolute top-2 right-2">
                        Save
                    </Button>
                )}
                <div className="w-full flex justify-between items-center gap-6">
                    <p className="text-xl font-bold whitespace-nowrap">About</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div></div>
                <div
                    className="w-full mx-auto flex flex-col justify-start items-center gap-8"
                >
                    {!isAboutEditMode ? (
                        <>
                            <p>{user.about}</p>
                            <div
                                className='flex flex-col justify-start items-center gap-2'
                            >
                                <p className="font-semibold underline">Skills</p>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.skills.map((skill, index) => (
                                        <p key={`skill-${index}-${skill}`}>
                                            <span className='flex-semibold'>-</span> {skill}
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
                            <div
                                className='flex flex-col justify-start items-center gap-2'
                            >
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
                    {!isAboutEditMode ? (
                        user.userImages.find((userImage) => userImage.place === UserImagePlace.RESUME_PAGE)?.url && (
                            <Image
                                src={
                                    user.userImages.find((userImage) => userImage.place === UserImagePlace.RESUME_PAGE)!.url
                                }
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
                                    user.userImages.find((userImage) => userImage.place === UserImagePlace.RESUME_PAGE)?.url ??
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

            <div className="relative w-[700px] grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                {isAdmin && !isExperienceEditMode && (
                    <Button onClick={toggleExperienceEditMode} className="absolute top-2 right-2">
                        Edit
                    </Button>
                )}
                {isExperienceEditMode && (
                    <Button onClick={toggleExperienceEditMode} className="absolute top-2 right-2">
                        Done
                    </Button>
                )}
                <div className="w-full md:col-span-2 flex justify-between items-center gap-6">
                    <p className="text-xl font-bold">Experience</p>
                    <span className="w-full h-[1px] bg-blue-700"></span>
                </div>
                <div className="w-full md:col-span-3 flex flex-col justify-start items-start gap-4">
                    {user.experiences.map((experience) => (
                        <div key={experience.id} className="w-full flex flex-col gap-2">
                            {editingExperienceId === experience.id ? (
                                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                                    <Input
                                        name="title"
                                        value={experienceForm.title ?? ''}
                                        onChange={handleExperienceFormChange}
                                        placeholder="Title"
                                    />
                                    <Input
                                        name="company"
                                        value={experienceForm.company ?? ''}
                                        onChange={handleExperienceFormChange}
                                        placeholder="Company"
                                    />
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="isCurrent"
                                                checked={experienceForm.isCurrent ?? false}
                                                onChange={handleExperienceFormChange}
                                            />
                                            Current
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            name="startDate"
                                            type="date"
                                            value={experienceForm.startDate ?? ''}
                                            onChange={handleExperienceFormChange}
                                        />
                                        <Input
                                            name="endDate"
                                            type="date"
                                            value={experienceForm.endDate ?? ''}
                                            onChange={handleExperienceFormChange}
                                            disabled={experienceForm.isCurrent}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={updateExperience}>Save</Button>
                                        <Button onClick={cancelExperienceEdit}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p>
                                            {experience.title} - {experience.company}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(experience.startDate).toLocaleDateString()} -{' '}
                                            {experience.isCurrent
                                                ? 'Present'
                                                : new Date(experience.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {isExperienceEditMode && (
                                        <div className="flex gap-2">
                                            <Button onClick={() => startEditExperience(experience)}>Edit</Button>
                                            <Button
                                                className="bg-red-700 border-transparent hover:text-red-700 hover:border-red-700"
                                                onClick={() => deleteExperience(experience.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {isAddingExperience && (
                        <div className="w-full flex flex-col gap-2 p-4 border rounded-lg">
                            <Input
                                name="title"
                                value={experienceForm.title ?? ''}
                                onChange={handleExperienceFormChange}
                                placeholder="Title"
                            />
                            <Input
                                name="company"
                                value={experienceForm.company ?? ''}
                                onChange={handleExperienceFormChange}
                                placeholder="Company"
                            />
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isCurrent"
                                        checked={experienceForm.isCurrent ?? false}
                                        onChange={handleExperienceFormChange}
                                    />
                                    Current
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    name="startDate"
                                    type="date"
                                    value={experienceForm.startDate ?? ''}
                                    onChange={handleExperienceFormChange}
                                />
                                <Input
                                    name="endDate"
                                    type="date"
                                    value={experienceForm.endDate ?? ''}
                                    onChange={handleExperienceFormChange}
                                    disabled={experienceForm.isCurrent}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={createExperience}>Add</Button>
                                <Button onClick={cancelExperienceEdit}>Cancel</Button>
                            </div>
                        </div>
                    )}

                    {isExperienceEditMode && !isAddingExperience && !editingExperienceId && (
                        <Button onClick={startAddExperience}>+ Add Experience</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
