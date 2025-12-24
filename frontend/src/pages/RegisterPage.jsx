import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RegisterPage = () => {
    const [role, setRole] = useState('student'); // 'student' or 'msme'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        company: '',
        bio: '',
        skills: '',
    });
    const [files, setFiles] = useState({
        profilePhoto: null,
        resume: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', role);
        data.append('bio', formData.bio);
        data.append('skills', formData.skills);

        if (role === 'student') {
            data.append('university', formData.university);
        } else {
            data.append('company', formData.company);
        }

        if (files.profilePhoto) {
            data.append('profilePhoto', files.profilePhoto);
        }
        if (files.resume) {
            data.append('resume', files.resume);
        }

        console.log('Registering user...');
        const result = await register(data); // AuthContext register needs to handle FormData
        console.log('Registration result:', result);

        if (result.success) {
            console.log('User role:', result.user.role);
            // Redirect based on role
            if (result.user.role === 'student') {
                navigate('/dashboard/student');
            } else {
                navigate('/dashboard/msme');
            }
        } else {
            console.error('Registration failed:', result.message);
            setError(result.message);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0]
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <img src="/logo.png" alt="Campus Hub Logo" className="h-12 w-auto" />
                        <h1 className="text-3xl font-bold text-primary-600">Campus Hub</h1>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Role Selection */}
                <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`p-4 rounded-lg border-2 transition-all ${role === 'student'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="text-center">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="font-semibold">Student</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('msme')}
                            className={`p-4 rounded-lg border-2 transition-all ${role === 'msme'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="text-center">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="font-semibold">MSME</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-card p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                {role === 'student' ? 'Full Name' : 'Contact Name'}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {role === 'student' && (
                            <div>
                                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                                    University
                                </label>
                                <input
                                    id="university"
                                    name="university"
                                    type="text"
                                    required
                                    className="input"
                                    placeholder="University of Example"
                                    value={formData.university}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {role === 'msme' && (
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    required
                                    className="input"
                                    placeholder="Your Company Ltd"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {/* New Fields */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows="3"
                                className="input"
                                placeholder="Tell us about yourself..."
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                Skills (comma separated)
                            </label>
                            <input
                                id="skills"
                                name="skills"
                                type="text"
                                className="input"
                                placeholder="React, Node.js, Design..."
                                value={formData.skills}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Photo
                            </label>
                            <input
                                id="profilePhoto"
                                name="profilePhoto"
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                                Resume / Portfolio (PDF, DOC)
                            </label>
                            <input
                                id="resume"
                                name="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <button type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
