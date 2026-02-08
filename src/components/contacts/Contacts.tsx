'use client';

import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactItem } from '@/components/contacts/ContactItem';
import { ContactLink } from '@/components/contacts/ContactLink';
import { DEFAULT_ADD_FORM } from '@/constants/default-add-form-values.constant';
import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ContactFormData } from '@/types/contact-form-data.interface';
import { ContactRow } from '@/types/db/contact-row';
import { ResponseBase } from '@/types/response/response-base';
import { Pencil, X } from 'lucide-react';
import React, { useState } from 'react';

export function Contacts({ contacts }: { contacts: ContactRow[] }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [addForm, setAddForm] = useState<ContactFormData>(DEFAULT_ADD_FORM);
    const [editForm, setEditForm] = useState<(ContactFormData & { id: string }) | null>(null);

    function updateForm(
        setter: React.Dispatch<React.SetStateAction<any>>,
        field: string,
        value: string,
    ) {
        setter((prev: any) => {
            const next = { ...prev, [field]: value };
            if (field === 'label') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                next.name = value === ContactLabel.CUSTOM ? '' : value;
            }
            return next;
        });
    }

    function startEdit(contact: ContactRow) {
        setEditForm({ id: contact.id, label: contact.label, name: contact.name, value: contact.value });
    }

    function cancelEdit() {
        setEditForm(null);
    }

    async function createContact() {
        if (!addForm.value.trim()) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label: addForm.label, name: addForm.name, value: addForm.value }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setAddForm(DEFAULT_ADD_FORM);
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function updateContact() {
        if (!editForm) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editForm.id, label: editForm.label, name: editForm.name, value: editForm.value }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                cancelEdit();
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteContact(id: string) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/delete', {
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
        } finally {
            setIsSaving(false);
        }
    }

    return (contacts.length !== 0 || isAdmin ? (
        <div
            className="fixed left-8 bottom-8 z-50
                flex flex-col gap-4 justify-center items-center"
        >
            {contacts.map((contact) => (
                <ContactLink key={contact.id} contact={contact} />
            ))}

            <span className="block w-[2px] h-[75px] rounded-full bg-black"></span>

            {isAdmin && (
                <div className="relative">
                    <button
                        onClick={() => setIsPanelOpen((prev) => !prev)}
                        className="text-gray-400 hover:text-black duration-300 cursor-pointer"
                    >
                        <Pencil size={14} />
                    </button>

                    {isPanelOpen && (
                        <div className="absolute left-12 bottom-0 w-[350px] bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-sm">Contacts</h3>
                                <button
                                    onClick={() => {
                                        setIsPanelOpen(false);
                                        cancelEdit();
                                    }}
                                    className="text-gray-400 hover:text-black duration-300 cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 mb-3">
                                {contacts.map((contact) => (
                                    <div key={contact.id}>
                                        {editForm?.id === contact.id ? (
                                            <ContactForm
                                                form={editForm}
                                                onFieldChange={(field, value) => updateForm(setEditForm, field, value)}
                                                onSave={updateContact}
                                                onCancel={cancelEdit}
                                                saveLabel="Save"
                                                isSaving={isSaving}
                                            />
                                        ) : (
                                            <ContactItem
                                                contact={contact}
                                                onEdit={() => startEdit(contact)}
                                                onDelete={() => deleteContact(contact.id)}
                                                isSaving={isSaving}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {contacts.length >= MAX_CONTACTS ? (
                                <p className="text-xs text-gray-400">Maximum of {MAX_CONTACTS} contacts reached</p>
                            ) : (
                                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-500 font-medium">Add Contact</p>
                                    <ContactForm
                                        form={addForm}
                                        onFieldChange={(field, value) => updateForm(setAddForm, field, value)}
                                        onSave={createContact}
                                        onCancel={() => setAddForm(DEFAULT_ADD_FORM)}
                                        saveLabel="Add"
                                        isSaving={isSaving}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
        ) : (
            <></>
        )
    );
}
