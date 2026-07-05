import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const response = await axiosClient.post('/auth/login', data);
      const { success, message, data: payload } = response.data;
      
      if (success && payload) {
        login(payload.token, payload.email, payload.role, payload.firstLogin);
        toast.success(message || 'Login successful!', { id: toastId });
        
        // Redirect to appropriate dashboard
        if (payload.role === 'ROLE_TPO') {
          navigate('/tpo/dashboard');
        } else if (payload.role === 'ROLE_TP_MEMBER') {
          navigate('/tp/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        toast.error(message || 'Authentication failed', { id: toastId });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid email or password.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2 text-center">Welcome Back</h2>
      <p className="text-text-low text-xs text-center mb-6">Enter your credentials to access your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="e.g. name@campushire.com"
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                errors.email 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-text-medium uppercase tracking-wide">
              Password
            </label>
            <Link 
              to="/forgot-password" 
              className="text-brand-blue hover:text-brand-cyan text-xs font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-all ${
                errors.password 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-low hover:text-text-high transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/10"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
