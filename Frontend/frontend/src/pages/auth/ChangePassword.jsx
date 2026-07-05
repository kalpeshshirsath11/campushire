import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

const ChangePassword = () => {
  const { user, firstLogin, setPasswordChanged } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Updating password...');
    try {
      await axiosClient.post('/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });

      setPasswordChanged(); // resets firstLogin state to false in Context & LocalStorage
      toast.success('Password updated successfully!', { id: toastId });

      // Redirect to user's home dashboard
      if (user?.role === 'ROLE_TPO') {
        navigate('/tpo/dashboard');
      } else if (user?.role === 'ROLE_TP_MEMBER') {
        navigate('/tp/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update password. Verify current password.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-2 text-center">Change Password</h2>
      <p className="text-text-low text-xs text-center mb-6">
        {firstLogin 
          ? 'You must change your default password to activate your account.' 
          : 'Update your account password permanently.'}
      </p>

      {firstLogin && (
        <div className="mb-5 p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3 text-yellow-400 text-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Password Reset Required</span>
            Functional APIs and dashboards are restricted until you reset your default password.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            Current Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Enter current password"
              {...register('oldPassword', { required: 'Current password is required' })}
              className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                errors.oldPassword 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
              }`}
            />
          </div>
          {errors.oldPassword && (
            <p className="text-red-400 text-[11px] mt-1 font-medium">{errors.oldPassword.message}</p>
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
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Repeat new password"
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
              Updating Password...
            </>
          ) : (
            'Change Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
