import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { KeyRound, Lock, Loader2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Resetting password...');
    try {
      await axiosClient.post('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully! Please sign in.', { id: toastId });
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid or expired token.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2 text-center">Reset Password</h2>
      <p className="text-text-low text-xs text-center mb-6">
        Enter the reset token sent to your email along with your new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Token */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            Reset Token
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <KeyRound size={16} />
            </span>
            <input
              type="text"
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              {...register('token', { required: 'Reset token is required' })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                errors.token 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
          </div>
          {errors.token && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.token.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                errors.newPassword 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Repeat password"
              {...register('confirmPassword', { 
                required: 'Please confirm your new password',
                validate: (value) => value === newPassword || 'Passwords do not match'
              })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                errors.confirmPassword 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/10"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        {/* Back to Login Link */}
        <div className="pt-2 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs text-text-low hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
