import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Drawer from '../../components/Drawer';
import toast from 'react-hot-toast';
import { FileSpreadsheet, Briefcase, User, Mail, Calendar, HelpCircle, Check, X, Loader2 } from 'lucide-react';

const Applications = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isLoadingDrives, setIsLoadingDrives] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stageRemarks, setStageRemarks] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  // Fetch published drives on load
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await axiosClient.get('/drives');
        if (response.data?.success && response.data.data.length > 0) {
          setDrives(response.data.data);
          // Set first drive as default selected
          setSelectedDriveId(response.data.data[0].id);
        }
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoadingDrives(false);
      }
    };
    fetchDrives();
  }, []);

  // Fetch applications when selected drive changes
  useEffect(() => {
    if (!selectedDriveId) return;

    const fetchApplications = async () => {
      setIsLoadingApps(true);
      try {
        const response = await axiosClient.get(`/applications/drives/${selectedDriveId}`);
        if (response.data?.success) {
          setApplications(response.data.data);
        }
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoadingApps(false);
      }
    };

    fetchApplications();
  }, [selectedDriveId]);

  const handleReviewStatus = (app) => {
    setSelectedApp(app);
    setSelectedStage(app.status);
    setStageRemarks(app.remarks || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Updating recruitment stage...');
    try {
      await axiosClient.put(`/applications/${selectedApp.id}/status`, {
        status: selectedStage,
        remarks: stageRemarks
      });

      toast.success('Recruitment stage updated successfully!', { id: toastId });
      setIsDrawerOpen(false);
      
      // Refresh list
      const response = await axiosClient.get(`/applications/drives/${selectedDriveId}`);
      if (response.data?.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update selection status.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Selected</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>;
      case 'APPLIED':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">Applied</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">{status}</span>;
    }
  };

  if (isLoadingDrives) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Recruitment Stage Coordinations</h2>
          <p className="text-text-low text-sm">Advance applied candidates through active selection rounds.</p>
        </div>
        
        {/* Drive Selector */}
        {drives.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-xs font-semibold text-text-low uppercase shrink-0">Placement Drive</span>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="bg-slate-900/60 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue/50 w-full md:w-auto"
            >
              {drives.map(drive => (
                <option key={drive.id} value={drive.id}>{drive.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {drives.length === 0 ? (
        <EmptyState 
          title="No Placement Drives Published"
          description="Create a recruitment drive in the drives tab before managing candidate applications."
          icon={Briefcase}
        />
      ) : isLoadingApps ? (
        <TableSkeleton rows={4} />
      ) : applications.length === 0 ? (
        <EmptyState 
          title="No Registered Applicants"
          description="No students have applied to this recruitment drive yet."
          icon={FileSpreadsheet}
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden border border-slate-850">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-text-low font-semibold border-b border-slate-850">
                  <th className="p-4 pl-6">Candidate PRN</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Candidate Email</th>
                  <th className="p-4">Current Stage</th>
                  <th className="p-4">Update Notes</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-850/25 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-white">{app.studentPrn}</td>
                    <td className="p-4 font-medium text-white">{app.studentName}</td>
                    <td className="p-4 text-text-medium">{app.studentEmail}</td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-text-low max-w-[200px] truncate" title={app.remarks || 'No remarks yet'}>
                      {app.remarks || 'N/A'}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleReviewStatus(app)}
                        className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/20 text-xs font-semibold rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer"
                      >
                        Advance Stage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer: Advance Stage Form */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Advance Candidate Stage: ${selectedApp?.studentPrn}`}
      >
        {selectedApp && (
          <form onSubmit={handleUpdateStatus} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
              <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white leading-tight">{selectedApp.studentName}</h4>
                <span className="text-xs text-text-low flex items-center gap-1 mt-0.5">
                  <Mail size={12} /> {selectedApp.studentEmail}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl col-span-2">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Recruitment Drive</span>
                <span className="text-sm font-semibold text-white">{selectedApp.driveTitle} ({selectedApp.companyName})</span>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Applied Date</span>
                <span className="text-xs font-semibold text-white">
                  {new Date(selectedApp.appliedAt).toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Current Status</span>
                <span className="text-xs font-semibold text-white">{selectedApp.status}</span>
              </div>
            </div>

            {/* Selection Status Dropdown Selector */}
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Select New Selection Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              >
                <option value="APPLIED">Applied (Screening)</option>
                <option value="APTITUDE">Aptitude Test</option>
                <option value="TECHNICAL">Technical Round</option>
                <option value="HR">HR Interview</option>
                <option value="SELECTED">Selected (Offer Issued)</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Remarks Input */}
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Stage Remarks / Feedback</label>
              <textarea
                rows={4}
                value={stageRemarks}
                onChange={(e) => setStageRemarks(e.target.value)}
                placeholder="Cleared coding test. Passed technical round 1..."
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Recruitment Stage'
              )}
            </button>
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default Applications;
