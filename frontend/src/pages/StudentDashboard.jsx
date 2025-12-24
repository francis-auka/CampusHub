import Chat from '../components/Chat';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState({
        completedTasks: 0,
        totalEarnings: 0,
        activeApplications: 0
    });

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
                const completed = myTasks.filter(t => {
                    const assignment = t.assigned?.find(a => a.student === user._id || a.student?._id === user._id);
                    return assignment?.status === 'completed';
                }).length;

                const earnings = myTasks.filter(t => {
                    const assignment = t.assigned?.find(a => a.student === user._id || a.student?._id === user._id);
                    return assignment?.status === 'completed';
                }).reduce((acc, t) => acc + t.budget, 0);

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

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const handleSubmitWork = async (e) => {
        e.preventDefault();
        if (!submissionContent.trim()) return;

        try {
            setSubmitting(true);
            await api.post(`/tasks/${selectedTask._id}/submit`, {
                content: submissionContent
            });
            alert('Work submitted successfully!');
            setSubmissionContent('');
            fetchDashboardData();
            // Update selected task to show new status
            const updatedTask = await api.get(`/tasks/${selectedTask._id}`);
            setSelectedTask(updatedTask.data.data);
        } catch (error) {
            console.error('Error submitting work:', error);
            alert(error.response?.data?.message || 'Failed to submit work');
        } finally {
            setSubmitting(false);
        }
    };

    const getAssignmentStatus = (task) => {
        const assignment = task.assigned?.find(a => a.student === user._id || a.student?._id === user._id);
        return assignment?.status || 'in-progress';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Keep existing) */}
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
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="px-4 md:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate mr-4">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h1>
                        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                            {user?.profilePhoto ? (
                                <img
                                    src={`${API_URL}${user.profilePhoto}`}
                                    alt={user?.name}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm text-sm md:text-base">
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
                                        {assignedTasks.map(task => {
                                            const status = getAssignmentStatus(task);
                                            return (
                                                <div
                                                    key={task._id}
                                                    className="card hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary-500"
                                                    onClick={() => setSelectedTask(task)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">{task.postedBy?.company}</p>
                                                        </div>
                                                        <span className={`badge-${status === 'completed' ? 'success' : status === 'submitted' ? 'warning' : 'primary'}`}>
                                                            {status.replace('-', ' ')}
                                                        </span>
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
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="card text-center py-8 text-gray-500">
                                        No assigned tasks yet.
                                    </div>
                                )}
                            </section>

                            {/* Recent Applications (Keep existing) */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h2>
                                {loading ? (
                                    <div className="text-center py-8">Loading...</div>
                                ) : applications.length > 0 ? (
                                    <div className="responsive-table-container">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {applications.map(app => (
                                                    <tr key={app._id}>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <div className="max-w-[120px] md:max-w-none truncate">{app.task?.title}</div>
                                                            <div className="sm:hidden text-xs text-gray-500 mt-1">{app.task?.postedBy?.company}</div>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                                            {app.task?.postedBy?.company}
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-[10px] md:text-xs leading-5 font-semibold rounded-full ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
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

                        {/* Right Column (Keep existing) */}
                        <div className="space-y-8">
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
                                    <Link to="/profile" className="mt-4 w-full btn-secondary text-sm block text-center">Update Profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                        {/* Task Info & Submission */}
                        <div className="flex-1 p-6 overflow-y-auto border-r border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                                    <p className="text-primary-600 font-medium">{selectedTask.postedBy?.company}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h4>
                                    <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase">Budget</p>
                                        <p className="text-lg font-bold text-gray-900">${selectedTask.budget}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase">Deadline</p>
                                        <p className="text-lg font-bold text-gray-900">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Submission Section */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Submit Your Work</h4>
                                    {getAssignmentStatus(selectedTask) === 'completed' ? (
                                        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                                            <p className="font-bold flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Task Completed & Approved
                                            </p>
                                            {selectedTask.assigned?.find(a => a.student === user._id || a.student?._id === user._id)?.feedback && (
                                                <p className="mt-2 text-sm italic">Feedback: "{selectedTask.assigned.find(a => a.student === user._id || a.student?._id === user._id).feedback}"</p>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitWork} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Submission Details / Links
                                                </label>
                                                <textarea
                                                    className="input min-h-[120px]"
                                                    placeholder="Describe your work or provide links to deliverables (e.g., GitHub, Google Drive)..."
                                                    value={submissionContent}
                                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="btn-primary w-full py-3 flex justify-center items-center"
                                            >
                                                {submitting ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                ) : (
                                                    getAssignmentStatus(selectedTask) === 'submitted' ? 'Update Submission' : 'Submit Work'
                                                )}
                                            </button>
                                            {getAssignmentStatus(selectedTask) === 'submitted' && (
                                                <p className="text-xs text-yellow-600 text-center">
                                                    You have already submitted work. Submitting again will update your previous entry.
                                                </p>
                                            )}
                                            {getAssignmentStatus(selectedTask) === 'revisions-requested' && (
                                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm">
                                                    <p className="font-bold">Revision Requested:</p>
                                                    <p className="italic">"{selectedTask.assigned.find(a => a.student === user._id || a.student?._id === user._id).feedback}"</p>
                                                </div>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="w-full md:w-[400px] bg-gray-50 flex flex-col">
                            <Chat taskId={selectedTask._id} taskTitle={selectedTask.title} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
