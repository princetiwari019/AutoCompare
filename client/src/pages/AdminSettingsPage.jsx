import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ShieldCheck, Lock, Key, LogOut, ArrowLeft, CheckCircle, ShieldAlert, User } from 'lucide-react';
import { changeAdminPassword, logoutAdmin, getCurrentAdmin } from '../services/adminService';

const AdminSettingsPage = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentAdmin()
      .then((res) => {
        if (res.success && res.user) {
          setAdminUser(res.user);
        }
      })
      .catch((err) => console.error('Error fetching admin profile', err));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword || loading) return;

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await changeAdminPassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        setSuccessMsg(res.message || 'Password changed successfully! Please log in again.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          logoutAdmin();
          navigate('/admin/login');
        }, 2000);
      } else {
        setError(res.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Admin Settings</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">Account & Security</h1>
          <p className="text-xs text-slate-400">
            Manage your administrative account information and security credentials.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Account Info Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <User className="w-4 h-4 text-cyan-400" />
          <span>1. Account Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">Name</span>
            <span className="font-extrabold text-white">{adminUser?.name || 'Administrator'}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">Email</span>
            <span className="font-extrabold text-white">{adminUser?.email || 'admin@autocompare.com'}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">Role</span>
            <span className="font-extrabold text-cyan-400 uppercase">{adminUser?.role || 'ADMIN'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>2. Security & Password Change</span>
        </h3>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">New Password * (Min 8 chars, A-Z, a-z, 0-9)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Logout Session Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Sign Out of Admin Session</h4>
          <p className="text-xs text-slate-400 mt-0.5">Revoke administrative token and return to public website.</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
