import Chat from '../components/Chat';

const MSMEDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reviewingStudent, setReviewingStudent] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [processingReview, setProcessingReview] = useState(false);
    const [stats, setStats] = useState({
        activeTasks: 0,
        pendingApplications: 0,
        totalSpent: 0
    });

    const fetchDashboardData = async () => {
        try {
            if (user?._id) {
                const response = await api.get(`/tasks?postedBy=${user._id}`);
                const myTasks = response.data.data;
                setTasks(myTasks);

                // Calculate stats
                const active = myTasks.filter(t => t.status === 'open' || t.status === 'in-progress').length;
                const applications = myTasks.reduce((acc, task) => acc + (task.applicants?.length || 0), 0);
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

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const handleReviewWork = async (studentId, action) => {
        try {
            setProcessingReview(true);
            await api.post(`/tasks/${selectedTask._id}/review`, {
                studentId,
                action,
                feedback
            });
            alert(`Work ${action === 'approve' ? 'approved' : 'revisions requested'} successfully!`);
            setFeedback('');
            setReviewingStudent(null);
            fetchDashboardData();
            // Update selected task
            const updatedTask = await api.get(`/tasks/${selectedTask._id}`);
            setSelectedTask(updatedTask.data.data);
        } catch (error) {
            console.error('Error reviewing work:', error);
            alert(error.response?.data?.message || 'Failed to review work');
        } finally {
            setProcessingReview(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header (Keep existing) */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl md:text-2xl font-bold text-primary-600">Campus Hub</Link>
                            <span className="ml-2 md:ml-4 px-2 md:px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] md:text-sm font-medium whitespace-nowrap">
                                MSME Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="flex items-center">
                                <span className="text-gray-700 font-medium mr-2 hidden sm:block">{user?.company || user?.name}</span>
                                {user?.businessLogo ? (
                                    <img
                                        src={`${API_URL}${user.businessLogo}`}
                                        alt={user?.company}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm md:text-base">
                                        {user?.company?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-gray-900 font-medium text-sm md:text-base"
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
                                <li key={task._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">{task.title}</h3>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                                Posted on {new Date(task.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end space-x-3 md:space-x-4">
                                            <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-sm font-medium ${task.status === 'open' ? 'bg-green-100 text-green-800' :
                                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                            <div className="text-[10px] md:text-sm text-gray-500">
                                                {task.assigned?.length || 0} / {task.maxAssignees || 1} Assigned
                                            </div>
                                            <Link
                                                to={`/tasks/${task._id}/applicants`}
                                                className="text-primary-600 hover:text-primary-900 font-medium text-xs md:text-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Applicants ({task.applicants?.length || 0})
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
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

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                        {/* Task Info & Management */}
                        <div className="flex-1 p-6 overflow-y-auto border-r border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`badge-${selectedTask.status === 'completed' ? 'success' : 'primary'}`}>
                                            {selectedTask.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {selectedTask.assigned?.length || 0} / {selectedTask.maxAssignees || 1} Students Assigned
                                        </span>
                                    </div>
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

                            <div className="space-y-8">
                                {/* Assigned Students List */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Assigned Students</h3>
                                    {selectedTask.assigned?.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedTask.assigned.map((assignment) => (
                                                <div key={assignment.student?._id || assignment.student} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                                                {assignment.student?.name?.charAt(0).toUpperCase() || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{assignment.student?.name || 'Student'}</p>
                                                                <p className="text-xs text-gray-500">{assignment.student?.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`badge-${assignment.status === 'completed' ? 'success' : assignment.status === 'submitted' ? 'warning' : 'primary'}`}>
                                                            {assignment.status.replace('-', ' ')}
                                                        </span>
                                                    </div>

                                                    {assignment.status === 'submitted' && (
                                                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Submission:</p>
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.submission?.content}</p>
                                                            <div className="mt-4 flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setReviewingStudent(assignment.student?._id || assignment.student);
                                                                        setFeedback('');
                                                                    }}
                                                                    className="btn-primary py-1.5 px-4 text-xs"
                                                                >
                                                                    Review Work
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {assignment.status === 'completed' && assignment.feedback && (
                                                        <div className="mt-2 text-sm text-gray-600 italic">
                                                            Feedback: "{assignment.feedback}"
                                                        </div>
                                                    )}

                                                    {/* Review Form */}
                                                    {reviewingStudent === (assignment.student?._id || assignment.student) && (
                                                        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-primary-100">
                                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Review Submission</h4>
                                                            <textarea
                                                                className="input text-sm min-h-[80px] mb-3"
                                                                placeholder="Add feedback or revision instructions..."
                                                                value={feedback}
                                                                onChange={(e) => setFeedback(e.target.value)}
                                                            ></textarea>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleReviewWork(reviewingStudent, 'approve')}
                                                                    disabled={processingReview}
                                                                    className="btn-primary py-1.5 px-4 text-xs bg-green-600 hover:bg-green-700"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReviewWork(reviewingStudent, 'revise')}
                                                                    disabled={processingReview}
                                                                    className="btn-secondary py-1.5 px-4 text-xs"
                                                                >
                                                                    Request Revision
                                                                </button>
                                                                <button
                                                                    onClick={() => setReviewingStudent(null)}
                                                                    className="btn-ghost py-1.5 px-4 text-xs"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 text-sm">No students assigned yet.</p>
                                            <Link to={`/tasks/${selectedTask._id}/applicants`} className="text-primary-600 font-medium text-sm mt-2 inline-block">
                                                View Applicants
                                            </Link>
                                        </div>
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

export default MSMEDashboard;
