import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { loginAdmin } from '../services/adminService';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl shadow-cyan-950/20">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Authentication</h1>
          <p className="text-xs text-slate-400">
            Enter administrator credentials to access AutoCompare management portal.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@autocompare.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLoginPage;
