/**
 * Process HTML content to automatically embed YouTube videos
 * Converts plain text URLs and anchor tags pointing to YouTube into responsive iframes
 */
export const processContent = (htmlContent) => {
    if (!htmlContent) return '';

    try {
        // Create a temporary DOM element to parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Helper to create iframe
        const createEmbed = (videoId) => {
            const wrapper = doc.createElement('div');
            wrapper.className = 'w-full aspect-video rounded-xl shadow-lg my-6 overflow-hidden';

            const iframe = doc.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.title = "YouTube video player";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.className = "w-full h-full";

            wrapper.appendChild(iframe);
            return wrapper;
        };

        // Extract Video ID from URL
        const getVideoId = (url) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        // 1. Convert <p> tags that contain ONLY a YouTube link (text)
        const paragraphs = doc.querySelectorAll('p');
        paragraphs.forEach(p => {
            // Check if paragraph text is just a URL
            const text = p.textContent.trim();
            const videoId = getVideoId(text);

            // Allow simplified check: if it looks like a youtube url and nothing else
            if (videoId && (text.includes('youtube.com') || text.includes('youtu.be'))) {
                const embed = createEmbed(videoId);
                p.parentNode.replaceChild(embed, p);
            }
        });

        // 2. Convert <a> tags that link to YouTube
        const anchors = doc.querySelectorAll('a');
        anchors.forEach(a => {
            const href = a.getAttribute('href');
            const videoId = getVideoId(href);

            if (videoId) {
                // Determine if we should replace. 
                // Policy: If it's a standalone link in a paragraph, definitely replace.
                // If it's inline in text... maybe not?
                // For now, let's aggressively replace if user wants video.
                // Safest: Replace the ANCHOR with the EMBED.
                const embed = createEmbed(videoId);
                a.parentNode.replaceChild(embed, a);
            }
        });

        return doc.body.innerHTML;

    } catch (e) {
        console.error('Error processing content:', e);
        return htmlContent; // Fallback to original
    }
};
