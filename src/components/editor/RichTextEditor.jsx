import { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, onImageUpload, placeholder = 'Write your article content...' }) => {
    const quillRef = useRef(null);
    const uploadRef = useRef(onImageUpload);

    // Keep ref updated with latest callback
    uploadRef.current = onImageUpload;

    // Custom image handler
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file && uploadRef.current) {
                try {
                    // Save current selection range
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);

                    // Insert temporary loading placeholder (optional, but good UX)
                    quill.insertText(range.index, 'Uploading image...', 'bold', true);

                    // Upload
                    const url = await uploadRef.current(file);

                    // Remove placeholder
                    quill.deleteText(range.index, 16); // length of 'Uploading image...'

                    // Insert image
                    quill.insertEmbed(range.index, 'image', url);

                    // Move cursor after image
                    quill.setSelection(range.index + 1);
                } catch (error) {
                    console.error('Image upload failed', error);
                    alert('Failed to upload image: ' + error.message);
                }
            }
        };
    };

    // Custom video handler
    const videoHandler = () => {
        const url = prompt('Enter video URL (YouTube, Vimeo):');
        if (url) {
            let finalUrl = url;

            // Convert YouTube watch URL to embed URL
            // Pattern: https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
            if (url.includes('youtube.com/watch?v=')) {
                finalUrl = url.replace('watch?v=', 'embed/');
                // Remove any other query params
                if (finalUrl.includes('&')) {
                    finalUrl = finalUrl.split('&')[0];
                }
            }
            // Pattern: https://youtu.be/VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
            else if (url.includes('youtu.be/')) {
                finalUrl = url.replace('youtu.be/', 'youtube.com/embed/');
            }

            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'video', finalUrl);
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                [{ 'align': [] }],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
                video: videoHandler
            }
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'blockquote', 'code-block',
        'align'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
