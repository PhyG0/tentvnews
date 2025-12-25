import { validateImageFile, generateUniqueFilename } from '../utils/imageProcessing';

const AZURE_STORAGE_ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_CONTAINER = import.meta.env.VITE_AZURE_STORAGE_CONTAINER;
const AZURE_SAS_TOKEN = import.meta.env.VITE_AZURE_SAS_TOKEN;

/**
 * Upload image directly to Azure Blob Storage using SAS token
 * No Cloud Functions required - direct client-side upload
 */
export const uploadImage = async (file, folder = 'articles', onProgress = null) => {
    try {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            return { success: false, error: validation.errors.join(', ') };
        }

        // Generate unique filename
        const filename = generateUniqueFilename(file);
        const blobPath = folder ? `${folder}/${filename}` : filename;

        // Clean SAS token (handle common copy-paste errors)
        let token = AZURE_SAS_TOKEN || '';
        if (token.startsWith('?')) token = token.substring(1);
        if (token.startsWith('sv=sv=')) token = token.substring(3); // Remove duplicate sv=

        // Construct blob URL with SAS token
        const blobUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobPath}?${token}`;

        // Upload using XMLHttpRequest for progress tracking
        const uploadResult = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('PUT', blobUrl);
            xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });

        if (!uploadResult.success) {
            return uploadResult;
        }

        // Return public URL (without SAS token for security)
        const publicUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobPath}`;

        return {
            success: true,
            url: publicUrl,
            blobPath
        };

    } catch (error) {
        console.error('Azure upload error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get public blob URL
 */
export const getImageUrl = (blobPath) => {
    return `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobPath}`;
};

/**
 * Legacy function for backward compatibility
 * Now just calls uploadImage directly
 */
export const requestSasToken = async (folder, filename) => {
    console.warn('requestSasToken is deprecated - using direct upload instead');
    return { success: false, error: 'Use uploadImage() directly instead' };
};

/**
 * Legacy function for backward compatibility
 */
export const uploadImageToAzure = async (file, sasUrl, onProgress = null) => {
    console.warn('uploadImageToAzure is deprecated - using direct upload instead');
    return uploadImage(file, 'articles', onProgress);
};

/**
 * Delete a blob from Azure Storage
 */
export const deleteBlob = async (blobPath) => {
    try {
        // Clean SAS token
        let token = AZURE_SAS_TOKEN || '';
        if (token.startsWith('?')) token = token.substring(1);
        if (token.startsWith('sv=sv=')) token = token.substring(3);

        // Construct delete URL
        const deleteUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobPath}?${token}`;

        // Delete using fetch
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'x-ms-blob-type': 'BlockBlob'
            }
        });

        if (response.ok || response.status === 404) {
            // 404 means already deleted, which is fine
            return { success: true };
        } else {
            return { success: false, error: `Delete failed with status ${response.status}` };
        }
    } catch (error) {
        console.error('Azure delete error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Extract blob path from Azure URL
 */
export const extractBlobPath = (url) => {
    if (!url) return null;

    try {
        const urlObj = new URL(url);
        const hostname = `${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`;

        if (urlObj.hostname === hostname) {
            // Extract path: /container/folder/file.jpg -> folder/file.jpg
            const pathParts = urlObj.pathname.split('/');
            if (pathParts.length > 2 && pathParts[1] === AZURE_CONTAINER) {
                return pathParts.slice(2).join('/');
            }
        }
    } catch (e) {
        console.error('Error extracting blob path:', e);
    }

    return null;
};

/**
 * Extract all image URLs from HTML content
 */
export const extractImageUrlsFromContent = (htmlContent) => {
    if (!htmlContent) return [];

    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls = [];
    let match;

    while ((match = imgRegex.exec(htmlContent)) !== null) {
        urls.push(match[1]);
    }

    return urls;
};
