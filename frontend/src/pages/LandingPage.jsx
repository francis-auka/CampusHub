import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden relative">
            {/* Hero Background Image with Overlay */}
            <div className="absolute inset-0 z-0 h-[500px] md:h-[700px]">
                <img
                    src="/hero-bg.png"
                    alt="Campus Hub Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-50"></div>
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Campus Hub Logo" className="h-8 md:h-10 w-auto" />
                            <span className="ml-2 text-xl md:text-2xl font-bold text-primary-600">Campus Hub</span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
                            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="btn-ghost py-2 px-4">Sign In</Link>
                            <Link to="/register" className="btn-primary py-2 px-6">Get Started</Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-2">
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg">Features</a>
                                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg">How It Works</a>
                                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg">About</a>
                                <div className="pt-4 flex flex-col gap-3">
                                    <Link to="/login" className="btn-ghost w-full text-center py-3">Sign In</Link>
                                    <Link to="/register" className="btn-primary w-full text-center py-3">Get Started</Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight"
                    >
                        Campus Hub: <br className="md:hidden" />
                        <span className="text-primary-400">Student Freelance Marketplace</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto drop-shadow-md px-4"
                    >
                        Connect students with MSMEs for tasks, internships, and real-world experience.
                        Build your portfolio while earning and gaining valuable skills.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4"
                    >
                        <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                            Hire a Student
                        </Link>
                        <Link to="/tasks" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 text-lg px-10 py-4 rounded-lg font-bold hover:bg-white/20 hover:border-white transition-all shadow-lg">
                            Find Work
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
                >
                    {[
                        { number: "1000+", label: "Active Students" },
                        { number: "500+", label: "MSMEs" },
                        { number: "2000+", label: "Tasks Completed" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1 md:mb-2">{stat.number}</div>
                            <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-primary-50 opacity-30 skew-y-3 transform origin-top-left -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-center text-gray-900 mb-12"
                    >
                        Why Choose Campus Hub?
                    </motion.h2>
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Feature 1 */}
                        <motion.div variants={fadeInUp} className="card text-center hover:shadow-xl transition-all duration-300 border-t-4 border-primary-500">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Tasks</h3>
                            <p className="text-gray-600">
                                Discover micro tasks, projects, internships, and attachments tailored to your skills and interests.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div variants={fadeInUp} className="card text-center hover:shadow-xl transition-all duration-300 border-t-4 border-primary-500">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Portfolio</h3>
                            <p className="text-gray-600">
                                Showcase your completed work and build a professional portfolio that stands out to employers.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div variants={fadeInUp} className="card text-center hover:shadow-xl transition-all duration-300 border-t-4 border-primary-500">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gain Experience</h3>
                            <p className="text-gray-600">
                                Get real-world experience working with businesses while earning money and developing your skills.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-center text-gray-900 mb-12"
                    >
                        How It Works
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* For Students */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">For Students</h3>
                            <ol className="space-y-6">
                                {[
                                    { title: "Create Your Profile", desc: "Sign up and showcase your skills, education, and interests." },
                                    { title: "Browse & Apply", desc: "Find tasks that match your skills and apply with confidence." },
                                    { title: "Get Assigned & Deliver", desc: "Work on assigned tasks and build your portfolio." }
                                ].map((step, idx) => (
                                    <li key={idx} className="flex items-start group">
                                        <span className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">{idx + 1}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{step.title}</h4>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </motion.div>

                        {/* For MSMEs */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">For MSMEs</h3>
                            <ol className="space-y-6">
                                {[
                                    { title: "Post Your Task", desc: "Describe your project, budget, and required skills." },
                                    { title: "Review Applicants", desc: "Browse student profiles and select the best fit." },
                                    { title: "Assign & Collaborate", desc: "Work together to complete the task successfully." }
                                ].map((step, idx) => (
                                    <li key={idx} className="flex items-start group">
                                        <span className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">{idx + 1}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{step.title}</h4>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600 py-20 relative overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
                />

                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        Ready to Get Started?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-primary-100 mb-10"
                    >
                        Join thousands of students and businesses already using Campus Hub
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Sign Up as Student
                        </Link>
                        <Link to="/register" className="bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-800 transition-all border-2 border-white/30 hover:border-white shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Sign Up as MSME
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                <img src="/logo.png" alt="Campus Hub Logo" className="h-8 w-auto" />
                                Campus Hub
                            </h3>
                            <p className="text-sm text-gray-400">
                                Connecting students with opportunities to learn, earn, and grow.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">For Students</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Browse Tasks</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">How It Works</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Success Stories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">For MSMEs</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Post a Task</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Find Talent</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                        <p>&copy; 2025 Campus Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
