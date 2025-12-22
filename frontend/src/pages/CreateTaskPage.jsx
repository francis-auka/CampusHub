import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateTaskPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        type: 'micro-task',
        budget: '',
        deadline: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

            await api.post('/tasks', {
                ...formData,
                skills: skillsArray
            });

            navigate('/dashboard/msme');
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Task</h1>

            <div className="bg-white rounded-lg shadow-card p-6">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="label">Task Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g. Build a React Landing Page"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input"
                            placeholder="Describe the task in detail..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Writing">Writing</option>
                                <option value="Data Entry">Data Entry</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="micro-task">Micro-Task</option>
                                <option value="project">Project</option>
                                <option value="internship">Internship</option>
                                <option value="attachment">Attachment</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Budget ($)</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="input"
                                placeholder="500"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Required Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="input"
                            placeholder="React, CSS, Node.js"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/msme')}
                            className="btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Posting...' : 'Post Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskPage;
