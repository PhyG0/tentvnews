import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore) => {
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 500 &&
            !isFetching &&
            hasMore
        ) {
            setIsFetching(true);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (isFetching && hasMore) {
            callback().then(() => {
                setIsFetching(false);
            });
        }
    }, [isFetching, callback, hasMore]);

    return [isFetching, setIsFetching];
};
