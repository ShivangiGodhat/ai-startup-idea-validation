import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { Plus, Search, Eye, RefreshCw, Trash2, LayoutDashboard, Award, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [reRunningId, setReRunningId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/validation/history');
      setReports(response.data);
    } catch (err) {
      console.error("Failed to load validations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this validation report? This action cannot be undone.")) return;
    setDeletingId(reportId);
    try {
      await axios.delete(`/api/validation/report/${reportId}`);
      setReports(reports.filter(r => r._id !== reportId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReRun = async (reportId) => {
    setReRunningId(reportId);
    try {
      const res = await axios.post(`/api/validation/report/${reportId}/re-run`);
      alert("Validation updated successfully!");
      // Update reports state in place
      setReports(reports.map(r => r._id === reportId ? res.data.report : r));
    } catch (err) {
      console.error(err);
      alert("Failed to re-run validation.");
    } finally {
      setReRunningId(null);
    }
  };

  const filteredReports = reports.filter(r => 
    r.startupId.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.startupId.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Calculations
  const totalValidations = reports.length;
  const avgScore = totalValidations > 0 
    ? Math.round(reports.reduce((acc, curr) => acc + curr.validationScore, 0) / totalValidations) 
    : 0;
  
  // Find top industry
  const industries = reports.map(r => r.startupId.industry);
  const topIndustry = industries.length > 0
    ? industries.reduce((a, b, i, arr) => arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
    : 'None';

  // Average risk score
  const avgRisk = totalValidations > 0
    ? Math.round(reports.reduce((acc, curr) => acc + curr.riskAnalysis.overallRiskScore, 0) / totalValidations)
    : 0;

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40';
    if (score >= 60) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40';
    return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-800/40';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.name}. Manage your startup idea validations.
          </p>
        </div>
        <div>
          <Link
            to="/new-validation"
            className="flex items-center justify-center rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-98 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Plus className="mr-1.5 h-4.5 w-4.5" />
            New Validation
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <LayoutDashboard className="h-5 w-5 text-indigo-500" />
          </div>
          <span className="mt-4 block text-2xl font-extrabold tracking-tight">{totalValidations}</span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">Validations</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <Award className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="mt-4 block text-2xl font-extrabold tracking-tight">{avgScore}%</span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">Avg AI Score</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
          </div>
          <span className="mt-4 block text-lg font-extrabold truncate tracking-tight">{topIndustry}</span>
          <span className="mt-2 block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">Top Industry</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <span className="mt-4 block text-2xl font-extrabold tracking-tight">{avgRisk}%</span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">Avg Risk Rating</span>
        </div>
      </div>

      {/* Validations List */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display font-bold text-lg">My Reports</h3>
          <div className="relative max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-350 border-t-indigo-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h4 className="mt-4 font-bold text-lg">No validation reports found</h4>
            <p className="mt-1 max-w-md text-xs text-slate-550 dark:text-slate-400">
              {searchQuery ? "No matches for your search keywords." : "You haven't validated any startup ideas yet. Submit your first concept to see detailed statistics and reports."}
            </p>
            {!searchQuery && (
              <Link
                to="/new-validation"
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500"
              >
                Validate Your First Idea
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-950/10 dark:border-slate-800/60">
                  <th className="px-6 py-4">Startup Concept</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4 text-center">AI Score</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 font-semibold">
                      <div className="max-w-[200px] truncate">{report.startupId.startupName}</div>
                      <div className="max-w-[300px] truncate text-[10px] font-normal text-slate-400">{report.startupId.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50/50 px-2.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/10">
                        {report.startupId.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{report.startupId.country}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${getScoreBadgeColor(report.validationScore)}`}>
                        {report.validationScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/report/${report._id}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800"
                          title="View Report Details"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Link>
                        <button
                          onClick={() => handleReRun(report._id)}
                          disabled={reRunningId === report._id}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-650 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
                          title="Re-run AI Analysis"
                        >
                          <RefreshCw className={`h-4.5 w-4.5 ${reRunningId === report._id ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          disabled={deletingId === report._id}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/20"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
