import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, Target, Zap, Users, Briefcase, Award, ChevronRight, Star } from 'lucide-react';

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    };

    return (
        <div className="min-h-screen bg-dark-darker text-slate-200 selection:bg-primary-500/30 selection:text-primary-200">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass-dark' : 'py-5 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Campus<span className="text-primary-400">Hub</span></span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Features', 'How It Works', 'About'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                        <Link to="/register" className="btn-primary text-sm px-8">Get Started</Link>
                    </div>

                    <button
                        className="md:hidden p-2 text-slate-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden glass-dark border-t border-white/5 overflow-hidden"
                        >
                            <div className="p-6 flex flex-col gap-4">
                                {['Features', 'How It Works', 'About'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-slate-300"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <hr className="border-white/5" />
                                <Link to="/login" className="btn-ghost w-full text-center">Sign In</Link>
                                <Link to="/register" className="btn-primary w-full text-center">Get Started</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">


                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]"
                        >
                            Ready to Build Your <br />
                            <span className="text-gradient">Hype?</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Connect students with MSMEs for tasks, internships, and real-world experience.
                            Build your portfolio while earning and gaining valuable skills.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link to="/register" className="btn-primary text-lg px-10 py-4 group">
                                Hire a Student
                                <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/tasks" className="btn-secondary text-lg px-10 py-4">
                                Find Work
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
                    >
                        {[
                            { label: 'Active Students', value: '10k+', icon: Users },
                            { label: 'MSMEs Joined', value: '500+', icon: Briefcase },
                            { label: 'Tasks Completed', value: '25k+', icon: Zap },
                            { label: 'Success Rate', value: '98%', icon: Award },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="card group hover:bg-primary-500/5"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Hero Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)]" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-bold text-white mb-6"
                        >
                            Make the Hub <span className="text-primary-400">Work for You</span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-slate-400 max-w-2xl mx-auto"
                        >
                            Everything you need to kickstart your career or grow your business in one place.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Browse Tasks',
                                desc: 'Discover micro tasks, projects, and internships tailored to your skills.',
                                icon: Rocket,
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                title: 'Build Portfolio',
                                desc: 'Showcase your work and build a professional profile that stands out.',
                                icon: Target,
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                title: 'Gain Experience',
                                desc: 'Get real-world experience working with businesses while earning.',
                                icon: Zap,
                                color: 'from-orange-500 to-yellow-500'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="card group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-6 group-hover:rotate-6 transition-transform`}>
                                    <div className="w-full h-full bg-dark-darker rounded-[14px] flex items-center justify-center text-white">
                                        <feature.icon size={28} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <motion.h2
                                variants={fadeInUp}
                                className="text-3xl md:text-5xl font-bold text-white mb-8"
                            >
                                Our Hub is Our <br />
                                <span className="text-gradient">Superpower</span>
                            </motion.h2>
                            <div className="space-y-8">
                                {[
                                    { title: 'Create Your Profile', desc: 'Sign up and showcase your skills, education, and interests.' },
                                    { title: 'Browse & Apply', desc: 'Find tasks that match your skills and apply with confidence.' },
                                    { title: 'Get Assigned & Deliver', desc: 'Work on assigned tasks and build your portfolio.' }
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeInUp}
                                        className="flex gap-6 group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold group-hover:bg-primary-500 group-hover:text-white transition-all">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                            <p className="text-slate-400">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 overflow-hidden relative">
                                {/* Background Image with proper hover */}
                                <motion.div
                                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center"
                                    initial={{ scale: 1, opacity: 0.2 }}
                                    whileHover={{ scale: 1.1, opacity: 0.3 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />

                                {/* Content Overlay */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-12">
                                    <motion.div
                                        className="text-6xl font-black text-white/10 mb-4"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        CAMPUS
                                    </motion.div>
                                    <div className="text-2xl font-bold text-white mb-6">HUB</div>

                                    {/* Properly styled Join Now button */}
                                    <Link
                                        to="/register"
                                        className="btn-primary px-8 py-3 text-base group/btn relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Join Now
                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-500/30 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="glass-dark rounded-[40px] p-12 md:p-20 text-center border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/10 to-accent-600/10 -z-10" />
                        <motion.h2
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl font-bold text-white mb-8"
                        >
                            The Final Peer <br />
                            <span className="text-gradient">Campus Hub</span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto"
                        >
                            Join thousands of students and businesses already using Campus Hub to bridge the gap between education and industry.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row justify-center gap-6"
                        >
                            <Link to="/register" className="btn-primary text-lg px-12 py-4">
                                Sign Up as Student
                            </Link>
                            <Link to="/register" className="btn-secondary text-lg px-12 py-4">
                                Sign Up as MSME
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                                    <img src="/logo.png" alt="Logo" className="w-5 h-5 brightness-0 invert" />
                                </div>
                                <span className="text-xl font-bold text-white">CampusHub</span>
                            </Link>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Empowering the next generation of professionals through real-world opportunities and collaboration.
                            </p>
                        </div>
                        {[
                            { title: 'For Students', links: ['Browse Tasks', 'How It Works', 'Success Stories'] },
                            { title: 'For MSMEs', links: ['Post a Task', 'Pricing', 'Find Talent'] },
                            { title: 'Company', links: ['About Us', 'Contact', 'Privacy Policy'] }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-white font-bold mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                        <p>© 2025 Campus Hub. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
