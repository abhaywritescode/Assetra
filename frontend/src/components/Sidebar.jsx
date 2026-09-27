import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Package, AlertTriangle, Bot } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Assets', path: '/assets', icon: Package },
        { name: 'Upload Receipt', path: '/upload', icon: UploadCloud },
        { name: 'Action Centre', path: '/action-center', icon: AlertTriangle },
        { name: 'Ask Assetra', path: '/ask-assetra', icon: Bot },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col min-h-screen">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
                <img src="/favicon.png" alt="Assetra Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl text-white tracking-tight">Assetra</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                isActive 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
