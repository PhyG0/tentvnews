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

        // Helper to get video details
        const getVideoDetails = (url) => {
            if (!url) return null;

            // YouTube
            const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const youtubeMatch = url.match(youtubeRegExp);
            if (youtubeMatch && youtubeMatch[2].length === 11) {
                return {
                    platform: 'youtube',
                    id: youtubeMatch[2],
                    embedUrl: `https://www.youtube.com/embed/${youtubeMatch[2]}`
                };
            }

            // Dailymotion
            const dailymotionRegExp = /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/;
            const dailymotionMatch = url.match(dailymotionRegExp);
            if (dailymotionMatch && dailymotionMatch[1]) {
                return {
                    platform: 'dailymotion',
                    id: dailymotionMatch[1],
                    embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`
                };
            }

            return null;
        };

        // Helper to create iframe
        const createEmbed = (videoDetails) => {
            const wrapper = doc.createElement('div');
            wrapper.className = 'w-full aspect-video rounded-xl shadow-lg my-6 overflow-hidden';

            const iframe = doc.createElement('iframe');
            iframe.src = videoDetails.embedUrl;
            iframe.title = `${videoDetails.platform} video player`;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.className = "w-full h-full";

            wrapper.appendChild(iframe);
            return wrapper;
        };

        // 1. Convert <p> tags that contain ONLY a video link (text)
        const paragraphs = doc.querySelectorAll('p');
        paragraphs.forEach(p => {
            // Check if paragraph text is just a URL
            const text = p.textContent.trim();
            const videoDetails = getVideoDetails(text);

            // Allow simplified check: if it looks like a supported url
            if (videoDetails) {
                const embed = createEmbed(videoDetails);
                p.parentNode.replaceChild(embed, p);
            }
        });

        // 2. Convert <a> tags that link to Video
        const anchors = doc.querySelectorAll('a');
        anchors.forEach(a => {
            const href = a.getAttribute('href');
            const videoDetails = getVideoDetails(href);

            if (videoDetails) {
                // Determine if we should replace. 
                // Policy: If it's a standalone link in a paragraph, definitely replace.
                // If it's inline in text... maybe not?
                // For now, let's aggressively replace if user wants video.
                // Safest: Replace the ANCHOR with the EMBED.
                const embed = createEmbed(videoDetails);
                a.parentNode.replaceChild(embed, a);
            }
        });

        return doc.body.innerHTML;

    } catch (e) {
        console.error('Error processing content:', e);
        return htmlContent; // Fallback to original
    }
};
