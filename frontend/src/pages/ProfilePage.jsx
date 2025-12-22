import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import api, { API_URL } from '../utils/api';

const ProfilePage = () => {
    const { user, logout, refreshUser } = useContext(AuthContext);
    const { fetchNotifications } = useContext(NotificationContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '',
        university: '',
        company: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                skills: user.skills ? user.skills.join(', ') : '',
                university: user.university || '',
                company: user.company || ''
            });
            if (user.profilePhoto) {
                setPreviewUrl(`${API_URL}${user.profilePhoto}`);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('bio', formData.bio);

            // Send skills as individual items if backend expects array, or comma-separated string if backend handles it.
            // Based on previous logic, we'll send individual items.
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            skillsArray.forEach(skill => formDataToSend.append('skills', skill));

            if (formData.university) formDataToSend.append('university', formData.university);
            if (formData.company) formDataToSend.append('company', formData.company);
            if (profilePhoto) formDataToSend.append('profilePhoto', profilePhoto);

            const response = await api.put('/auth/updatedetails', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);

            // Refresh user data in context to update profile photo across the app
            await refreshUser();

        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>

                <div className="px-8 pb-8">
                    {/* Avatar & Actions */}
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg relative group">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-3xl">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <span className="text-white text-xs font-medium">Change</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="flex space-x-3 mb-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-secondary text-sm"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="btn-ghost text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Info / Form */}
                    <div className="space-y-6">
                        {!isEditing ? (
                            // View Mode
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600 font-medium">{user?.role === 'student' ? user?.university : user?.company}</p>
                                <div className="mt-4 prose prose-sm text-gray-500">
                                    <p>{user?.bio || 'No bio added yet.'}</p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.skills && user.skills.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <span key={index} className="tag">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">No skills listed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contact Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Email</span>
                                            <span className="text-gray-900">{user?.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Role</span>
                                            <span className="text-gray-900 capitalize">{user?.role}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {message.text && (
                                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                            disabled // Prevent email change for now or handle carefully
                                        />
                                    </div>
                                    {user?.role === 'student' ? (
                                        <div className="md:col-span-2">
                                            <label className="label">University</label>
                                            <input
                                                type="text"
                                                name="university"
                                                value={formData.university}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <label className="label">Company Name</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <label className="label">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="4"
                                            className="input"
                                            placeholder="Tell us about yourself..."
                                        ></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="React, Node.js, Design..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
