import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Briefcase, 
  FileSpreadsheet, 
  BarChart3, 
  KeyRound, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getLinks = () => {
    switch (user?.role) {
      case 'ROLE_TPO':
        return [
          { path: '/tpo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/tpo/tp-members', label: 'TP Members', icon: Users },
          { path: '/tpo/students', label: 'Student Database', icon: GraduationCap },
          { path: '/tpo/verify', label: 'Verification Queue', icon: UserCheck },
          { path: '/tpo/companies', label: 'Companies', icon: Building2 },
          { path: '/tpo/drives', label: 'Placement Drives', icon: Briefcase },
          { path: '/tpo/applications', label: 'Applications', icon: FileSpreadsheet },
          { path: '/tpo/reports', label: 'Analytics Reports', icon: BarChart3 },
        ];
      case 'ROLE_TP_MEMBER':
        return [
          { path: '/tp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/tp/students', label: 'Student Database', icon: GraduationCap },
          { path: '/tp/verify', label: 'Verification Queue', icon: UserCheck },
          { path: '/tp/companies', label: 'Companies', icon: Building2 },
          { path: '/tp/drives', label: 'Placement Drives', icon: Briefcase },
          { path: '/tp/applications', label: 'Applications', icon: FileSpreadsheet },
        ];
      case 'ROLE_STUDENT':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/student/complete-profile', label: 'Complete Profile', icon: UserCheck },
          { path: '/student/my-profile', label: 'My Profile', icon: GraduationCap },
          { path: '/student/eligible-drives', label: 'Eligible Drives', icon: Briefcase },
          { path: '/student/my-applications', label: 'My Applications', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const links = [
    ...getLinks(),
    { path: '/change-password', label: 'Change Password', icon: KeyRound }
  ];

  return (
    <aside 
      className={`glass-panel border-r border-slate-800 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header/Branding */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-brand-blue/10 rounded-lg text-brand-blue">
              <Briefcase size={22} className="shrink-0" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-white tracking-wider truncate text-lg">
                Campus<span className="text-brand-blue">Hire</span>
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-slate-800 bg-bg-slate hover:bg-slate-800 text-text-low hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue'
                      : 'text-text-low hover:text-text-high hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm truncate">{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
