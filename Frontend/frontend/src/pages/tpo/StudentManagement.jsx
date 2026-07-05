import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Upload, UserPlus, Loader2, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('bulk');
  const [isLoading, setIsLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { prn: '', email: '', password: '' }
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const onBulkSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error('Please select a CSV file first.');
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading('Uploading and processing CSV...');
    
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axiosClient.post('/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data?.success) {
        setUploadResult(response.data.data);
        toast.success('CSV processed successfully!', { id: toastId });
        setCsvFile(null);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload CSV.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const onManualSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Registering student...');
    try {
      await axiosClient.post('/students', data);
      toast.success('Student registered successfully!', { id: toastId });
      reset();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'PRN or Email already registered.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Student Database Management</h2>
        <p className="text-text-low text-sm">Add students manually or import them in bulk using CSV files.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => { setActiveTab('bulk'); setUploadResult(null); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bulk' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-text-low hover:text-white'
          }`}
        >
          <Upload size={16} /> Bulk Import CSV
        </button>
        <button
          onClick={() => { setActiveTab('manual'); setUploadResult(null); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'manual' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-text-low hover:text-white'
          }`}
        >
          <UserPlus size={16} /> Manual Registration
        </button>
      </div>

      {/* Bulk Import Tab */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-blue border-b border-slate-850 pb-3">
              <FileSpreadsheet size={18} />
              <h3 className="font-semibold text-white">Import Student Accounts via CSV</h3>
            </div>
            
            <p className="text-xs text-text-medium leading-relaxed">
              CSV file structure must contain precisely these headers: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">prn,email,password</code>.
            </p>

            <form onSubmit={onBulkSubmit} className="space-y-4 max-w-lg">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full text-xs text-text-low file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-brand-cyan file:cursor-pointer hover:file:bg-slate-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-5 py-2 text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload & Import List'
                )}
              </button>
            </form>
          </div>

          {/* Bulk Upload Processing Results */}
          {uploadResult && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h4 className="font-bold text-white text-sm">Upload Result Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-text-low block">Total Rows</span>
                  <span className="text-xl font-bold text-white">{uploadResult.totalRecords}</span>
                </div>
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-text-low block">Successes</span>
                  <span className="text-xl font-bold text-emerald-400">{uploadResult.successCount}</span>
                </div>
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-text-low block">Failures</span>
                  <span className="text-xl font-bold text-red-400">{uploadResult.failureCount}</span>
                </div>
              </div>

              {uploadResult.errors?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-850">
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Processing Warnings/Errors
                  </span>
                  <ul className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 max-h-40 overflow-y-auto divide-y divide-slate-850">
                    {uploadResult.errors.map((err, i) => (
                      <li key={i} className="text-xs text-text-medium py-1.5 first:pt-0 last:pb-0">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual Creation Tab */}
      {activeTab === 'manual' && (
        <div className="glass-card rounded-xl p-6 space-y-4 max-w-lg">
          <div className="flex items-center gap-2 text-brand-violet border-b border-slate-850 pb-3">
            <UserPlus size={18} />
            <h3 className="font-semibold text-white">Manual Student Account Setup</h3>
          </div>

          <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">PRN Code</label>
              <input
                type="text"
                placeholder="e.g. PRN101"
                {...register('prn', { required: 'PRN is required' })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-violet/50"
              />
              {errors.prn && <p className="text-red-400 text-xs mt-1">{errors.prn.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Student Email</label>
              <input
                type="email"
                placeholder="e.g. student@college.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email format'
                  }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-violet/50"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Default Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Default password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-violet/50"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-violet hover:bg-violet-600 text-white font-semibold rounded-lg px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Student Account'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
