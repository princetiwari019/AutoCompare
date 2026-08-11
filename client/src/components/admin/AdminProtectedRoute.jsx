import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentAdmin } from '../../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    getCurrentAdmin()
      .then((res) => {
        if (res.success && res.user && res.user.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Verifying Administrator Permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
