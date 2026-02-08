'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { contactIconMap } from '@/constants/contact-icon-map.constant';
import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { ButtonVariant } from '@/enums/button-variants.enum';
import { ContactLabel } from '@/enums/contact-label.enum';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ContactRow } from '@/types/db/contact-row';
import { ResponseBase } from '@/types/response/response-base';
import { Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export function Contacts({ contacts }: { contacts: ContactRow[] }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');
    const [editName, setEditName] = useState('');
    const [editValue, setEditValue] = useState('');
    const [addLabel, setAddLabel] = useState<string>(ContactLabel.CUSTOM);
    const [addName, setAddName] = useState('');
    const [addValue, setAddValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    function startEdit(contact: ContactRow) {
        setEditingId(contact.id);
        setEditLabel(contact.label);
        setEditName(contact.name);
        setEditValue(contact.value);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditLabel('');
        setEditName('');
        setEditValue('');
    }

    function handleAddLabelChange(label: string) {
        setAddLabel(label);
        setAddName(label === ContactLabel.CUSTOM ? '' : label);
    }

    function handleEditLabelChange(label: string) {
        setEditLabel(label);
        setEditName(label === ContactLabel.CUSTOM ? '' : label);
    }

    async function createContact() {
        if (!addValue.trim()) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label: addLabel, name: addName, value: addValue }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setAddLabel(ContactLabel.CUSTOM);
                setAddName('');
                setAddValue('');
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function updateContact() {
        if (!editingId) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, label: editLabel, name: editName, value: editValue }),
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
                <a
                    key={contact.id}
                    href={contact.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group text-gray-600 hover:text-black duration-300 text-lg"
                >
                    {contactIconMap[contact.label] ?? contactIconMap[ContactLabel.CUSTOM]}
                    <span className="absolute left-8 top-1/2 -translate-y-1/2
                        bg-black text-white text-xs px-2 py-1 rounded
                        opacity-0 group-hover:opacity-100 transition-opacity duration-100
                        pointer-events-none whitespace-nowrap">
                        {contact.name}
                    </span>
                </a>
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
                                        {editingId === contact.id ? (
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={editLabel}
                                                    onChange={(e) => handleEditLabelChange(e.target.value)}
                                                    className="w-full py-1 px-3 border border-black rounded-[10px] text-s outline-none"
                                                    disabled={isSaving}
                                                >
                                                    {Object.values(ContactLabel).map((label) => (
                                                        <option key={label} value={label}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {editLabel === ContactLabel.CUSTOM && (
                                                    <Input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder="Name"
                                                        disabled={isSaving}
                                                    />
                                                )}
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    placeholder="URL"
                                                    disabled={isSaving}
                                                />
                                                <div className="flex gap-1">
                                                    <Button onClick={updateContact} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                                                        Save
                                                    </Button>
                                                    <Button onClick={cancelEdit} variant={ButtonVariant.SECONDARY} disabled={isSaving}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm shrink-0">
                                                    {contactIconMap[contact.label] ?? contactIconMap[ContactLabel.CUSTOM]}
                                                </span>
                                                <span className="text-xs font-medium shrink-0">
                                                    {contact.name}
                                                </span>
                                                <span className="text-xs text-gray-600 truncate flex-1">
                                                    {contact.value}
                                                </span>
                                                <button
                                                    onClick={() => startEdit(contact)}
                                                    className="text-gray-400 hover:text-black duration-300 cursor-pointer shrink-0"
                                                    disabled={isSaving}
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="text-gray-400 hover:text-red-500 duration-300 cursor-pointer shrink-0"
                                                    disabled={isSaving}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {contacts.length >= MAX_CONTACTS ? (
                                <p className="text-xs text-gray-400">Maximum of {MAX_CONTACTS} contacts reached</p>
                            ) : (
                                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-500 font-medium">Add Contact</p>
                                    <select
                                        value={addLabel}
                                        onChange={(e) => handleAddLabelChange(e.target.value)}
                                        className="w-full py-1 px-3 border border-black rounded-[10px] text-s outline-none"
                                        disabled={isSaving}
                                    >
                                        {Object.values(ContactLabel).map((label) => (
                                            <option key={label} value={label}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {addLabel === ContactLabel.CUSTOM && (
                                        <Input
                                            value={addName}
                                            onChange={(e) => setAddName(e.target.value)}
                                            placeholder="Name"
                                            disabled={isSaving}
                                        />
                                    )}
                                    <Input
                                        value={addValue}
                                        onChange={(e) => setAddValue(e.target.value)}
                                        placeholder="URL"
                                        disabled={isSaving}
                                    />
                                    <Button onClick={createContact} variant={ButtonVariant.PRIMARY} disabled={isSaving}>
                                        Add
                                    </Button>
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
