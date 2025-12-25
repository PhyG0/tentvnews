import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, getFeedArticles, updateArticle } from '../services/firestore';
import { useAuthContext } from '../components/auth/AuthProvider';
import { ROLES } from '../utils/roles';
import { Users, FileText, Star, Eye, ExternalLink, Shield, Award, CheckCircle } from 'lucide-react';
import Toast from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';

const AdminPage = () => {
    const { currentUser } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);

        if (activeTab === 'users') {
            const result = await getAllUsers();
            if (result.success) {
                setUsers(result.data);
            }
        } else {
            const result = await getFeedArticles(50);
            if (result.success) {
                setArticles(result.data);
            }
        }

        setLoading(false);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const showConfirm = (title, message, onConfirm, type = 'warning') => {
        setConfirmDialog({
            title,
            message,
            onConfirm,
            type
        });
    };

    const handleRoleChange = async (userId, newRole, userName) => {
        // Prevent admin from demoting themselves
        if (userId === currentUser?.uid && newRole !== ROLES.ADMIN) {
            showToast('You cannot demote yourself from Admin role', 'error');
            // Reset the select to admin
            loadData();
            return;
        }

        showConfirm(
            'Change User Role',
            `Are you sure you want to change ${userName}'s role to ${newRole}? This will affect their permissions immediately.`,
            async () => {
                const result = await updateUserRole(userId, newRole);
                if (result.success) {
                    showToast(`Role updated to ${newRole} successfully`, 'success');
                    loadData();
                } else {
                    showToast('Failed to update role: ' + result.error, 'error');
                }
                setConfirmDialog(null);
            },
            'warning'
        );
    };

    const handleToggleFeatured = async (articleId, currentFeatured, articleTitle) => {
        const action = currentFeatured ? 'unfeature' : 'feature';

        showConfirm(
            `${currentFeatured ? 'Unfeature' : 'Feature'} Article`,
            `Are you sure you want to ${action} "${articleTitle}"? ${currentFeatured ? 'It will be removed from the featured section.' : 'It will appear prominently in the featured section.'}`,
            async () => {
                const result = await updateArticle(articleId, { isFeatured: !currentFeatured });
                if (result.success) {
                    showToast(
                        currentFeatured ? 'Article unfeatured successfully' : 'Article featured successfully',
                        'success'
                    );
                    loadData();
                } else {
                    showToast('Failed to update article: ' + result.error, 'error');
                }
                setConfirmDialog(null);
            },
            currentFeatured ? 'warning' : 'info'
        );
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case ROLES.ADMIN:
                return 'bg-purple-100 text-purple-700';
            case ROLES.CREATOR:
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <ConfirmDialog
                    isOpen={true}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    type={confirmDialog.type}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)}
                />
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">Manage users and moderate content</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1">
                        <button
                            className={`
                                flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative
                                ${activeTab === 'users'
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                            onClick={() => setActiveTab('users')}
                        >
                            <Users size={18} />
                            User Management
                        </button>
                        <button
                            className={`
                                flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative
                                ${activeTab === 'articles'
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                            onClick={() => setActiveTab('articles')}
                        >
                            <FileText size={18} />
                            Article Moderation
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'users' && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">Users ({users.length})</h2>
                                    <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Change Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map(user => {
                                                const isSelf = user.id === currentUser?.uid;
                                                return (
                                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {user.profileImageUrl ? (
                                                                    <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                                    {isSelf && (
                                                                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">You</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                                                                <Award size={12} />
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleRoleChange(user.id, e.target.value, user.name)}
                                                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                                                            >
                                                                <option value={ROLES.VIEWER}>Viewer</option>
                                                                <option value={ROLES.CREATOR}>Creator</option>
                                                                <option value={ROLES.ADMIN}>Admin</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'articles' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Articles ({articles.length})</h2>
                                    <p className="text-sm text-gray-600 mt-1">Feature or moderate published articles</p>
                                </div>
                                <div className="space-y-4">
                                    {articles.map(article => (
                                        <div
                                            key={article.id}
                                            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        {article.isFeatured && (
                                                            <Star size={20} className="text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                                                        )}
                                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{article.title}</h3>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">{article.category}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye size={14} />
                                                            <span>{article.viewCount || 0} views</span>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${article.status === 'published'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            <CheckCircle size={12} />
                                                            {article.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${article.isFeatured
                                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        onClick={() => handleToggleFeatured(article.id, article.isFeatured, article.title)}
                                                    >
                                                        <Star size={16} className={article.isFeatured ? 'fill-yellow-700' : ''} />
                                                        {article.isFeatured ? 'Featured' : 'Feature'}
                                                    </button>
                                                    <a
                                                        href={`/article/${article.slug}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
                                                    >
                                                        <ExternalLink size={16} />
                                                        View
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
