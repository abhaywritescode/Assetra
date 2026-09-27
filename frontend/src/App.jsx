import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import AssetsPage from './pages/Assets';
import ActionCenter from './pages/ActionCenter';
import AskAssetra from './pages/AskAssetra';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center text-slate-300 bg-slate-950">Loading session...</div>;
    return user ? (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <Navbar />
                <main className="flex-1 flex flex-col relative">
                    {children}
                </main>
            </div>
            <ChatWidget />
        </div>
    ) : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center text-slate-300 bg-slate-950">Loading session...</div>;
    return user ? <Navigate to="/dashboard" /> : (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
            {children}
        </div>
    );
};

const AppLayout = () => (
    <Routes>
        <Route path="/" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
        <Route path="/action-center" element={<ProtectedRoute><ActionCenter /></ProtectedRoute>} />
        <Route path="/ask-assetra" element={<ProtectedRoute><AskAssetra /></ProtectedRoute>} />
    </Routes>
);

export default function App() {
    return (
        <ChatProvider>
            <AppLayout />
        </ChatProvider>
    );
}
