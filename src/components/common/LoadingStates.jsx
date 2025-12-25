export const ArticleCardSkeleton = () => {
    return (
        <div className="card">
            <div className="skeleton" style={{ width: '100%', height: '200px', marginBottom: 'var(--space-4)' }}></div>
            <div className="skeleton" style={{ width: '70%', height: '24px', marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: 'var(--space-2)' }}></div>
            <div className="skeleton" style={{ width: '90%', height: '16px', marginBottom: 'var(--space-4)' }}></div>
            <div className="flex justify-between">
                <div className="skeleton" style={{ width: '100px', height: '20px' }}></div>
                <div className="skeleton" style={{ width: '80px', height: '20px' }}></div>
            </div>
        </div>
    );
};

export const ArticleDetailSkeleton = () => {
    return (
        <div className="container container-article pt-8">
            <div className="skeleton" style={{ width: '100%', height: '400px', marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '40px', marginBottom: 'var(--space-4)' }}></div>
            <div className="flex gap-4 mb-6">
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                <div>
                    <div className="skeleton" style={{ width: '150px', height: '16px', marginBottom: 'var(--space-2)' }}></div>
                    <div className="skeleton" style={{ width: '100px', height: '14px' }}></div>
                </div>
            </div>
            <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton" style={{ width: '95%', height: '20px', marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton" style={{ width: '88%', height: '20px' }}></div>
        </div>
    );
};

export const ListSkeleton = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <ArticleCardSkeleton key={index} />
            ))}
        </>
    );
};
