import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MSMEDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeTasks: 0,
        pendingApplications: 0,
        totalSpent: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?._id) {
                    const response = await api.get(`/tasks?postedBy=${user._id}`);
                    const myTasks = response.data.data;
                    setTasks(myTasks);

                    // Calculate stats
                    const active = myTasks.filter(t => t.status === 'open' || t.status === 'in-progress').length;
                    const applications = myTasks.reduce((acc, task) => acc + (task.applicants?.length || 0), 0);
                    // Mock total spent for now as we don't have payments yet
                    const spent = myTasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.budget, 0);

                    setStats({
                        activeTasks: active,
                        pendingApplications: applications,
                        totalSpent: spent
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary-600">Campus Hub</Link>
                            <span className="ml-4 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                MSME Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <span className="text-gray-700 font-medium mr-2">{user?.name}</span>
                                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
                    <Link to="/tasks/new" className="btn-primary">
                        Post New Task
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Active Tasks</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeTasks}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Applications</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApplications}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Spent</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalSpent}</p>
                    </div>
                </div>

                {/* Tasks List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-card overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {tasks.map(task => (
                                <li key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Posted on {new Date(task.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === 'open' ? 'bg-green-100 text-green-800' :
                                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                            <div className="text-sm text-gray-500">
                                                {task.applicants?.length || 0} Applicants
                                            </div>
                                            <Link to={`/tasks/${task._id}/applicants`} className="text-primary-600 hover:text-primary-900 font-medium">
                                                View Applicants
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks posted</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                        <div className="mt-6">
                            <Link to="/tasks/new" className="btn-primary">
                                Post Task
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MSMEDashboard;
