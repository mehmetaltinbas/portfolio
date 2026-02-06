'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { UpdateUserDto } from '@/types/dto/user/update-user.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ChangeEvent, useState } from 'react';

export function SkillsSection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [skills, setSkills] = useState<string[]>(user.skills ?? []);
    const [skillsInput, setSkillsInput] = useState<string>(user.skills?.join(', ') ?? '');
    const [isSaving, setIsSaving] = useState(false);

    function toggleEditMode() {
        setSkills(user.skills ?? []);
        setSkillsInput(user.skills?.join(', ') ?? '');
        setIsEditMode((prev) => !prev);
    }

    function handleSkillsChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        setSkillsInput(value);
        setSkills(value.split(',').map((s) => s.trim()).filter((s) => s.length > 0));
    }

    async function updateSkills() {
        const dto: UpdateUserDto = { skills };
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

    async function onSave() {
        setIsSaving(true);
        try {
            await updateSkills();
            toggleEditMode();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="relative w-full max-w-[700px] py-10 px-4 md:px-0">
            {isAdmin && !isEditMode && (
                <div className="absolute top-2 right-2">
                    <Button onClick={toggleEditMode} variant={ButtonVariant.PRIMARY}>
                        Edit
                    </Button>
                </div>
            )}
            {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-2">
                    <Button onClick={onSave} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={toggleEditMode} variant={ButtonVariant.SECONDARY}>Cancel</Button>
                </div>
            )}
            <SectionHeader
                title={(
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <p>Skills</p>
                    </>
                )}
            />

            <div className="mt-6">
                {!isEditMode ? (
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
                ) : (
                    <div>
                        <Input
                            name="skills"
                            onChange={handleSkillsChange}
                            value={skillsInput}
                            className="w-full"
                            placeholder="Skills (comma-separated)..."
                        />
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {skills.map((skill, index) => (
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
                )}
            </div>
        </div>
    );
}
