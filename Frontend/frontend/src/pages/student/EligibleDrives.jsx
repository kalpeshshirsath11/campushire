import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { DriveCardSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { Briefcase, Calendar, MapPin, DollarSign, Award, Clock, Search, Filter } from 'lucide-react';

const EligibleDrives = () => {
  const [drives, setDrives] = useState([]);
  const [appliedDriveIds, setAppliedDriveIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');

  useEffect(() => {
    const fetchEligibleData = async () => {
      try {
        // Fetch eligible drives
        const drivesResponse = await axiosClient.get('/drives/eligible');
        const drivesList = drivesResponse.data?.success ? drivesResponse.data.data : [];
        setDrives(drivesList);

        // Fetch student applications to identify already applied drives
        const appsResponse = await axiosClient.get('/applications/me');
        if (appsResponse.data?.success && appsResponse.data?.data) {
          const appliedIds = new Set(appsResponse.data.data.map(app => app.driveId));
          setAppliedDriveIds(appliedIds);
        }
      } catch (error) {
        // Handled globally or profile is not completed/verified
      } finally {
        setIsLoading(false);
      }
    };
    fetchEligibleData();
  }, []);

  const handleApply = async (driveId) => {
    const toastId = toast.loading('Submitting job application...');
    try {
      const response = await axiosClient.post(`/drives/${driveId}/apply`);
      if (response.data?.success) {
        toast.success('Successfully applied to placement drive!', { id: toastId });
        setAppliedDriveIds(prev => new Set([...prev, driveId]));
      } else {
        toast.error(response.data?.message || 'Failed to submit application', { id: toastId });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error occurred. Verify eligibility.';
      toast.error(errorMsg, { id: toastId });
    }
  };

  // Filter drives by search term and branch
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = 
      drive.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = 
      branchFilter === 'ALL' || 
      drive.eligibleBranches?.includes(branchFilter);

    return matchesSearch && matchesBranch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Eligible Job Openings</h2>
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DriveCardSkeleton />
          <DriveCardSkeleton />
          <DriveCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Eligible Placement Drives</h2>
          <p className="text-text-low text-sm">
            Active corporate drives matching your academic eligibility (CGPA, backlogs, branch, and marks).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-850 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue/50"
          />
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={16} className="text-text-low" />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-900/60 border border-slate-850 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue/50"
          >
            <option value="ALL">All Branches</option>
            <option value="CS">CS Only</option>
            <option value="IT">IT Only</option>
            <option value="ENTC">ENTC Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Drives */}
      {filteredDrives.length === 0 ? (
        <EmptyState 
          title="No Eligible Drives Available" 
          description="There are currently no published recruitment drives that match your profile credentials, or your profile is still pending verification by the TPO."
          icon={Briefcase}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => {
            const isApplied = appliedDriveIds.has(drive.id);
            const isDeadlinePassed = new Date(drive.deadline) < new Date();

            return (
              <div key={drive.id} className="glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-blue to-brand-cyan"></div>
                
                <div>
                  {/* Title and Company */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base tracking-wide truncate max-w-[180px]" title={drive.title}>
                        {drive.title}
                      </h3>
                      <span className="text-xs text-brand-blue font-semibold">{drive.companyName}</span>
                    </div>
                    
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      isDeadlinePassed 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                        : isApplied 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/10'
                    }`}>
                      {isDeadlinePassed ? 'Closed' : isApplied ? 'Applied' : 'Open'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-medium text-xs line-clamp-3 mb-4 leading-relaxed">
                    {drive.description}
                  </p>

                  {/* Core details list */}
                  <div className="space-y-2 border-t border-slate-850 pt-4 mb-4">
                    <div className="flex items-center gap-2 text-xs text-text-medium">
                      <DollarSign size={14} className="text-brand-cyan shrink-0" />
                      <span>Package Offered: <span className="font-semibold text-white">{drive.minimumCgpa ? 'N/A' : 'TBD'} (Check details)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-medium">
                      <Calendar size={14} className="text-brand-blue shrink-0" />
                      <span>Drive Date: <span className="font-semibold text-white">{drive.driveDate}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-medium">
                      <Clock size={14} className="text-red-400 shrink-0" />
                      <span className="truncate">Deadline: <span className="font-semibold text-white">{new Date(drive.deadline).toLocaleString()}</span></span>
                    </div>
                  </div>

                  {/* Academic Requirements */}
                  <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-lg space-y-1.5 mb-4">
                    <span className="text-[9px] uppercase font-bold text-text-low tracking-wide block">Eligibility Criteria</span>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-text-medium">
                      <div className="flex items-center gap-1.5">
                        <Award size={10} className="text-brand-cyan" />
                        <span>Min CGPA: <strong>{drive.minimumCgpa.toFixed(2)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={10} className="text-brand-violet" />
                        <span>Max Backlogs: <strong>{drive.allowedBacklogs}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={10} className="text-text-low" />
                        <span>10th %: <strong>{drive.minimumTenthPercentage}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={10} className="text-text-low" />
                        <span>12th %: <strong>{drive.minimumTwelfthPercentage}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Branches */}
                  <div className="mb-6">
                    <span className="text-[9px] uppercase font-bold text-text-low tracking-wide block mb-1.5">Eligible Branches</span>
                    <div className="flex flex-wrap gap-1.5">
                      {drive.eligibleBranches?.map(branch => (
                        <span key={branch} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-text-high rounded border border-slate-700/50">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(drive.id)}
                  disabled={isApplied || isDeadlinePassed}
                  className={`w-full py-2 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
                    isApplied 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed' 
                      : isDeadlinePassed 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed' 
                        : 'bg-brand-blue hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/10'
                  }`}
                >
                  {isApplied ? 'Application Submitted' : isDeadlinePassed ? 'Closed' : 'Submit Application'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EligibleDrives;
