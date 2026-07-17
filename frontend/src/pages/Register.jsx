

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { KeyRound, Mail, User, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setError('');
    setLoading(true);

    try {

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post('https://ai-startup-idea-validation-ncko.vercel.app/api/auth/register', { name, email, password });
      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-650 text-white shadow-md dark:bg-indigo-500">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h2 className="font-display mt-6 text-3xl font-extrabold tracking-tight">Create your account</h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-550 dark:text-indigo-400">
              Log in
            </Link>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs text-red-650 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:focus:border-indigo-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-98 disabled:opacity-70 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {loading ? 'Creating Account...' : 'Register'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
