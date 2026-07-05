import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { CardSkeleton } from '../../components/SkeletonLoader';
import { 
  UserCheck, 
  Briefcase, 
  FileSpreadsheet, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    eligibleCount: 0,
    appliedCount: 0,
    shortlistedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch student profile
        const profileResponse = await axiosClient.get('/students/profile/me');
        const profileData = profileResponse.data?.success ? profileResponse.data.data : null;
        setProfile(profileData);

        // Fetch applications to extract counts
        const appsResponse = await axiosClient.get('/applications/me');
        const apps = appsResponse.data?.success ? appsResponse.data.data : [];
        
        // Fetch eligible drives count
        let eligibleCount = 0;
        if (profileData && profileData.verificationStatus === 'VERIFIED') {
          const drivesResponse = await axiosClient.get('/drives/eligible');
          if (drivesResponse.data?.success) {
            eligibleCount = drivesResponse.data.data.length;
          }
        }

        setStats({
          eligibleCount,
          appliedCount: apps.length,
          shortlistedCount: apps.filter(app => ['TECHNICAL', 'HR', 'SELECTED'].includes(app.status)).length
        });
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getProfileCompleteness = (prof) => {
    if (!prof) return 0;
    let fields = [
      prof.fullName, prof.phone, prof.personalEmail, prof.address, 
      prof.cgpa, prof.tenthPercentage, prof.twelfthPercentage, 
      prof.resumeLink, prof.tenthMarksheetLink, prof.twelfthMarksheetLink, 
      prof.degreeResultLink, prof.aadhaarLink, prof.photoLink
    ];
    let filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = getProfileCompleteness(profile);

  const getVerificationCard = () => {
    if (!profile) {
      return (
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-yellow-500 bg-yellow-500/5">
          <div className="flex gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl h-fit">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">Create Your Profile</h3>
              <p className="text-text-medium text-sm leading-relaxed">
                You have not registered your profile details. Complete your academic details and document links to start applying for jobs.
              </p>
            </div>
          </div>
          <Link 
            to="/student/complete-profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-yellow-400 font-semibold hover:text-white transition-colors"
          >
            Complete Profile Now <ArrowRight size={14} />
          </Link>
        </div>
      );
    }

    const status = profile.verificationStatus;
    if (status === 'VERIFIED') {
      return (
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-emerald-500 bg-emerald-500/5">
          <div className="flex gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">Account Verified</h3>
              <p className="text-text-medium text-sm leading-relaxed">
                Your academic documents and percentages are verified by the TPO. You are now eligible to apply to recruitment drives matching your credentials.
              </p>
            </div>
          </div>
          <Link 
            to="/student/eligible-drives"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:text-white transition-colors"
          >
            View Eligible Jobs <ArrowRight size={14} />
          </Link>
        </div>
      );
    } else if (status === 'REJECTED') {
      return (
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-red-500 bg-red-500/5">
          <div className="flex gap-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl h-fit">
              <XCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">Verification Rejected</h3>
              <p className="text-text-medium text-sm leading-relaxed">
                The TPO rejected your verification request. Remarks: <strong className="text-white">"{profile.remarks}"</strong>. Correct your document links and resubmit.
              </p>
            </div>
          </div>
          <Link 
            to="/student/complete-profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-red-400 font-semibold hover:text-white transition-colors"
          >
            Correct Profile details <ArrowRight size={14} />
          </Link>
        </div>
      );
    } else {
      return (
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-yellow-500 bg-yellow-500/5">
          <div className="flex gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl h-fit">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">Pending Verification</h3>
              <p className="text-text-medium text-sm leading-relaxed">
                Your profile updates were submitted successfully. Waiting for TPO/TP Member review. You will be notified once details are approved.
              </p>
            </div>
          </div>
          <Link 
            to="/student/my-profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-yellow-400 font-semibold hover:text-white transition-colors"
          >
            Inspect Submitted Profile <ArrowRight size={14} />
          </Link>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {profile?.fullName || 'Candidate'}</h2>
        <span className="text-sm text-text-low font-medium">CampusHire Placements Dashboard</span>
      </div>

      {/* Verification / Actions panel */}
      {getVerificationCard()}

      {/* Completion tracker for Profile */}
      {profile && completeness < 100 && (
        <div className="glass-card rounded-xl p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-white">Profile Completion Progress</span>
            <span className="text-brand-blue font-bold">{completeness}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brand-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-text-low block">
            Add missing document URLs to complete profile registration. Let the TPO review correct scores.
          </span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-blue"></div>
          <div>
            <span className="text-xs font-semibold text-text-low uppercase tracking-wider block mb-1">Applied Drives</span>
            <span className="text-3xl font-extrabold text-white">{stats.appliedCount}</span>
          </div>
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
            <FileSpreadsheet size={20} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-violet"></div>
          <div>
            <span className="text-xs font-semibold text-text-low uppercase tracking-wider block mb-1">Shortlisted / Active</span>
            <span className="text-3xl font-extrabold text-brand-violet">{stats.shortlistedCount}</span>
          </div>
          <div className="p-3 bg-brand-violet/10 text-brand-violet rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-cyan"></div>
          <div>
            <span className="text-xs font-semibold text-text-low uppercase tracking-wider block mb-1">Eligible Jobs</span>
            <span className="text-3xl font-extrabold text-brand-cyan">{stats.eligibleCount}</span>
          </div>
          <div className="p-3 bg-brand-cyan/10 text-brand-cyan rounded-xl">
            <Briefcase size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
