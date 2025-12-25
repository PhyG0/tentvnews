const functions = require('firebase-functions');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Get Azure credentials from environment
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const AZURE_CONTAINER_NAME = 'images';

// Generate SAS token for blob upload
exports.generateSasToken = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { folder, filename } = data;

    // Validate input
    if (!folder || !filename) {
        throw new functions.https.HttpsError('invalid-argument', 'Folder and filename are required');
    }

    // Validate folder (must be articles, profiles, or temp)
    const validFolders = ['articles', 'profiles', 'temp'];
    const folderBase = folder.split('/')[0];

    if (!validFolders.includes(folderBase)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid folder');
    }

    try {
        // Create blob path
        const blobPath = `${folder}/${filename}`;

        // Create SAS token
        const sharedKeyCredential = new StorageSharedKeyCredential(
            AZURE_STORAGE_ACCOUNT_NAME,
            AZURE_STORAGE_ACCOUNT_KEY
        );

        const sasOptions = {
            containerName: AZURE_CONTAINER_NAME,
            blobName: blobPath,
            permissions: BlobSASPermissions.parse('w'), // Write permission
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // 15 minutes
        };

        const sasToken = generateBlobSASQueryParameters(
            sasOptions,
            sharedKeyCredential
        ).toString();

        const sasUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blobPath}?${sasToken}`;

        return {
            sasUrl,
            blobPath
        };
    } catch (error) {
        console.error('SAS token generation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate SAS token');
    }
});
