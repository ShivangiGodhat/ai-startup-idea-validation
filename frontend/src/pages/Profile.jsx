import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (password && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const response = await axios.put('/api/auth/profile', payload);
      login(response.data, response.data.token);
      setMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update your profile information and password.
        </p>
      </div>

      {msg && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs text-red-650 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350">Full Name</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                <User className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-350">Email Address</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-455">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Role (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider text-[10px]">Account Role</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                disabled
                value={user?.role?.toUpperCase()}
                className="block w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-950/20"
              />
            </div>
          </div>

          {/* Password (Optional) */}
          <div className="border-t border-slate-100 pt-6 dark:border-slate-850">
            <h3 className="font-display font-semibold text-sm mb-4">Change Password (Leave blank to keep current)</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350">New Password</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-350">Confirm New Password</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-650 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-75 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
