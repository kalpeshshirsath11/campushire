import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Users, UserPlus, UserMinus, Mail, Lock, KeyRound, Loader2, ShieldCheck } from 'lucide-react';

const TpMembersManagement = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const { register: regForm, handleSubmit: handleRegSubmit, reset: resetReg, formState: { errors: regErrors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const { register: deactForm, handleSubmit: handleDeactSubmit, reset: resetDeact, formState: { errors: deactErrors } } = useForm({
    defaultValues: { id: '' }
  });

  const onRegister = async (data) => {
    setIsRegistering(true);
    const toastId = toast.loading('Creating TP Member account...');
    try {
      const response = await axiosClient.post('/users/tp-member', data);
      if (response.data?.success) {
        toast.success(`TP Member registered successfully! ID: ${response.data.data.id}`, { id: toastId });
        resetReg();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create TP Member account.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsRegistering(false);
    }
  };

  const onDeactivate = async (data) => {
    setIsDeactivating(true);
    const toastId = toast.loading('Deactivating TP Member...');
    try {
      await axiosClient.delete(`/users/tp-member/${data.id}`);
      toast.success('TP Member deactivated successfully!', { id: toastId });
      resetDeact();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to deactivate account. Verify ID is not TPO.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">TP Members Staff Management</h2>
        <p className="text-text-low text-sm">Register new Training & Placement Member accounts or deactivate existing ones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register Card */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-blue border-b border-slate-850 pb-3">
            <UserPlus size={18} />
            <h3 className="font-semibold text-white">Create TP Member Account</h3>
          </div>

          <form onSubmit={handleRegSubmit(onRegister)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Staff Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="e.g. member@college.com"
                  {...regForm('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                    regErrors.email 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
                  }`}
                />
              </div>
              {regErrors.email && <p className="text-red-400 text-xs mt-1">{regErrors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Default Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...regForm('password', { 
                    required: 'Default password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                    regErrors.password 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-slate-800 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'
                  }`}
                />
              </div>
              {regErrors.password && <p className="text-red-400 text-xs mt-1">{regErrors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg hover:shadow-blue-500/10"
            >
              {isRegistering ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Staff Account'
              )}
            </button>
          </form>
        </div>

        {/* Deactivate Card */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-400 border-b border-slate-850 pb-3">
            <UserMinus size={18} />
            <h3 className="font-semibold text-white">Deactivate TP Member</h3>
          </div>

          <p className="text-xs text-text-medium leading-relaxed">
            Deactivating a TP Member suspends their authorization tokens. They will no longer be able to verify student profiles or publish drives.
          </p>

          <form onSubmit={handleDeactSubmit(onDeactivate)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Staff User ID</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
                  <KeyRound size={16} />
                </span>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  {...deactForm('id', { required: 'Staff User ID is required' })}
                  className={`w-full bg-slate-900 border text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                    deactErrors.id 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-slate-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                  }`}
                />
              </div>
              {deactErrors.id && <p className="text-red-400 text-xs mt-1">{deactErrors.id.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isDeactivating}
              className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isDeactivating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deactivating...
                </>
              ) : (
                'Suspend Staff Access'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TpMembersManagement;
