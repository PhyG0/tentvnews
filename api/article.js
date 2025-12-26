import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Configure Firebase for Serverless Environment
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize or retrieve app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
    const { slug } = req.query;
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        // 1. Fetch the static index.html template
        // Using fetch to get the deployed index.html ensures we match the current build
        const templateResponse = await fetch(`${baseUrl}/index.html`);
        let html = await templateResponse.text();

        // 2. Fetch Article Data
        let article = null;
        if (slug) {
            const q = query(collection(db, 'articles'), where('slug', '==', slug));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                article = { id: doc.id, ...doc.data() };
            }
        }

        // 3. Inject Metadata if article found
        if (article) {
            const title = `${article.title} - 10TV News`;
            // Strip HTML from description
            const rawDescription = article.summary || article.content || '';
            const description = rawDescription.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
            const image = article.coverImageUrl || `${baseUrl}/logo.png`;
            const url = `${baseUrl}/article/${slug}`;

            // Replace Title
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

            // Replace/Add Meta Tags
            // We'll simplisticly replace existing ones or inject new ones just before </head>
            const metaTags = `
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:url" content="${url}" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="${title}" />
                <meta name="twitter:description" content="${description}" />
                <meta name="twitter:image" content="${image}" />
            `;

            // Inject before closing head
            html = html.replace('</head>', `${metaTags}</head>`);
        }

        // 4. Return HTML
        res.setHeader('Content-Type', 'text/html');
        // Set Cache-Control to ensure fresh previews but allow some caching
        // s-maxage=60 (CDN cache 1 min), stale-while-revalidate
        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        res.status(200).send(html);

    } catch (error) {
        console.error('SSR Error:', error);
        // Fallback: redirects to index.html (client-side rendering)
        // Or just fetch and return index.html without dynamic tags
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
