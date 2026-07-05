import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import { CardSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Drawer from '../../components/Drawer';
import toast from 'react-hot-toast';
import { Briefcase, Plus, Search, Calendar, Award, Clock, Users, Building2, ShieldCheck, Loader2 } from 'lucide-react';

const DriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      companyId: '',
      title: '',
      description: '',
      deadline: '',
      minimumCgpa: '',
      allowedBacklogs: 0,
      minimumTenthPercentage: '',
      minimumTwelfthPercentage: '',
      eligibleBranches: [],
      bondDetails: '',
      driveDate: ''
    }
  });

  const fetchData = async () => {
    try {
      const drivesResponse = await axiosClient.get('/drives');
      const companiesResponse = await axiosClient.get('/companies');
      
      if (drivesResponse.data?.success) {
        setDrives(drivesResponse.data.data);
      }
      if (companiesResponse.data?.success) {
        setCompanies(companiesResponse.data.data);
      }
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    // Basic verification that at least one branch is selected
    if (!data.eligibleBranches || data.eligibleBranches.length === 0) {
      toast.error('Please select at least one eligible branch.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Publishing recruitment drive...');
    try {
      const payload = {
        ...data,
        companyId: parseInt(data.companyId, 10),
        minimumCgpa: parseFloat(data.minimumCgpa),
        allowedBacklogs: parseInt(data.allowedBacklogs, 10),
        minimumTenthPercentage: parseFloat(data.minimumTenthPercentage),
        minimumTwelfthPercentage: parseFloat(data.minimumTwelfthPercentage),
      };

      await axiosClient.post('/drives', payload);
      toast.success('Placement drive published successfully!', { id: toastId });
      setIsFormOpen(false);
      reset();
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to publish placement drive.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (drive) => {
    setSelectedDrive(drive);
    setIsDrawerOpen(true);
  };

  // Filter drives by search term
  const filteredDrives = drives.filter(drive => 
    drive.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Recruitment Placement Drives</h2>
          <p className="text-text-low text-sm">Publish and coordinate job hiring schedules and eligibility criteria.</p>
        </div>
        <button
          onClick={() => {
            if (companies.length === 0) {
              toast.error('Register at least one company before creating a placement drive.');
              return;
            }
            setIsFormOpen(true);
          }}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-lg hover:shadow-blue-500/10"
        >
          <Plus size={16} /> Publish Drive
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by drive title or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-850 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue/50"
          />
        </div>
      </div>

      {/* Grid of Published Drives */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredDrives.length === 0 ? (
        <EmptyState 
          title="No Published Drives"
          description="Click the Publish button above to add a recruitment posting."
          icon={Briefcase}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => {
            const isDeadlinePassed = new Date(drive.deadline) < new Date();

            return (
              <div key={drive.id} className="glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base truncate max-w-[170px]" title={drive.title}>
                        {drive.title}
                      </h3>
                      <span className="text-xs text-brand-blue font-semibold">{drive.companyName}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                      isDeadlinePassed 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isDeadlinePassed ? 'Closed' : 'Active'}
                    </span>
                  </div>

                  <p className="text-text-medium text-xs line-clamp-3 mb-4 leading-relaxed">
                    {drive.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-850 pt-3.5 mb-6 text-xs text-text-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-blue" />
                      <span>Drive Date: <strong>{drive.driveDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-red-400" />
                      <span className="truncate">Deadline: <strong>{new Date(drive.deadline).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(drive)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 text-xs font-semibold rounded-lg py-2 transition-colors cursor-pointer"
                >
                  Manage Placement details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer: Publish Drive Form */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Publish Placement Drive"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Select Company Profile</label>
            <select
              {...register('companyId', { required: 'Please select a company profile' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            >
              <option value="">Choose a company profile...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.roleOffered})</option>
              ))}
            </select>
            {errors.companyId && <p className="text-red-400 text-xs mt-1">{errors.companyId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Drive Title</label>
            <input
              type="text"
              placeholder="e.g. Google SWE Drive 2026"
              {...register('title', { required: 'Drive title is required' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase font-medium">Drive Date</label>
              <input
                type="date"
                {...register('driveDate', { required: 'Drive date is required' })}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.driveDate && <p className="text-red-400 text-xs mt-1">{errors.driveDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase font-medium">Application Deadline</label>
              <input
                type="datetime-local"
                {...register('deadline', { required: 'Deadline date is required' })}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.deadline && <p className="text-red-400 text-xs mt-1">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Academic Criteria settings */}
          <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-4">
            <span className="text-[10px] font-bold text-text-low uppercase tracking-wider block border-b border-slate-850 pb-2">
              Eligibility Thresholds
            </span>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-medium mb-1 uppercase">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 8.00"
                  {...register('minimumCgpa', { 
                    required: 'Min CGPA threshold required',
                    min: { value: 0, message: 'Invalid CGPA' },
                    max: { value: 10, message: 'Max is 10.0' }
                  })}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
                />
                {errors.minimumCgpa && <p className="text-red-400 text-[10px] mt-0.5">{errors.minimumCgpa.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-medium mb-1 uppercase">Max Active Backlogs</label>
                <input
                  type="number"
                  placeholder="0"
                  {...register('allowedBacklogs', { 
                    required: 'Max backlog threshold required',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
                />
                {errors.allowedBacklogs && <p className="text-red-400 text-[10px] mt-0.5">{errors.allowedBacklogs.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-medium mb-1 uppercase">Min 10th %</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 85.0"
                  {...register('minimumTenthPercentage', { 
                    required: 'Min 10th% threshold required',
                    min: { value: 0, message: 'Invalid percentage' },
                    max: { value: 100, message: 'Max is 100%' }
                  })}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
                />
                {errors.minimumTenthPercentage && <p className="text-red-400 text-[10px] mt-0.5">{errors.minimumTenthPercentage.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-medium mb-1 uppercase">Min 12th %</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 85.0"
                  {...register('minimumTwelfthPercentage', { 
                    required: 'Min 12th% threshold required',
                    min: { value: 0, message: 'Invalid percentage' },
                    max: { value: 100, message: 'Max is 100%' }
                  })}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue/50"
                />
                {errors.minimumTwelfthPercentage && <p className="text-red-400 text-[10px] mt-0.5">{errors.minimumTwelfthPercentage.message}</p>}
              </div>
            </div>
          </div>

          {/* Eligible branches selection checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-text-medium mb-2 uppercase">Eligible Academic Branches</label>
            <div className="flex flex-wrap gap-4 bg-slate-950/20 p-3 border border-slate-850 rounded-lg">
              {['CS', 'IT', 'ENTC'].map((branch) => (
                <label key={branch} className="flex items-center gap-2 text-sm text-text-high cursor-pointer select-none">
                  <input
                    type="checkbox"
                    value={branch}
                    {...register('eligibleBranches')}
                    className="accent-brand-blue rounded h-4 w-4 bg-slate-900 border-slate-800"
                  />
                  <span>{branch}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase font-medium">Bond / Internship Details</label>
            <input
              type="text"
              placeholder="e.g. No bond, 6 months internship required."
              {...register('bondDetails')}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Drive Scope / Remarks</label>
            <textarea
              rows={3}
              placeholder="Detailed schedule of selection tests and interview formats..."
              {...register('description', { required: 'Drive description is required' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Recruitment Drive'
            )}
          </button>
        </form>
      </Drawer>

      {/* Drawer: Drive details display */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Placement Drive Profile"
      >
        {selectedDrive && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
              <div className="p-3 bg-brand-cyan/10 text-brand-cyan rounded-xl">
                <Briefcase size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white leading-tight">{selectedDrive.title}</h4>
                <span className="text-xs text-brand-blue font-semibold">{selectedDrive.companyName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Drive Date</span>
                <span className="text-sm font-semibold text-white">{selectedDrive.driveDate}</span>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Application Deadline</span>
                <span className="text-sm font-semibold text-white">{new Date(selectedDrive.deadline).toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl col-span-2">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Bond / Hiring Conditions</span>
                <span className="text-sm font-semibold text-white">{selectedDrive.bondDetails || 'No specific bond terms'}</span>
              </div>
            </div>

            {/* Threshold limits */}
            <div className="space-y-3 p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5 text-brand-cyan">
                <Award size={14} /> Academic Eligibility Requirements
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">Minimum CGPA</span>
                  <span className="text-base font-bold text-brand-blue">{selectedDrive.minimumCgpa.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">Max Backlogs</span>
                  <span className="text-base font-bold text-white">{selectedDrive.allowedBacklogs}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">Min 10th %</span>
                  <span className="text-base font-bold text-white">{selectedDrive.minimumTenthPercentage}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">Min 12th %</span>
                  <span className="text-base font-bold text-white">{selectedDrive.minimumTwelfthPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Eligible Branches */}
            <div className="space-y-2 p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide block">Eligible Branches</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDrive.eligibleBranches?.map(branch => (
                  <span key={branch} className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-text-high rounded border border-slate-700/50">
                    {branch}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide flex items-center gap-1 text-brand-blue">
                <ShieldCheck size={12} /> Drive Scope & Schedule
              </span>
              <p className="text-text-medium text-xs leading-relaxed whitespace-pre-wrap pt-1.5">
                {selectedDrive.description}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DriveManagement;
