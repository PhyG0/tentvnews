import { IMAGE_CONSTRAINTS } from './constants';

// Validate image file type and size
export const validateImageFile = (file) => {
    const errors = [];

    // Check if file exists
    if (!file) {
        errors.push('No file selected');
        return { isValid: false, errors };
    }

    // Check file type
    if (!IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`Invalid file type. Allowed: ${IMAGE_CONSTRAINTS.ALLOWED_TYPES.join(', ')}`);
    }

    // Check file size
    if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE) {
        const maxSizeMB = IMAGE_CONSTRAINTS.MAX_SIZE / (1024 * 1024);
        errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Generate unique filename
export const generateUniqueFilename = (file, prefix = '') => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();

    if (prefix) {
        return `${prefix}-${timestamp}-${randomString}.${extension}`;
    }

    return `${timestamp}-${randomString}.${extension}`;
};

// Get file extension
export const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

// Compress image (client-side) - returns a promise
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Image load failed'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('File read failed'));
        };

        reader.readAsDataURL(file);
    });
};
