import { useState, useEffect } from 'react';
import api, { API_URL } from '../utils/api';
import { Link } from 'react-router-dom';

const TaskBrowsingPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState([]);
    const [budgetRange, setBudgetRange] = useState({ min: 0, max: 1000 });

    const categories = ['All', 'Web Development', 'Marketing', 'Design', 'Data Entry', 'Software Development'];
    const taskTypes = [
        { label: 'Micro Task', value: 'micro-task' },
        { label: 'Project', value: 'project' },
        { label: 'Internship', value: 'internship' },
        { label: 'Attachment', value: 'attachment' }
    ];

    useEffect(() => {
        fetchTasks();
    }, [selectedCategory, selectedType, budgetRange]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            let query = '/tasks?';

            if (searchQuery) query += `search=${searchQuery}&`;
            if (selectedCategory !== 'all') query += `category=${selectedCategory}&`;
            if (selectedType.length > 0) {
                selectedType.forEach(type => query += `type=${type}&`);
            }
            query += `minBudget=${budgetRange.min}&maxBudget=${budgetRange.max}`;

            const response = await api.get(query);
            setTasks(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTasks();
    };

    const handleTypeToggle = (typeValue) => {
        setSelectedType(prev =>
            prev.includes(typeValue) ? prev.filter(t => t !== typeValue) : [...prev, typeValue]
        );
    };

    const handleApply = async (taskId) => {
        try {
            await api.post(`/tasks/${taskId}/apply`);
            // Refresh tasks to show updated applicant count or status
            fetchTasks();
            alert('Application submitted successfully!');
        } catch (err) {
            console.error('Error applying for task:', err);
            alert(err.response?.data?.message || 'Failed to apply for task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-600">Campus Hub</Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard/student" className="btn-ghost">Dashboard</Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    className="input"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat === 'All' ? 'all' : cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Task Type Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Task Type
                                </label>
                                <div className="space-y-2">
                                    {taskTypes.map(type => (
                                        <label key={type.value} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                checked={selectedType.includes(type.value)}
                                                onChange={() => handleTypeToggle(type.value)}
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Budget Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Budget: ${budgetRange.max}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="50"
                                    value={budgetRange.max}
                                    onChange={(e) => setBudgetRange({ ...budgetRange, max: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSelectedType([]);
                                    setBudgetRange({ min: 0, max: 1000 });
                                    setSearchQuery('');
                                }}
                                className="btn-secondary w-full text-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input pl-12"
                                    placeholder="Search tasks, skills, or companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <svg
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-3 text-sm">
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Results Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {tasks.length} Tasks Available
                            </h2>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-600">
                                {error}
                            </div>
                        ) : (
                            /* Task Cards Grid */
                            <div className="grid grid-cols-1 gap-6">
                                {tasks.map(task => (
                                    <div key={task._id} className="task-card hover:cursor-pointer">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Company Logo */}
                                                <div className="flex-shrink-0">
                                                    {task.postedBy?.businessLogo ? (
                                                        <img
                                                            src={`${API_URL}${task.postedBy.businessLogo}`}
                                                            alt={task.postedBy.company}
                                                            className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                            {task.postedBy?.company?.charAt(0).toUpperCase() || 'C'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {task.title}
                                                        </h3>
                                                        <span className="badge-success">{task.type}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {task.postedBy?.company || 'Company Name'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary-600">
                                                    ${task.budget}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4 line-clamp-2">
                                            {task.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {task.skills.map(skill => (
                                                <span key={skill} className="tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {task.applicants?.length || 0} applicants
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleApply(task._id)}
                                                className="btn-primary"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && tasks.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                <p className="text-gray-600">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TaskBrowsingPage;
