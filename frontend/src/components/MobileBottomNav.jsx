import { useLocation, Link } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const MobileBottomNav = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const path = location.pathname;

    // Only show on mobile and if user is logged in
    if (!user) return null;

    const navItems = [
        {
            icon: Home,
            label: 'Home',
            to: user.role === 'student' ? '/dashboard/student' : '/dashboard/msme',
            active: path.includes('/dashboard')
        },
        {
            icon: Search,
            label: 'Browse',
            to: '/tasks',
            active: path === '/tasks'
        },
        {
            icon: Briefcase,
            label: 'My Work',
            to: '/my-work', // We might need to create this route or map it to something existing
            active: path === '/my-work'
        },
        {
            icon: MessageSquare,
            label: 'Messages',
            to: '/messages',
            active: path === '/messages'
        },
        {
            icon: User,
            label: 'Profile',
            to: '/profile',
            active: path === '/profile'
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${item.active ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={24} strokeWidth={item.active ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
