'use client';

import { Button } from '@/components/Button';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { ExperienceItem } from '@/components/resume/ExperienceItem';
import { SectionHeader } from '@/components/resume/SectionHeader';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ExperienceRow } from '@/types/db/experience-row';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { ResponseBase } from '@/types/response/response-base';
import { ChangeEvent, useState } from 'react';

export function ExperiencesSection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
    const [experienceForm, setExperienceForm] = useState<Partial<CreateExperienceDto & { id?: string }>>({});
    const [isAddingExperience, setIsAddingExperience] = useState<boolean>(false);

    function toggleEditMode() {
        setEditingExperienceId(null);
        setExperienceForm({});
        setIsAddingExperience(false);
        setIsEditMode((prev) => !prev);
    }

    function handleFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = event.currentTarget;
        const checked = event.currentTarget instanceof HTMLInputElement
            ? event.currentTarget.checked
            : undefined;
        setExperienceForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function startEdit(experience: ExperienceRow) {
        setEditingExperienceId(experience.id);
        setExperienceForm({
            id: experience.id,
            title: experience.title,
            company: experience.company,
            isCurrent: experience.isCurrent,
            startDate: new Date(experience.startDate).toISOString().slice(0, 7),
            endDate: experience.endDate === null ? undefined : new Date(experience.endDate!).toISOString().slice(0, 7),
        });
        setIsAddingExperience(false);
    }

    function startAdd() {
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

    function cancelEdit() {
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
            cancelEdit();
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
            cancelEdit();
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
        <div className="relative w-[700px] grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
            {isAdmin && !isEditMode && (
                <Button onClick={toggleEditMode} className="absolute top-2 right-2">
                    Edit
                </Button>
            )}
            {isEditMode && (
                <Button onClick={toggleEditMode} className="absolute top-2 right-2">
                    Done
                </Button>
            )}
            <div className="md:col-span-2">
                <SectionHeader title="Experience" />
            </div>
            <div className="w-full md:col-span-3 flex flex-col justify-start items-start gap-4">
                {user.experiences.map((experience) => (
                    <div key={experience.id} className="w-full flex flex-col gap-2">
                        {editingExperienceId === experience.id ? (
                            <ExperienceForm
                                form={experienceForm}
                                onChange={handleFormChange}
                                onSave={updateExperience}
                                onCancel={cancelEdit}
                                saveLabel="Save"
                            />
                        ) : (
                            <ExperienceItem
                                experience={experience}
                                isEditMode={isEditMode}
                                onEdit={() => startEdit(experience)}
                                onDelete={() => deleteExperience(experience.id)}
                            />
                        )}
                    </div>
                ))}

                {isAddingExperience && (
                    <ExperienceForm
                        form={experienceForm}
                        onChange={handleFormChange}
                        onSave={createExperience}
                        onCancel={cancelEdit}
                        saveLabel="Add"
                    />
                )}

                {isEditMode && !isAddingExperience && !editingExperienceId && (
                    <Button onClick={startAdd}>+ Add Experience</Button>
                )}
            </div>
        </div>
    );
}
