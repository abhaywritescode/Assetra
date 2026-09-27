import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signup');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="w-full bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center md:hidden gap-3">
                        <img src="/favicon.png" alt="Assetra Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-xl text-white tracking-tight">Assetra</span>
                    </div>
                    {/* Hide title on desktop since Sidebar handles it, but keep an empty div for flex-between spacing */}
                    <div className="hidden md:block flex-shrink-0"></div>
                    {user && (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm hidden sm:block">Hello, {user.name}</span>
                            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
