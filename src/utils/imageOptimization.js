/**
 * Image Optimization Utilities
 * Converts images to WebP format and compresses them before upload
 */

/**
 * Convert any image to WebP format with quality control
 * @param {File|Blob} file - Original image file
 * @param {number} quality - WebP quality (0-1), default 0.85
 * @param {number} maxWidth - Maximum width, default 1920
 * @param {number} maxHeight - Maximum height, default 1080
 * @returns {Promise<Blob>} - WebP blob
 */
export const convertToWebP = async (file, quality = 0.85, maxWidth = 1920, maxHeight = 1080) => {
    return new Promise((resolve, reject) => {
        // Create an image element
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            try {
                // Calculate dimensions while maintaining aspect ratio
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP blob
                canvas.toBlob(
                    (blob) => {
                        URL.revokeObjectURL(objectUrl);
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert image to WebP'));
                        }
                    },
                    'image/webp',
                    quality
                );
            } catch (error) {
                URL.revokeObjectURL(objectUrl);
                reject(error);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
        };

        img.src = objectUrl;
    });
};

/**
 * Get image dimensions without loading full image
 * @param {File|Blob} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image'));
        };

        img.src = objectUrl;
    });
};

/**
 * Calculate optimal dimensions maintaining aspect ratio
 * @param {number} originalWidth 
 * @param {number} originalHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns {{width: number, height: number}}
 */
export const calculateOptimalDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return { width: originalWidth, height: originalHeight };
    }

    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
    return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio)
    };
};

/**
 * Format file size for display
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Optimize image for upload (convert to WebP + compress)
 * Main function to use before upload
 * @param {File} file - Original image file
 * @param {Object} options - Optimization options
 * @returns {Promise<{blob: Blob, originalSize: number, optimizedSize: number, reduction: number}>}
 */
export const optimizeImage = async (file, options = {}) => {
    const {
        quality = 0.85,
        maxWidth = 1920,
        maxHeight = 1080
    } = options;

    const originalSize = file.size;

    try {
        // Convert to WebP
        const webpBlob = await convertToWebP(file, quality, maxWidth, maxHeight);
        const optimizedSize = webpBlob.size;
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

        return {
            blob: webpBlob,
            originalSize,
            optimizedSize,
            reduction: parseFloat(reduction)
        };
    } catch (error) {
        console.error('Image optimization failed:', error);
        throw error;
    }
};
