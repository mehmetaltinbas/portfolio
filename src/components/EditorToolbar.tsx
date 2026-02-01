'use client';

import { Editor } from '@tiptap/react';

export default function EditorToolbar({ editor }: { editor: Editor }) {
    const addImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

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
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            >
                H2
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
            <button onClick={addImage} className="px-3 py-1 rounded">
                Image
            </button>
        </div>
    );
}
