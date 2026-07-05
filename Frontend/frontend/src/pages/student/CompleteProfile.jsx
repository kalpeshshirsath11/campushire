import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Loader2, FileText, GraduationCap, CheckCircle } from 'lucide-react';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      branch: 'CS',
      cgpa: '',
      tenthPercentage: '',
      twelfthPercentage: '',
      backlogs: 0,
      phone: '',
      personalEmail: '',
      address: '',
      resumeLink: '',
      resumeFileName: '',
      tenthMarksheetLink: '',
      tenthMarksheetFileName: '',
      twelfthMarksheetLink: '',
      twelfthMarksheetFileName: '',
      degreeResultLink: '',
      degreeResultFileName: '',
      aadhaarLink: '',
      aadhaarFileName: '',
      photoLink: '',
      photoFileName: ''
    }
  });

  // Load profile values if they already exist
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/students/profile/me');
        if (response.data?.success && response.data?.data) {
          const profile = response.data.data;
          Object.keys(profile).forEach((key) => {
            if (profile[key] !== null && profile[key] !== undefined) {
              setValue(key, profile[key]);
            }
          });
        }
      } catch (error) {
        // Profile might be empty, which is normal for first-time profile setups
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Saving profile and files...');
    try {
      // API expects numeric values to be parseable
      const payload = {
        ...data,
        cgpa: parseFloat(data.cgpa),
        tenthPercentage: parseFloat(data.tenthPercentage),
        twelfthPercentage: parseFloat(data.twelfthPercentage),
        backlogs: parseInt(data.backlogs, 10),
      };

      await axiosClient.put('/students/profile', payload);
      toast.success('Profile updated successfully! Status reset to PENDING verification.', { id: toastId });
      navigate('/student/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile. Please verify inputs.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50svh]">
        <Loader2 size={36} className="animate-spin text-brand-blue" />
        <span className="text-text-low text-sm mt-4">Loading profile details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
        <p className="text-text-low text-sm">Submit your educational records and Google Drive links for TPO verification.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Info */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-blue border-b border-slate-800 pb-3">
            <FileText size={18} />
            <h3 className="font-semibold text-white">1. Personal & Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Personal Email</label>
              <input
                type="email"
                {...register('personalEmail', { required: 'Personal email is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.personalEmail && <p className="text-red-400 text-xs mt-1">{errors.personalEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Phone Number</label>
              <input
                type="text"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Branch</label>
              <select
                {...register('branch', { required: 'Branch is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              >
                <option value="CS">Computer Science (CS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ENTC">Electronics & Telecommunication (ENTC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Home Address</label>
            <textarea
              rows={3}
              {...register('address', { required: 'Address is required' })}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
          </div>
        </div>

        {/* Section 2: Academics */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-violet border-b border-slate-800 pb-3">
            <GraduationCap size={18} />
            <h3 className="font-semibold text-white">2. Academic Performance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 9.15"
                {...register('cgpa', { 
                  required: 'CGPA is required',
                  min: { value: 0, message: 'CGPA cannot be negative' },
                  max: { value: 10, message: 'CGPA cannot exceed 10.0' }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.cgpa && <p className="text-red-400 text-xs mt-1">{errors.cgpa.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">10th Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 92.5"
                {...register('tenthPercentage', { 
                  required: '10th percentage is required',
                  min: { value: 0, message: 'Invalid percentage' },
                  max: { value: 100, message: 'Cannot exceed 100%' }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.tenthPercentage && <p className="text-red-400 text-xs mt-1">{errors.tenthPercentage.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">12th Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 89.0"
                {...register('twelfthPercentage', { 
                  required: '12th percentage is required',
                  min: { value: 0, message: 'Invalid percentage' },
                  max: { value: 100, message: 'Cannot exceed 100%' }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.twelfthPercentage && <p className="text-red-400 text-xs mt-1">{errors.twelfthPercentage.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Active Backlogs</label>
              <input
                type="number"
                placeholder="0"
                {...register('backlogs', { 
                  required: 'Backlogs count is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.backlogs && <p className="text-red-400 text-xs mt-1">{errors.backlogs.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Google Drive Document Links */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-cyan border-b border-slate-800 pb-3">
            <CheckCircle size={18} />
            <h3 className="font-semibold text-white">3. Google Drive Verification Documents</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">Resume PDF Link</label>
              <input
                type="url"
                placeholder="Google Drive link to Resume"
                {...register('resumeLink', { required: 'Resume URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_doe_resume.pdf)"
                {...register('resumeFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* 10th Marksheet */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">10th Marksheet Link</label>
              <input
                type="url"
                placeholder="Google Drive link to 10th marksheet"
                {...register('tenthMarksheetLink', { required: '10th Marksheet URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_10th.pdf)"
                {...register('tenthMarksheetFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* 12th Marksheet */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">12th Marksheet Link</label>
              <input
                type="url"
                placeholder="Google Drive link to 12th marksheet"
                {...register('twelfthMarksheetLink', { required: '12th Marksheet URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_12th.pdf)"
                {...register('twelfthMarksheetFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* Degree Marksheet */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">Degree Result PDF Link</label>
              <input
                type="url"
                placeholder="Link to latest semester degree marksheet"
                {...register('degreeResultLink', { required: 'Degree Result URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_sem_result.pdf)"
                {...register('degreeResultFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* Aadhaar Link */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">Aadhaar PDF Link</label>
              <input
                type="url"
                placeholder="Google Drive link to Aadhaar card"
                {...register('aadhaarLink', { required: 'Aadhaar URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_aadhaar.pdf)"
                {...register('aadhaarFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* Photo Link */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-medium uppercase">Profile Photo Image Link</label>
              <input
                type="url"
                placeholder="Google Drive link to profile picture"
                {...register('photoLink', { required: 'Photo URL is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              <input
                type="text"
                placeholder="Filename (e.g. john_photo.jpg)"
                {...register('photoFileName', { required: 'Filename is required' })}
                className="w-full bg-slate-900/60 border border-slate-800 text-text-medium rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-2.5 text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/10"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Details...
              </>
            ) : (
              'Save & Submit Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
