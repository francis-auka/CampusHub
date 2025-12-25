import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import PageWrapper from '../components/PageWrapper';

const RegisterPage = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        bio: '',
        skills: '',
        company: '',
        businessDescription: '',
        servicesOffered: '',
        businessCategory: 'Development',
        location: '',
        website: '',
    });
    const [files, setFiles] = useState({
        profilePhoto: null,
        businessLogo: null,
        resume: null,
        companyProfile: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

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

        if (role === 'student') {
            data.append('university', formData.university);
            data.append('bio', formData.bio);
            data.append('skills', formData.skills);
            if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);
            if (files.resume) data.append('resume', files.resume);
        } else {
            data.append('company', formData.company);
            data.append('businessDescription', formData.businessDescription);
            data.append('servicesOffered', formData.servicesOffered);
            data.append('businessCategory', formData.businessCategory);
            data.append('location', formData.location);
            data.append('website', formData.website);
            if (files.businessLogo) data.append('businessLogo', files.businessLogo);
            if (files.companyProfile) data.append('companyProfile', files.companyProfile);
        }

        const result = await register(data);

        if (result.success) {
            if (result.user.role === 'student') {
                navigate('/dashboard/student');
            } else {
                navigate('/dashboard/msme');
            }
        } else {
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
        <PageWrapper className="bg-dark-darker py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Link to="/" className="inline-flex flex-col items-center gap-4">
                        <img src="/campus-hub-logo.png" alt="Campus Hub Logo" className="h-20 w-auto" />
                        <h1 className="text-3xl font-bold text-white">Campus<span className="text-primary-400">Hub</span></h1>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card mb-6"
                >
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                        I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`p-4 rounded-lg border-2 transition-all ${role === 'student'
                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                : 'border-white/10 hover:border-white/20 text-slate-400'
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
                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                : 'border-white/10 hover:border-white/20 text-slate-400'
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
                </motion.div>

                {/* Registration Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                {role === 'student' ? 'Full Name' : 'Contact Name'}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="input"
                                placeholder={role === 'student' ? "John Doe" : "Jane Smith"}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
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
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
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

                        {/* Role Specific Fields */}
                        {role === 'student' ? (
                            <>
                                <div>
                                    <label htmlFor="university" className="block text-sm font-medium text-slate-300 mb-2">
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
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
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
                                    <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-2">
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
                                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-slate-300 mb-2">
                                        Profile Photo
                                    </label>
                                    <input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="resume" className="block text-sm font-medium text-slate-300 mb-2">
                                        Resume / Portfolio (PDF, DOC)
                                    </label>
                                    <input
                                        id="resume"
                                        name="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
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
                                <div>
                                    <label htmlFor="businessDescription" className="block text-sm font-medium text-slate-300 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        id="businessDescription"
                                        name="businessDescription"
                                        rows="3"
                                        className="input"
                                        placeholder="Tell us about your business..."
                                        value={formData.businessDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="servicesOffered" className="block text-sm font-medium text-slate-300 mb-2">
                                        Services Offered (comma separated)
                                    </label>
                                    <input
                                        id="servicesOffered"
                                        name="servicesOffered"
                                        type="text"
                                        className="input"
                                        placeholder="Web Development, SEO, Consulting..."
                                        value={formData.servicesOffered}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="businessCategory" className="block text-sm font-medium text-slate-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="businessCategory"
                                        name="businessCategory"
                                        className="input"
                                        value={formData.businessCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Writing">Writing</option>
                                        <option value="Data Entry">Data Entry</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        className="input"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-2">
                                        Website
                                    </label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        className="input"
                                        placeholder="https://example.com"
                                        value={formData.website}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="businessLogo" className="block text-sm font-medium text-slate-300 mb-2">
                                        Business Logo
                                    </label>
                                    <input
                                        id="businessLogo"
                                        name="businessLogo"
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="companyProfile" className="block text-sm font-medium text-slate-300 mb-2">
                                        Company Profile / Portfolio (PDF)
                                    </label>
                                    <input
                                        id="companyProfile"
                                        name="companyProfile"
                                        type="file"
                                        accept=".pdf"
                                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/10 rounded bg-dark-lighter mt-1"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-slate-400">
                                I agree to the{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <button type="submit" className="btn-primary w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default RegisterPage;
