const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { generateSasToken } = require('./azure');
const { onUserCreated } = require('./auth');
const { onArticlePublished, onArticleDeleted } = require('./articles');

admin.initializeApp();

// Export Cloud Functions
exports.generateSasToken = generateSasToken;
exports.onUserCreated = onUserCreated;
exports.onArticlePublished = onArticlePublished;
exports.onArticleDeleted = onArticleDeleted;
