import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrors({}); // Step 1: Dynamic clearing of errors on typing
    };

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format.';
        
        if (!password) newErrors.password = 'Password is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "An unexpected error occurred. Please try again.";
            setErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-8">Sign in to securely access Assetra.</p>
                
                {errors.general && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6">{errors.general}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input 
                            type="email" value={email} onChange={handleInputChange(setEmail)} 
                            className={`w-full px-4 py-3 bg-black/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors`} 
                            placeholder="you@example.com" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} onChange={handleInputChange(setPassword)} 
                                className={`w-full pl-4 pr-12 py-3 bg-black/20 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors`} 
                                placeholder="••••••••" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors mt-2">
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                
                <p className="text-center mt-6 text-gray-400 text-sm">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
