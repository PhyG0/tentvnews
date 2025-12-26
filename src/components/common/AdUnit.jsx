import { useEffect } from 'react';

const AdUnit = ({
    slot,
    format = 'auto',
    responsive = true,
    style = { display: 'block' },
    layoutKey = ''
}) => {
    useEffect(() => {
        try {
            // Push to adsbygoogle array when component mounts
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense Error:', err);
        }
    }, []);

    return (
        <div className="ad-container my-4 overflow-hidden bg-gray-50 flex justify-center items-center min-h-[100px] border border-gray-100 rounded-lg">
            {/* Development Placeholder */}
            {import.meta.env.DEV && (
                <div className="absolute text-xs text-gray-400 font-mono p-2">
                    AdSense Slot: {slot}
                </div>
            )}

            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-8455255490734020"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
                {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
            />
        </div>
    );
};

export default AdUnit;
