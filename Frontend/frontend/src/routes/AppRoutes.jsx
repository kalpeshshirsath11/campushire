import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import ChangePassword from '../pages/auth/ChangePassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// TPO Pages
import TpoDashboard from '../pages/tpo/TpoDashboard';
import TpMembersManagement from '../pages/tpo/TpMembersManagement';
import StudentManagement from '../pages/tpo/StudentManagement';
import StudentVerification from '../pages/tpo/StudentVerification';
import CompanyManagement from '../pages/tpo/CompanyManagement';
import DriveManagement from '../pages/tpo/DriveManagement';
import Applications from '../pages/tpo/Applications';
import Reports from '../pages/tpo/Reports';

// TP Member Pages
import TpDashboard from '../pages/tpMember/TpDashboard';
import TpVerificationQueue from '../pages/tpMember/TpVerificationQueue';
import TpApplications from '../pages/tpMember/TpApplications';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import CompleteProfile from '../pages/student/CompleteProfile';
import MyProfile from '../pages/student/MyProfile';
import EligibleDrives from '../pages/student/EligibleDrives';
import MyApplications from '../pages/student/MyApplications';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root Path Redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated && user ? (
            user.role === 'ROLE_TPO' ? (
              <Navigate to="/tpo/dashboard" replace />
            ) : user.role === 'ROLE_TP_MEMBER' ? (
              <Navigate to="/tp/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Authenticated Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        {/* Change Password is safe for any logged in user */}
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />

        {/* TPO Routes */}
        <Route 
          path="/tpo/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <TpoDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/tp-members" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <TpMembersManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/students" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <StudentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/verify" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <StudentVerification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/companies" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <CompanyManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/drives" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <DriveManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/applications" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <Applications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tpo/reports" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TPO']}>
              <Reports />
            </ProtectedRoute>
          } 
        />

        {/* TP Member Routes */}
        <Route 
          path="/tp/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <TpDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tp/students" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <StudentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tp/verify" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <TpVerificationQueue />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tp/companies" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <CompanyManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tp/drives" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <DriveManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tp/applications" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_TP_MEMBER']}>
              <TpApplications />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/complete-profile" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <CompleteProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/my-profile" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <MyProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/eligible-drives" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <EligibleDrives />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/my-applications" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <MyApplications />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
