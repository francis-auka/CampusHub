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
        phone: '',
        // Student fields
        university: '',
        course: '',
        bio: '',
        skills: '',
        // MSME fields
        company: '',
        businessDescription: '',
        servicesOffered: '',
        businessCategory: '',
        location: '',
        website: '',
    });
    const [files, setFiles] = useState({
        profilePhoto: null,
        businessLogo: null,
        resume: null,
        companyProfile: null
    });
    const [previews, setPreviews] = useState({
        profilePhoto: null,
        businessLogo: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                university: user.university || '',
                course: user.course || '',
                bio: user.bio || '',
                skills: user.skills ? user.skills.join(', ') : '',
                company: user.company || '',
                businessDescription: user.businessDescription || '',
                servicesOffered: user.servicesOffered ? user.servicesOffered.join(', ') : '',
                businessCategory: user.businessCategory || '',
                location: user.location || '',
                website: user.website || '',
            });
            setPreviews({
                profilePhoto: user.profilePhoto ? `${API_URL}${user.profilePhoto}` : null,
                businessLogo: user.businessLogo ? `${API_URL}${user.businessLogo}` : null
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;
        setFiles({ ...files, [name]: file });

        if (file && (name === 'profilePhoto' || name === 'businessLogo')) {
            setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
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
            formDataToSend.append('phone', formData.phone);

            if (user.role === 'student') {
                formDataToSend.append('university', formData.university);
                formDataToSend.append('course', formData.course);
                formDataToSend.append('bio', formData.bio);
                formDataToSend.append('skills', formData.skills);
                if (files.profilePhoto) formDataToSend.append('profilePhoto', files.profilePhoto);
                if (files.resume) formDataToSend.append('resume', files.resume);
            } else {
                formDataToSend.append('company', formData.company);
                formDataToSend.append('businessDescription', formData.businessDescription);
                formDataToSend.append('servicesOffered', formData.servicesOffered);
                formDataToSend.append('businessCategory', formData.businessCategory);
                formDataToSend.append('location', formData.location);
                formDataToSend.append('website', formData.website);
                if (files.businessLogo) formDataToSend.append('businessLogo', files.businessLogo);
                if (files.companyProfile) formDataToSend.append('companyProfile', files.companyProfile);
            }

            await api.put('/auth/updatedetails', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
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
                            {user?.role === 'student' ? (
                                previews.profilePhoto ? (
                                    <img src={previews.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-3xl">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )
                            ) : (
                                previews.businessLogo ? (
                                    <img src={previews.businessLogo} alt="Logo" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-3xl">
                                        {user?.company?.charAt(0).toUpperCase()}
                                    </div>
                                )
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <span className="text-white text-xs font-medium">Change</span>
                                    <input
                                        type="file"
                                        name={user?.role === 'student' ? 'profilePhoto' : 'businessLogo'}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="flex space-x-3 mb-2">
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm">Edit Profile</button>
                            ) : (
                                <button onClick={() => setIsEditing(false)} className="btn-ghost text-sm">Cancel</button>
                            )}
                        </div>
                    </div>

                    {/* User Info / Form */}
                    <div className="space-y-6">
                        {!isEditing ? (
                            // View Mode
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user?.role === 'student' ? user?.name : user?.company}
                                </h1>
                                <p className="text-gray-600 font-medium">
                                    {user?.role === 'student' ? user?.university : user?.businessCategory}
                                </p>

                                {user?.role === 'msme' && user?.location && (
                                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {user.location}
                                    </p>
                                )}

                                <div className="mt-4 prose prose-sm text-gray-500">
                                    <p>{user?.role === 'student' ? (user?.bio || 'No bio added yet.') : (user?.businessDescription || 'No business description added yet.')}</p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                                        {user?.role === 'student' ? 'Skills' : 'Services Offered'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(user?.role === 'student' ? user?.skills : user?.servicesOffered)?.length > 0 ? (
                                            (user?.role === 'student' ? user?.skills : user?.servicesOffered).map((item, index) => (
                                                <span key={index} className="tag">{item}</span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">None listed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contact & Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Email</span>
                                            <span className="text-gray-900">{user?.email}</span>
                                        </div>
                                        {user?.phone && (
                                            <div>
                                                <span className="text-gray-500 block">Phone</span>
                                                <span className="text-gray-900">{user.phone}</span>
                                            </div>
                                        )}
                                        {user?.website && (
                                            <div>
                                                <span className="text-gray-500 block">Website</span>
                                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{user.website}</a>
                                            </div>
                                        )}
                                        {user?.role === 'student' && user?.resume && (
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500 block">Resume / Portfolio</span>
                                                <a href={`${API_URL}${user.resume}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Resume
                                                </a>
                                            </div>
                                        )}
                                        {user?.role === 'msme' && user?.companyProfile && (
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500 block">Company Profile</span>
                                                <a href={`${API_URL}${user.companyProfile}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View Company Profile
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <button onClick={handleLogout} className="w-full btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">Sign Out</button>
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
                                        <label className="label">{user?.role === 'student' ? 'Full Name' : 'Contact Name'}</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input type="email" name="email" value={formData.email} className="input" disabled />
                                    </div>
                                    <div>
                                        <label className="label">Phone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" />
                                    </div>

                                    {user?.role === 'student' ? (
                                        <>
                                            <div className="md:col-span-2">
                                                <label className="label">University</label>
                                                <input type="text" name="university" value={formData.university} onChange={handleChange} className="input" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Bio</label>
                                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="input" placeholder="Tell us about yourself..."></textarea>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Skills (comma separated)</label>
                                                <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input" placeholder="React, Node.js, Design..." />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Resume / Portfolio (PDF, DOC)</label>
                                                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="md:col-span-2">
                                                <label className="label">Company Name</label>
                                                <input type="text" name="company" value={formData.company} onChange={handleChange} className="input" />
                                            </div>
                                            <div>
                                                <label className="label">Category</label>
                                                <select name="businessCategory" value={formData.businessCategory} onChange={handleChange} className="input">
                                                    <option value="Development">Development</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Writing">Writing</option>
                                                    <option value="Data Entry">Data Entry</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label">Location</label>
                                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" placeholder="City, Country" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Website</label>
                                                <input type="url" name="website" value={formData.website} onChange={handleChange} className="input" placeholder="https://example.com" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Business Description</label>
                                                <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} rows="4" className="input" placeholder="Tell us about your business..."></textarea>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Services Offered (comma separated)</label>
                                                <input type="text" name="servicesOffered" value={formData.servicesOffered} onChange={handleChange} className="input" placeholder="Web Development, SEO, Consulting..." />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Company Profile / Portfolio (PDF)</label>
                                                <input type="file" name="companyProfile" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
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
