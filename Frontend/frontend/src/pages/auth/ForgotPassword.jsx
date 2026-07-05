import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Sending reset request...');
    try {
      await axiosClient.post('/auth/forgot-password', data);
      toast.success('Reset token sent to email! Check mock console logs.', { id: toastId });
      // Redirect to apply token page
      navigate('/reset-password');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to request reset token.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2 text-center">Forgot Password</h2>
      <p className="text-text-low text-xs text-center mb-6">
        Enter your email address to receive a temporary recovery token.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase tracking-wide">
            Registered Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="e.g. name@campushire.com"
              {...register('email', { 
                required: 'Registered email address is required',
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/10"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending Request...
            </>
          ) : (
            'Request Reset Token'
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

export default ForgotPassword;
