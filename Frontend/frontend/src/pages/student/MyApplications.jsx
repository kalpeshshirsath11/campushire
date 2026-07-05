import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Timeline from '../../components/Timeline';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { FileSpreadsheet, Building2, Calendar, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosClient.get('/applications/me');
        if (response.data?.success) {
          setApplications(response.data.data);
          // Set first application as default selected if exists
          if (response.data.data.length > 0) {
            setSelectedApp(response.data.data[0]);
          }
        }
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SELECTED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'REJECTED':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'APPLIED':
        return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
      default:
        return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20';
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">My Applications</h2>
        <p className="text-text-low text-sm">Track your progress and selection rounds in active placement drives.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState 
          title="No Applications Submitted"
          description="You have not registered for any placement drives yet. Complete your profile and check eligible jobs to apply."
          icon={FileSpreadsheet}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list (left side) */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-[10px] uppercase font-bold text-text-low tracking-wide block mb-1">Job List</span>
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedApp?.id === app.id
                    ? 'bg-slate-800/80 border-brand-blue shadow-lg shadow-brand-blue/5'
                    : 'glass-card border-slate-850 hover:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-bold text-white text-sm truncate max-w-[140px]" title={app.driveTitle}>
                    {app.driveTitle}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border shrink-0 ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-brand-blue mb-2.5 font-medium">
                  <Building2 size={12} />
                  <span>{app.companyName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-text-low">
                  <Calendar size={12} />
                  <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Application Detail Timeline viewport (right side) */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="glass-card rounded-xl p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">{selectedApp.driveTitle}</h3>
                    <span className="text-sm text-brand-blue font-semibold">{selectedApp.companyName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-text-low block">Status</span>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-xs font-bold rounded-full border uppercase ${getStatusColor(selectedApp.status)}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline Tracking */}
                <div className="py-4 border-b border-slate-850">
                  <span className="text-[10px] uppercase font-bold text-text-low tracking-wide block mb-6">Recruitment Selection Stages</span>
                  <Timeline currentStatus={selectedApp.status} />
                </div>

                {/* Stage remarks */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-900/50 border border-slate-850 rounded-xl">
                    <Info size={16} className="text-brand-cyan shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold block text-white mb-1">Status Remarks / Feedback</span>
                      <p className="text-text-medium leading-relaxed">
                        {selectedApp.remarks || 'Your application is under initial screening. TPO staff will update details as interview stages progress.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-text-low pl-1">
                    <ShieldCheck size={12} />
                    <span>Verified candidate PRN: {selectedApp.studentPrn}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-10 glass-card rounded-xl text-text-low text-xs">
                Select a job application from the list to view its tracking timeline.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
