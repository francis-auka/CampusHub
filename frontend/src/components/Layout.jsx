import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import {
    Home, Search, Briefcase, MessageSquare, User,
    Bell, LogOut, Settings, Menu, X, ChevronDown
} from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm sticky top-0 z-40 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo & Mobile Menu Button */}
                        <div className="flex items-center">
                            <button
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Link to="/" className="flex items-center gap-2">
                                <img src="/logo.png" alt="Campus Hub Logo" className="h-8 w-auto" />
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">Campus Hub</span>
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
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none relative"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotifOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-primary-600 hover:text-primary-700"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif._id}
                                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                                                        onClick={() => markAsRead(notif._id)}
                                                    >
                                                        <p className="text-sm text-gray-900">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                                    No notifications
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {user?.profilePhoto ? (
                                        <img
                                            src={`http://localhost:5000${user.profilePhoto}`}
                                            alt={user?.name}
                                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-gray-200">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <ChevronDown size={16} className="ml-1 text-gray-400 hidden sm:block" />
                                </button>

                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={16} className="mr-2" />
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings size={16} className="mr-2" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
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
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
                                    <img src="/logo.png" alt="Campus Hub Logo" className="h-8 w-auto mr-2" />
                                    <span className="text-xl font-bold text-gray-900">Campus Hub</span>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">
                                    {filteredNavItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${item.active
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                <div className="flex items-center">
                                    {user?.profilePhoto ? (
                                        <img
                                            src={`http://localhost:5000${user.profilePhoto}`}
                                            alt={user?.name}
                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-gray-200">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-gray-700">{user?.name}</p>
                                        <p className="text-sm font-medium text-gray-500">View Profile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
