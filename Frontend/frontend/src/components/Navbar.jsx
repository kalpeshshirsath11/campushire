import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_TPO':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
            TPO Staff
          </span>
        );
      case 'ROLE_TP_MEMBER':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
            TP Member
          </span>
        );
      case 'ROLE_STUDENT':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            Student
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="glass-panel border-b border-slate-800 h-16 w-full px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search / Section Info Placeholder */}
      <div>
        <span className="text-sm text-text-low font-medium">
          Workspace / {user?.role?.replace('ROLE_', '')?.replace('_', ' ')} Portal
        </span>
      </div>

      {/* User Information Controls */}
      <div className="flex items-center gap-4">
        {getRoleBadge(user?.role)}
        
        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-between justify-center text-text-medium">
            <User size={16} className="m-auto" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-text-high tracking-wide truncate max-w-[150px]">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
