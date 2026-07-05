import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is already authenticated, redirect to their home dashboard
  if (isAuthenticated && user) {
    if (user.role === 'ROLE_TPO') {
      return <Navigate to="/tpo/dashboard" replace />;
    } else if (user.role === 'ROLE_TP_MEMBER') {
      return <Navigate to="/tp/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep text-text-high flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-violet/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* App Logo/Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue mb-4">
            <Briefcase size={36} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider text-white">
            Campus<span className="text-brand-blue">Hire</span>
          </h1>
          <p className="text-text-low text-sm mt-2 text-center">
            Training & Placement Management System
          </p>
        </div>

        {/* Dynamic Inner Forms Rendering (Login, Reset, Forgot) */}
        <main className="glass-panel rounded-none p-8 border-4 border-double border-slate-700/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
