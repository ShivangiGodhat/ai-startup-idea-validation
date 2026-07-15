import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, Calendar, Mail, User, ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/auth/admin/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load user records.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-xl bg-red-50 p-4 text-red-650 dark:bg-red-950/20">
          <ShieldAlert className="mx-auto h-10 w-10" />
          <h3 className="mt-4 font-bold text-lg">Access Denied</h3>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /> Admin Console
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage system parameters and review user registration files.
        </p>
      </div>

      {/* Admin stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <span className="mt-4 block text-2xl font-extrabold tracking-tight">{users.length}</span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Users</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <Shield className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="mt-4 block text-2xl font-extrabold tracking-tight">
            {users.filter(u => u.role === 'admin').length}
          </span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Administrators</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <Calendar className="h-5 w-5 text-violet-500" />
          </div>
          <span className="mt-4 block text-xs font-semibold tracking-tight text-slate-650 dark:text-slate-350">
            System Online (Live template buffers active)
          </span>
          <span className="mt-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">System Status</span>
        </div>
      </div>

      {/* Users management table */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="font-display font-bold text-lg">User Accounts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-950/10 dark:border-slate-800/60">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 font-semibold flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      u.role === 'admin' 
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/50' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
