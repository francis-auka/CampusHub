import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { API_URL } from '../utils/api';
import {
    Home, Search, Briefcase, MessageSquare, User,
    Bell, LogOut, Settings, Menu, X, ChevronDown
} from 'lucide-react';

import NotificationPanel from './NotificationPanel';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        {
            icon: Home,
            label: 'Dashboard',
            to: user?.role === 'student' ? '/dashboard/student' : '/dashboard/msme',
            active: location.pathname.includes('/dashboard'),
            roles: ['student', 'msme']
        },
        {
            icon: Search,
            label: 'Browse Tasks',
            to: '/tasks',
            active: location.pathname === '/tasks',
            roles: ['student']
        },
        {
            icon: Briefcase,
            label: 'My Work',
            to: '/my-work',
            active: location.pathname === '/my-work',
            roles: ['student']
        },
        {
            icon: Briefcase,
            label: 'My Tasks',
            to: '/dashboard/msme',
            active: location.pathname === '/dashboard/msme' && !location.pathname.includes('student'),
            roles: ['msme']
        },
        {
            icon: MessageSquare,
            label: 'Messages',
            to: '/messages',
            active: location.pathname === '/messages',
            roles: ['student', 'msme']
        }
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-dark-darker flex flex-col">
            {/* Top Navigation Bar */}
            <header className="glass-dark sticky top-0 z-40 h-16 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo & Mobile Menu Button */}
                        <div className="flex items-center">
                            <button
                                className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Link to="/" className="flex items-center gap-2">
                                <img src="/campus-hub-logo.png" alt="Campus Hub Logo" className="h-6 md:h-8 w-auto" />
                                <span className="text-lg md:text-xl font-bold text-white hidden xs:block">Campus<span className="text-primary-400">Hub</span></span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex space-x-8">
                            {filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className={`flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${item.active
                                            ? 'border-primary-500 text-white'
                                            : 'border-transparent text-slate-400 hover:border-slate-300 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={18} className="mr-2" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <NotificationPanel />

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center max-w-xs bg-dark-lighter/50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {user?.role === 'student' ? (
                                        user?.profilePhoto ? (
                                            <img
                                                src={`${API_URL}${user.profilePhoto}`}
                                                alt={user?.name}
                                                className="h-8 w-8 rounded-full object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold border border-primary-500/30">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )
                                    ) : (
                                        user?.businessLogo ? (
                                            <img
                                                src={`${API_URL}${user.businessLogo}`}
                                                alt={user?.company}
                                                className="h-8 w-8 rounded-full object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold border border-primary-500/30">
                                                {user?.company?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )
                                    )}
                                    <ChevronDown size={16} className="ml-1 text-slate-400 hidden sm:block" />
                                </button>

                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 glass-dark ring-1 ring-white/10 focus:outline-none z-50">
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 flex items-center"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={16} className="mr-2" />
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 flex items-center"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings size={16} className="mr-2" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu (Sidebar style overlay) */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                        <div className="relative flex-1 flex flex-col max-w-xs w-full glass-dark border-r border-white/10">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <img src="/campus-hub-logo.png" alt="Campus Hub Logo" className="h-8 w-auto mr-2" />
                                    <span className="text-xl font-bold text-white">Campus<span className="text-primary-400">Hub</span></span>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">
                                    {filteredNavItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${item.active
                                                    ? 'bg-primary-500/10 text-primary-400'
                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <Icon size={20} className="mr-4" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="flex-shrink-0 flex border-t border-white/10 p-4">
                                <div className="flex items-center">
                                    {user?.profilePhoto ? (
                                        <img
                                            src={`${API_URL}${user.profilePhoto}`}
                                            alt={user?.name}
                                            className="h-10 w-10 rounded-full object-cover border border-white/10"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold border border-primary-500/30">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-white">{user?.name}</p>
                                        <p className="text-sm font-medium text-slate-400">View Profile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                <div className="py-4 md:py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
