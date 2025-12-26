import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite';

// Configure Firebase for serverless environment
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
    const { slug } = req.query;
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        // 1. Fetch template
        const templateResponse = await fetch(`${baseUrl}/index.html`);
        let html = await templateResponse.text();

        // 2. Fetch Article
        let article = null;
        if (slug) {
            const q = query(collection(db, 'articles'), where('slug', '==', slug));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                article = { id: doc.id, ...doc.data() };
            }
        }

        // 3. Inject Metadata
        if (article) {
            // Helper to escape HTML entities
            const escapeHtml = (unsafe) => {
                if (!unsafe) return "";
                return String(unsafe)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            };

            const title = escapeHtml(`${article.title} - 10TV News`);
            const rawDescription = article.summary || article.content || '';
            const description = escapeHtml(rawDescription.replace(/<[^>]*>/g, '').substring(0, 150) + '...');

            // Use cover image or fallback to logo
            // IMPORTANT: Ensure URL is properly escaped for HTML attribute
            const image = escapeHtml(article.coverImageUrl || `${baseUrl}/logo.png`);
            const url = escapeHtml(`${baseUrl}/article/${slug}`);

            // Replace Title
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

            // Meta tags to inject
            const metaTags = `
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:image:secure_url" content="${image}" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="${url}" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="${title}" />
                <meta name="twitter:description" content="${description}" />
                <meta name="twitter:image" content="${image}" />
            `;

            // Inject before </head>
            html = html.replace('</head>', `${metaTags}</head>`);
        }

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        res.status(200).send(html);

    } catch (error) {
        console.error('SSR Error:', error);
        // Fallback to basic index.html
        try {
            const templateResponse = await fetch(`${baseUrl}/index.html`);
            const html = await templateResponse.text();
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(html);
        } catch (e) {
            res.status(500).send('Internal Server Error');
        }
    }
}
