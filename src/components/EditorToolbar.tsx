'use client';

import { UploadPortfolioItemImageResponse } from '@/types/response/portfolio-item/upload-portfolio-item-image.response';
import { Editor } from '@tiptap/react';
import { ChangeEvent, useRef, useState } from 'react';

export default function EditorToolbar({ editor, portfolioItemId }: { editor: Editor; portfolioItemId: string }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function addImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('File must be an image');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('portfolioItemId', portfolioItemId);

            const response: UploadPortfolioItemImageResponse = await (
                await fetch('/api/admin/portfolio-item/image/upload', {
                    method: 'POST',
                    body: formData,
                })
            ).json();

            if (response.isSuccess && response.url) {
                editor.chain().focus().setImage({ src: response.url }).run();
            } else {
                alert(response.message || 'Upload failed');
            }
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    return (
        <div className="flex gap-2 mb-4 p-2 border-b sticky top-0 bg-white">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
            >
                Title
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            >
                Subtitle
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            >
                Bullets
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            >
                Numbers
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`px-3 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
            >
                Code
            </button>
            <label
                className={`cursor-pointer px-3 py-1 rounded ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {isUploading ? 'Uploading...' : 'Image'}
                <input
                    ref={fileInputRef}
                    name="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(event) => addImage(event)}
                />
            </label>
        </div>
    );
}
