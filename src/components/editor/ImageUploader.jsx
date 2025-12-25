import { useState, useRef } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageSelect, existingImageUrl, label = 'Cover Image', folder = 'articles' }) => {
    const [preview, setPreview] = useState(existingImageUrl || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            setError('Image size must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Pass file to parent component for upload
        if (onImageSelect) {
            onImageSelect(file);
        }

        setUploading(false);
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImageSelect) {
            onImageSelect(null);
        }
    };

    return (
        <div className="image-uploader">
            <label className="uploader-label">{label}</label>

            {preview ? (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                    <button
                        type="button"
                        className="remove-button"
                        onClick={handleRemove}
                    >
                        Remove Image
                    </button>
                </div>
            ) : (
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                    <div className="upload-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <p className="upload-text">
                        {uploading ? 'Uploading...' : 'Click to upload image'}
                    </p>
                    <p className="upload-hint">JPEG, PNG or WebP (max 5MB)</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
};

export default ImageUploader;
