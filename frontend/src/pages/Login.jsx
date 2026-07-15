import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Loader } from '../components/ui/Loader';
import { Badge } from '../components/ui/Badge';
import { cn } from '../components/ui/Button';
import { MdDocumentScanner, MdTrendingUp, MdSecurity } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'admin@examvision.ai',
    password: 'password123',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setErrors({ form: 'An error occurred during login. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Left side - Premium Branding / Illustration */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0f172a] flex-col justify-between overflow-hidden">
        
        {/* Abstract background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f172a] to-[#0f172a]"></div>
          
          {/* Grid Pattern */}
          <svg className="absolute inset-0 h-full w-full stroke-white/5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        {/* Animated Glows */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <div className="relative z-10 p-16 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-auto">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-primary rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <span className="text-white font-bold text-xl">EV</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">ExamVision AI</span>
          </div>
          
          <div className="mb-20 mt-16">
            <Badge variant="primary" className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 mb-6">
              Enterprise Evaluation Platform
            </Badge>
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight max-w-xl">
              Automate your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                OMR evaluation
              </span> process.
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed font-light">
              The most advanced AI-powered OMR evaluation and analytics system for enterprise institutions. Seamlessly scan, evaluate, and analyze student performance in real-time.
            </p>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                <MdTrendingUp className="text-blue-400 text-xl" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Real-time Analytics</h4>
                <p className="text-sm text-slate-400 font-light">Instant insights into student performance.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                <MdSecurity className="text-purple-400 text-xl" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Enterprise Security</h4>
                <p className="text-sm text-slate-400 font-light">Bank-grade encryption for exam data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white relative">
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-12">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">EV</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-text">ExamVision AI</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Welcome back</h2>
            <p className="text-base text-gray-500 font-medium">Please enter your credentials to access your dashboard.</p>
          </div>

          {errors.form && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-sm text-red-600 border border-red-100 flex items-center">
              <span className="block font-medium">{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@examvision.ai"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  "h-12 bg-gray-50/50",
                  errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                )}
                aria-invalid={!!errors.email}
                disabled={isLoading}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={cn(
                  "h-12 bg-gray-50/50",
                  errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
                )}
                aria-invalid={!!errors.password}
                disabled={isLoading}
              />
              {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center pt-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-4 w-4 rounded text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-sm transition-all hover:shadow-md mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader size="sm" className="mr-2 h-4 w-4 text-white p-0" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-12 border-t border-gray-100 pt-8">
            <p className="text-center text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} ExamVision AI Inc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
