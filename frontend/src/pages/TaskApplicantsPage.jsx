import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';

const TaskApplicantsPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await api.get(`/tasks/${id}/applicants`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching applicants:', error);
                if (error.response?.status === 403 || error.response?.status === 404) {
                    navigate('/dashboard/msme');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [id, navigate]);

    const handleAssignTask = async (studentId) => {
        if (!window.confirm('Are you sure you want to assign this task to this student?')) {
            return;
        }

        setAssigningId(studentId);
        try {
            await api.post(`/tasks/${id}/assign`, { studentId });
            alert('Task assigned successfully!');
            // Refresh data
            const response = await api.get(`/tasks/${id}/applicants`);
            setData(response.data.data);
        } catch (error) {
            console.error('Error assigning task:', error);
            alert(error.response?.data?.message || 'Failed to assign task');
        } finally {
            setAssigningId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading applicants...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Task not found</p>
                <Link to="/dashboard/msme" className="btn-primary mt-4 inline-block">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const { task, applications } = data;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link to="/dashboard/msme" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{task.title}</h1>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'open' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className="font-semibold text-gray-900">${task.budget}</span>
                    {task.deadline && (
                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    )}
                </div>
            </div>

            {/* Task Description */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Task Description</h2>
                <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Applicants Section */}
            <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Applicants ({applications.length})
                </h2>

                {applications.length > 0 ? (
                    <div className="space-y-6">
                        {applications.map((application) => (
                            <div key={application._id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Profile Photo */}
                                        <div className="flex-shrink-0">
                                            {application.applicant?.profilePhoto ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${application.applicant.profilePhoto}`}
                                                    alt={application.applicant.name}
                                                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl border-2 border-gray-200">
                                                    {application.applicant?.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Applicant Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {application.applicant?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {application.applicant?.university}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {application.applicant?.email}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Skills */}
                                            {application.applicant?.skills && application.applicant.skills.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs font-medium text-gray-700 mb-2">Skills:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {application.applicant.skills.map((skill, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bio */}
                                            {application.applicant?.bio && (
                                                <div className="mt-3">
                                                    <p className="text-xs font-medium text-gray-700 mb-1">Bio:</p>
                                                    <p className="text-sm text-gray-600">{application.applicant.bio}</p>
                                                </div>
                                            )}

                                            {/* Cover Letter */}
                                            {application.coverLetter && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-700 mb-2">Cover Letter:</p>
                                                    <p className="text-sm text-gray-600">{application.coverLetter}</p>
                                                </div>
                                            )}

                                            {/* Application Date */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="text-xs text-gray-500">
                                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                                </p>

                                                {/* Action Buttons */}
                                                {task.status === 'open' && application.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAssignTask(application.applicant._id)}
                                                        disabled={assigningId === application.applicant._id}
                                                        className="btn-primary text-sm"
                                                    >
                                                        {assigningId === application.applicant._id ? 'Assigning...' : 'Assign Task'}
                                                    </button>
                                                )}
                                                {application.status === 'accepted' && (
                                                    <span className="text-sm font-medium text-green-600">✓ Task Assigned</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applicants yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Students haven't applied to this task yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskApplicantsPage;
