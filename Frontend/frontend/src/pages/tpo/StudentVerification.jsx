import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Drawer from '../../components/Drawer';
import toast from 'react-hot-toast';
import { 
  UserCheck, 
  Check, 
  X, 
  ExternalLink, 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Award
} from 'lucide-react';

const StudentVerification = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axiosClient.get('/students');
      if (response.data?.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleReview = (student) => {
    setSelectedStudent(student);
    setRemarks(student.remarks || '');
    setIsDrawerOpen(true);
  };

  const handleVerify = async (statusVal) => {
    if (!selectedStudent) return;
    if (statusVal === 'REJECTED' && !remarks.trim()) {
      toast.error('Please provide rejection remarks/feedback.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`${statusVal === 'VERIFIED' ? 'Approving' : 'Rejecting'} profile...`);
    try {
      await axiosClient.put(`/students/${selectedStudent.id}/verify`, {
        status: statusVal,
        remarks: remarks
      });
      toast.success(`Profile verification updated to ${statusVal}!`, { id: toastId });
      setIsDrawerOpen(false);
      fetchStudents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update verification status.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pending</span>;
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.prn?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      student.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Student Verification Queue</h2>
          <p className="text-text-low text-sm">Review student registrations and approve credentials for placement drives.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by PRN, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-850 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900/60 border border-slate-850 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-blue/50 w-full md:w-auto shrink-0"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending Only</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="REJECTED">Rejected Only</option>
        </select>
      </div>

      {/* Table grid */}
      {filteredStudents.length === 0 ? (
        <EmptyState 
          title="No Verification Tickets"
          description="No student profiles match the filter options."
          icon={UserCheck}
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden border border-slate-850">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-text-low font-semibold border-b border-slate-850">
                  <th className="p-4 pl-6">PRN</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Completeness</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredStudents.map((student) => {
                  const getCompleteness = (s) => {
                    let fields = [s.fullName, s.phone, s.personalEmail, s.address, s.cgpa, s.resumeLink];
                    let filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
                    return Math.round((filled / fields.length) * 100);
                  };
                  const comp = getCompleteness(student);

                  return (
                    <tr key={student.id} className="hover:bg-slate-850/25 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-white">{student.prn}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{student.fullName || 'Uncompleted'}</span>
                          <span className="text-[11px] text-text-low">{student.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-medium">{student.branch || 'N/A'}</td>
                      <td className="p-4 text-brand-blue font-semibold">{student.cgpa !== null ? student.cgpa.toFixed(2) : 'N/A'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-[100px]">
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-blue h-1.5 rounded-full" style={{ width: `${comp}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-text-low">{comp}%</span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(student.verificationStatus)}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleReview(student)}
                          className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white border border-brand-blue/20 text-xs font-semibold rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer"
                        >
                          Review Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer Review Panel */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Review Candidate: ${selectedStudent?.prn}`}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Demographic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Full Name</span>
                <span className="text-sm font-semibold text-white">{selectedStudent.fullName || 'Not provided'}</span>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">College Email</span>
                <span className="text-sm font-semibold text-white break-all">{selectedStudent.email}</span>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Branch</span>
                <span className="text-sm font-semibold text-white">{selectedStudent.branch || 'Not provided'}</span>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Phone Number</span>
                <span className="text-sm font-semibold text-white">{selectedStudent.phone || 'Not provided'}</span>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-3 p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5 text-brand-violet">
                <Award size={14} /> Academics Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">CGPA</span>
                  <span className="text-base font-bold text-brand-blue">{selectedStudent.cgpa !== null ? selectedStudent.cgpa.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">Backlogs</span>
                  <span className="text-base font-bold text-white">{selectedStudent.backlogs !== null ? selectedStudent.backlogs : 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">10th %</span>
                  <span className="text-base font-bold text-white">{selectedStudent.tenthPercentage !== null ? `${selectedStudent.tenthPercentage}%` : 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-low uppercase">12th %</span>
                  <span className="text-base font-bold text-white">{selectedStudent.twelfthPercentage !== null ? `${selectedStudent.twelfthPercentage}%` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Document link cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Submitted Document links</h4>
              <div className="space-y-2">
                {[
                  { label: 'Resume File', url: selectedStudent.resumeLink, name: selectedStudent.resumeFileName },
                  { label: '10th Marksheet', url: selectedStudent.tenthMarksheetLink, name: selectedStudent.tenthMarksheetFileName },
                  { label: '12th Marksheet', url: selectedStudent.twelfthMarksheetLink, name: selectedStudent.twelfthMarksheetFileName },
                  { label: 'Degree Result', url: selectedStudent.degreeResultLink, name: selectedStudent.degreeResultFileName },
                  { label: 'Aadhaar Card', url: selectedStudent.aadhaarLink, name: selectedStudent.aadhaarFileName },
                  { label: 'Profile Picture', url: selectedStudent.photoLink, name: selectedStudent.photoFileName },
                ]
                .filter(doc => doc.url)
                .map(doc => (
                  <div key={doc.label} className="p-3 bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-lg flex items-center justify-between gap-4 transition-colors">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block">{doc.label}</span>
                      <span className="text-[10px] text-text-low truncate block max-w-[300px]">{doc.name}</span>
                    </div>
                    <a 
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-cyan hover:text-white transition-colors"
                    >
                      Open Link <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Form */}
            <div className="space-y-4 pt-4 border-t border-slate-850">
              <div>
                <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Verification Remarks / Feedback</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Checked certificate marks against scores..."
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleVerify('REJECTED')}
                  disabled={isSubmitting}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Reject Profile
                </button>
                <button
                  onClick={() => handleVerify('VERIFIED')}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Verify & Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default StudentVerification;
