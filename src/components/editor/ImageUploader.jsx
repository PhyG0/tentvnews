import { useState, useRef } from 'react';
import { optimizeImage, formatFileSize } from '../../utils/imageOptimization';
import './ImageUploader.css';

const ImageUploader = ({ onImageSelect, existingImageUrl, label = 'Cover Image', folder = 'articles' }) => {
    const [preview, setPreview] = useState(existingImageUrl || null);
    const [uploading, setUploading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [error, setError] = useState(null);
    const [optimizationInfo, setOptimizationInfo] = useState(null);
    const fileInputRef = useRef(null);

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB (before optimization)
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size (before optimization)
        if (file.size > MAX_SIZE) {
            setError('Image size must be less than 10MB');
            return;
        }

        setError(null);
        setOptimizing(true);
        setOptimizationInfo(null);

        try {
            // Optimize image to WebP
            const result = await optimizeImage(file, {
                quality: 0.85,
                maxWidth: 1920,
                maxHeight: 1080
            });

            // Create WebP file object
            const webpFile = new File(
                [result.blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                { type: 'image/webp' }
            );

            // Store optimization info for display
            setOptimizationInfo({
                original: formatFileSize(result.originalSize),
                optimized: formatFileSize(result.optimizedSize),
                reduction: result.reduction
            });

            // Create preview from optimized image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(webpFile);

            // Pass optimized file to parent component
            if (onImageSelect) {
                onImageSelect(webpFile);
            }
        } catch (err) {
            console.error('Image optimization error:', err);
            setError('Failed to optimize image. Please try another image.');
        } finally {
            setOptimizing(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        setOptimizationInfo(null);
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

                    {/* Show optimization info */}
                    {optimizationInfo && (
                        <div className="optimization-info" style={{
                            marginTop: '12px',
                            padding: '12px',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '8px',
                            fontSize: '13px'
                        }}>
                            <div style={{ color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>
                                ✓ Image Optimized to WebP
                            </div>
                            <div style={{ color: '#4b5563' }}>
                                {optimizationInfo.original} → {optimizationInfo.optimized}
                                <span style={{ color: '#16a34a', fontWeight: '600', marginLeft: '8px' }}>
                                    ({optimizationInfo.reduction}% smaller)
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        className="remove-button"
                        onClick={handleRemove}
                        style={{ marginTop: optimizationInfo ? '12px' : '0' }}
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
