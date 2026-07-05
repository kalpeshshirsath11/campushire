import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { CardSkeleton, TableSkeleton } from '../../components/SkeletonLoader';
import { Users, UserCheck, Building2, Briefcase, ChevronRight, TrendingUp, CheckCircle } from 'lucide-react';

const TpoDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    totalCompanies: 0,
    totalDrives: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await axiosClient.get('/students');
        const companiesResponse = await axiosClient.get('/companies');
        const drivesResponse = await axiosClient.get('/drives');
        const reportsResponse = await axiosClient.get('/applications/reports');

        const studentsList = studentsResponse.data?.success ? studentsResponse.data.data : [];
        const companiesList = companiesResponse.data?.success ? companiesResponse.data.data : [];
        const drivesList = drivesResponse.data?.success ? drivesResponse.data.data : [];
        const appsList = reportsResponse.data?.success ? reportsResponse.data.data : [];

        setStats({
          totalStudents: studentsList.length,
          verifiedStudents: studentsList.filter(s => s.verificationStatus === 'VERIFIED').length,
          totalCompanies: companiesList.length,
          totalDrives: drivesList.length
        });

        // Show top 4 recent applications
        setRecentApps(appsList.slice(0, 4));
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">TPO Executive Dashboard</h2>
        <p className="text-text-low text-sm">System-wide placements tracking and corporate hiring overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-blue"></div>
          <div>
            <span className="text-[10px] font-bold text-text-low uppercase tracking-wider block mb-1">Registered Students</span>
            <span className="text-3xl font-extrabold text-white">{stats.totalStudents}</span>
          </div>
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
            <Users size={20} />
          </div>
        </div>

        {/* Verified Students */}
        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-cyan"></div>
          <div>
            <span className="text-[10px] font-bold text-text-low uppercase tracking-wider block mb-1">Verified Profiles</span>
            <span className="text-3xl font-extrabold text-brand-cyan">{stats.verifiedStudents}</span>
          </div>
          <div className="p-3 bg-brand-cyan/10 text-brand-cyan rounded-xl">
            <UserCheck size={20} />
          </div>
        </div>

        {/* Total Companies */}
        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-violet"></div>
          <div>
            <span className="text-[10px] font-bold text-text-low uppercase tracking-wider block mb-1">Hiring Partners</span>
            <span className="text-3xl font-extrabold text-brand-violet">{stats.totalCompanies}</span>
          </div>
          <div className="p-3 bg-brand-violet/10 text-brand-violet rounded-xl">
            <Building2 size={20} />
          </div>
        </div>

        {/* Total Drives */}
        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
          <div>
            <span className="text-[10px] font-bold text-text-low uppercase tracking-wider block mb-1">Published Drives</span>
            <span className="text-3xl font-extrabold text-emerald-400">{stats.totalDrives}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Briefcase size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Activity (left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-blue" />
              Recent Recruitment Registrations
            </h3>
            <Link 
              to="/tpo/applications"
              className="text-xs text-brand-blue hover:text-white transition-colors flex items-center gap-0.5 font-semibold"
            >
              Manage Stages <ChevronRight size={14} />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center text-text-low text-xs">
              No recent application logs recorded.
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden border border-slate-850">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/50 text-text-low font-semibold border-b border-slate-850">
                      <th className="p-3.5 pl-5">Candidate</th>
                      <th className="p-3.5">Hiring Partner</th>
                      <th className="p-3.5">Placement Drive</th>
                      <th className="p-3.5 pr-5 text-right">Stage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {recentApps.map((app, index) => (
                      <tr key={index} className="hover:bg-slate-850/10 transition-colors">
                        <td className="p-3.5 pl-5 font-semibold text-white">{app.studentName}</td>
                        <td className="p-3.5 text-brand-blue">{app.companyName}</td>
                        <td className="p-3.5 text-text-medium">{app.driveTitle}</td>
                        <td className="p-3.5 pr-5 text-right">
                          <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${
                            app.status === 'SELECTED' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : app.status === 'REJECTED' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Verification Alert Center (right 1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              <CheckCircle size={18} className="text-brand-cyan" />
              Work Queue
            </h3>
            <Link 
              to="/tpo/verify"
              className="text-xs text-brand-cyan hover:text-white transition-colors flex items-center gap-0.5 font-semibold"
            >
              Verify Queue <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3.5 border-l-4 border-brand-cyan bg-brand-cyan/5">
            <span className="text-xs font-semibold text-white block">Verification Action Summary</span>
            <p className="text-text-medium text-xs leading-relaxed">
              There are <strong className="text-white">{stats.totalStudents - stats.verifiedStudents}</strong> student profiles currently awaiting academic verification or resubmission.
            </p>
            <Link 
              to="/tpo/verify"
              className="inline-block text-xs font-semibold text-brand-cyan hover:underline transition-colors"
            >
              Start Reviewing Tickets ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoDashboard;
