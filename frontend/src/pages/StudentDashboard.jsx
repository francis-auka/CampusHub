import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api, { API_URL } from '../utils/api';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        completedTasks: 0,
        totalEarnings: 0,
        activeApplications: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?._id) {
                    // Fetch assigned tasks
                    const tasksResponse = await api.get(`/tasks?assignedTo=${user._id}`);
                    const myTasks = tasksResponse.data.data;
                    setAssignedTasks(myTasks);

                    // Fetch applications
                    const applicationsResponse = await api.get('/tasks/applications/me');
                    const myApplications = applicationsResponse.data.data;
                    setApplications(myApplications);

                    // Calculate stats
                    const completed = myTasks.filter(t => t.status === 'completed').length;
                    const earnings = myTasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.budget, 0);
                    const activeApps = myApplications.filter(a => a.status === 'pending').length;

                    setStats({
                        completedTasks: completed,
                        totalEarnings: earnings,
                        activeApplications: activeApps
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-card hidden lg:block">
                <div className="p-6">
                    <Link to="/" className="text-2xl font-bold text-primary-600">Campus Hub</Link>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link to="/dashboard/student" className="flex items-center px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link to="/tasks" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Browse Tasks
                    </Link>
                    <Link to="/applications" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Applications
                    </Link>
                    <Link to="/profile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
                    <button onClick={logout} className="flex items-center text-gray-600 hover:text-red-600 font-medium transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            {user?.profilePhoto ? (
                                <img
                                    src={`${API_URL}${user.profilePhoto}`}
                                    alt={user?.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none">
                            <h3 className="text-primary-100 text-sm font-medium uppercase">Total Earnings</h3>
                            <p className="text-3xl font-bold mt-2">${stats.totalEarnings}</p>
                        </div>
                        <div className="card">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Completed Tasks</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedTasks}</p>
                        </div>
                        <div className="card">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Applications</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeApplications}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Assigned Tasks */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Assigned Tasks</h2>
                                {loading ? (
                                    <div className="text-center py-8">Loading...</div>
                                ) : assignedTasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {assignedTasks.map(task => (
                                            <div key={task._id} className="card hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">{task.postedBy?.company}</p>
                                                    </div>
                                                    <span className="badge-primary">In Progress</span>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-500">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Due {new Date(task.deadline).toLocaleDateString()}
                                                    </div>
                                                    <span className="font-bold text-gray-900">${task.budget}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card text-center py-8 text-gray-500">
                                        No assigned tasks yet.
                                    </div>
                                )}
                            </section>

                            {/* Recent Applications */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h2>
                                {loading ? (
                                    <div className="text-center py-8">Loading...</div>
                                ) : applications.length > 0 ? (
                                    <div className="bg-white rounded-lg shadow-card overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {applications.map(app => (
                                                    <tr key={app._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {app.task?.title}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {app.task?.postedBy?.company}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="card text-center py-8 text-gray-500">
                                        No applications yet.
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Profile Completeness */}
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-4">Profile Completeness</h3>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                                                In Progress
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-primary-600">
                                                70%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                                        <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"></div>
                                    </div>
                                    <p className="text-sm text-gray-500">Complete your profile to increase your chances of getting hired.</p>
                                    <button className="mt-4 w-full btn-secondary text-sm">Update Profile</button>
                                </div>
                            </div>

                            {/* Recommended Tasks */}
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-4">Recommended for You</h3>
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    <p>Complete your profile to get personalized recommendations.</p>
                                    <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                                        Update Skills
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
