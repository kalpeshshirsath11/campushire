import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Loader2, User, Mail, Phone, MapPin, Award, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/students/profile/me');
        if (response.data?.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        // Handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={14} /> Verified Profile
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle size={14} /> Verification Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <AlertTriangle size={14} /> Pending Verification
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50svh]">
        <Loader2 size={36} className="animate-spin text-brand-blue" />
        <span className="text-text-low text-sm mt-4">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card rounded-xl p-8 text-center max-w-md mx-auto my-8">
        <AlertTriangle size={32} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No Profile Found</h3>
        <p className="text-text-low text-sm mb-6">You have not completed your profile yet.</p>
        <Link 
          to="/student/complete-profile" 
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-2.5 text-sm inline-block"
        >
          Create Profile Now
        </Link>
      </div>
    );
  }

  const documentList = [
    { label: 'Resume', url: profile.resumeLink, name: profile.resumeFileName },
    { label: '10th Marksheet', url: profile.tenthMarksheetLink, name: profile.tenthMarksheetFileName },
    { label: '12th Marksheet', url: profile.twelfthMarksheetLink, name: profile.twelfthMarksheetFileName },
    { label: 'Latest Sem Degree Result', url: profile.degreeResultLink, name: profile.degreeResultFileName },
    { label: 'Aadhaar Card', url: profile.aadhaarLink, name: profile.aadhaarFileName },
    { label: 'Profile Photo', url: profile.photoLink, name: profile.photoFileName }
  ].filter(doc => doc.url);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">My Profile</h2>
          <p className="text-text-low text-sm">PRN: <span className="text-white font-semibold">{profile.prn}</span></p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(profile.verificationStatus)}
          <Link 
            to="/student/complete-profile"
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 text-xs font-semibold rounded-lg px-4 py-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {profile.remarks && (
        <div className={`p-4 rounded-xl border ${
          profile.verificationStatus === 'REJECTED' 
            ? 'bg-red-500/10 border-red-500/20 text-red-400' 
            : 'bg-slate-800 border-slate-700 text-text-medium'
        }`}>
          <span className="font-semibold block text-xs uppercase tracking-wide mb-1 text-white">
            Verification Remarks / Feedback
          </span>
          <p className="text-sm">{profile.remarks}</p>
        </div>
      )}

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Details Card */}
        <div className="glass-card rounded-xl p-6 space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3 text-brand-blue">
            <User size={18} />
            <h3 className="font-semibold text-white">Personal Contact</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">Full Name</span>
              <span className="text-sm font-medium text-white">{profile.fullName || 'Not provided'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">College Email</span>
              <span className="text-sm font-medium text-white break-all">{profile.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">Personal Email</span>
              <span className="text-sm font-medium text-white break-all">{profile.personalEmail || 'Not provided'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">Phone Number</span>
              <span className="text-sm font-medium text-white">{profile.phone || 'Not provided'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">Home Address</span>
              <span className="text-sm font-medium text-white flex items-start gap-1">
                <MapPin size={14} className="shrink-0 mt-0.5 text-text-low" />
                {profile.address || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="glass-card rounded-xl p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3 text-brand-violet">
            <Award size={18} />
            <h3 className="font-semibold text-white">Academic Performance</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide mb-1">Branch</span>
              <span className="text-lg font-bold text-white">{profile.branch || 'N/A'}</span>
            </div>
            
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide mb-1">CGPA</span>
              <span className="text-lg font-bold text-brand-blue">{profile.cgpa !== null ? profile.cgpa.toFixed(2) : 'N/A'}</span>
            </div>

            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide mb-1">10th Percentage</span>
              <span className="text-lg font-bold text-white">{profile.tenthPercentage !== null ? `${profile.tenthPercentage.toFixed(2)}%` : 'N/A'}</span>
            </div>

            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide mb-1">12th Percentage</span>
              <span className="text-lg font-bold text-white">{profile.twelfthPercentage !== null ? `${profile.twelfthPercentage.toFixed(2)}%` : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-text-low tracking-wide">Active Backlogs</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                profile.backlogs > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {profile.backlogs} Active Backlogs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Verification Files Card */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3 text-brand-cyan">
          <CheckCircle size={18} />
          <h3 className="font-semibold text-white">Verification Files</h3>
        </div>

        {documentList.length === 0 ? (
          <p className="text-text-low text-xs">No files submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documentList.map((doc) => (
              <div 
                key={doc.label} 
                className="p-4 bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-xl flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">{doc.label}</span>
                  <span className="text-[10px] text-text-low truncate" title={doc.name}>
                    {doc.name}
                  </span>
                </div>
                <a 
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-brand-cyan rounded-lg hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Open in Google Drive"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
