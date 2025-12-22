import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ApplicationsPage = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/tasks/applications/me');
                setApplications(response.data.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-2">Track all your task applications in one place</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-card mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${filter === 'all'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            All Applications ({applications.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${filter === 'pending'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Pending ({applications.filter(a => a.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setFilter('accepted')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${filter === 'accepted'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Accepted ({applications.filter(a => a.status === 'accepted').length})
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${filter === 'rejected'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Rejected ({applications.filter(a => a.status === 'rejected').length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading applications...</p>
                </div>
            ) : filteredApplications.length > 0 ? (
                <div className="space-y-4">
                    {filteredApplications.map(app => (
                        <div key={app._id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {app.task?.title || 'Task Deleted'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {app.task?.postedBy?.company || 'Unknown Company'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(app.status)}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </div>

                                    {app.coverLetter && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                                            <p className="text-sm text-gray-600">{app.coverLetter}</p>
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                        {app.task && (
                                            <div className="flex items-center space-x-4">
                                                <span className="font-semibold text-gray-900">
                                                    ${app.task.budget}
                                                </span>
                                                {app.task.deadline && (
                                                    <span className="text-gray-500">
                                                        Due: {new Date(app.task.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-card p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'all'
                            ? "You haven't applied to any tasks yet."
                            : `No ${filter} applications.`}
                    </p>
                    <div className="mt-6">
                        <Link to="/tasks" className="btn-primary">
                            Browse Available Tasks
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
