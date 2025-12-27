import { Link } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';
import { isCreator, isAdmin } from '../../utils/roles';

export const EmptyArticles = ({ message = 'No articles found' }) => {
    const { userProfile } = useAuthContext();
    const canCreate = userProfile && (isCreator(userProfile.role) || isAdmin(userProfile.role));

    return (
        <div className="text-center pt-16 pb-16">
            <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
            <h3 style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-2)' }}>
                {message}
            </h3>
            <p style={{ color: 'var(--color-neutral-500)', marginBottom: canCreate ? 'var(--space-6)' : 0 }}>
                Check back later for new content
            </p>
            {canCreate && (
                <Link to="/create" className="btn btn-primary mt-4 inline-flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Write First Article
                </Link>
            )}
        </div>
    );
};

export const EmptySearchResults = () => {
    return (
        <div className="text-center pt-16 pb-16">
            <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
            </div>
            <h3 style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-2)' }}>
                No results found
            </h3>
            <p style={{ color: 'var(--color-neutral-500)' }}>
                Try adjusting your search terms
            </p>
        </div>
    );
};

export const EmptyDrafts = () => {
    return (
        <div className="text-center pt-16 pb-16">
            <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </div>
            <h3 style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-2)' }}>
                No drafts yet
            </h3>
            <p style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-6)' }}>
                Start writing your first article
            </p>
            <a href="/create" className="btn btn-primary">Create Article</a>
        </div>
    );
};

export const ErrorState = ({ message }) => {
    return (
        <div className="text-center pt-16 pb-16">
            <div className="empty-state-icon error">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h3 style={{ color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>
                Something went wrong
            </h3>
            <p style={{ color: 'var(--color-neutral-600)' }}>
                {message || 'An error occurred while loading content'}
            </p>
        </div>
    );
};
