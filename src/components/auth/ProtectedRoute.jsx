import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { hasRole } from '../../utils/roles';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, userProfile, loading } = useAuthContext();

    if (loading) {
        return (
            <div className="container pt-16 text-center">
                <div className="skeleton" style={{ width: '100%', height: '400px' }}></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && !hasRole(userProfile?.role, requiredRole)) {
        return (
            <div className="container pt-16 text-center">
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>
                <a href="/" className="btn btn-primary mt-4">Go Home</a>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
