import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

// Icons
import { 
  ArrowLeft, FileText, Presentation, Mail, RefreshCw, Award, Target, AlertTriangle, 
  CheckCircle, PlusCircle, MinusCircle, Flame, ShieldAlert, Sparkles 
} from 'lucide-react';

import ChatAssistant from '../components/ChatAssistant';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function ReportDetails() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailing, setEmailing] = useState(false);
  const [reRunning, setReRunning] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const fetchReportDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/validation/report/${reportId}`);
      setReport(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to retrieve validation report.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReport = async () => {
    setEmailing(true);
    try {
      const res = await axios.post(`/api/validation/report/${reportId}/email`);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    } finally {
      setEmailing(false);
    }
  };

  const handleReRun = async () => {
    if (!window.confirm("Are you sure you want to re-run this validation? This will fetch fresh metrics.")) return;
    setReRunning(true);
    try {
      const res = await axios.post(`/api/validation/report/${reportId}/re-run`);
      setReport(res.data.report);
      alert("Validation report updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update report.");
    } finally {
      setReRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/20 dark:text-red-400">
          <ShieldAlert className="mx-auto h-10 w-10" />
          <h3 className="mt-4 font-bold text-lg">Error Loading Report</h3>
          <p className="mt-1 text-xs">{error || 'Validation details could not be found.'}</p>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { startupId, validationScore, marketOpportunityScore, marketDemand, competitors, swot, revenueModel, riskAnalysis, investmentReadiness } = report;

  // Chart Data: Risk radar
  const riskChartData = {
    labels: ['Market Risk', 'Competition Risk', 'Financial Risk', 'Technical Risk', 'Legal Risk'],
    datasets: [
      {
        label: 'Risk Scores',
        data: [
          riskAnalysis.scores.market,
          riskAnalysis.scores.competition,
          riskAnalysis.scores.financial,
          riskAnalysis.scores.technical,
          riskAnalysis.scores.legal,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointHoverBackgroundColor: '#fff',
      },
    ],
  };

  // Chart Data: Investment Readiness Bar
  const readinessChartData = {
    labels: ['Scalability', 'Market Demand', 'Revenue Potential', 'Uniqueness', 'Competition Level'],
    datasets: [
      {
        label: 'Score (0-100)',
        data: [
          investmentReadiness.scores.scalability,
          investmentReadiness.scores.marketDemand,
          investmentReadiness.scores.revenuePotential,
          investmentReadiness.scores.uniqueness,
          investmentReadiness.scores.competition,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getScoreBorder = (score) => {
    if (score >= 80) return 'border-emerald-500/30';
    if (score >= 60) return 'border-amber-500/30';
    return 'border-red-500/30';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Navbar Actions Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReRun}
            disabled={reRunning}
            className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-55"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${reRunning ? 'animate-spin' : ''}`} />
            Re-run Analysis
          </button>
          <button
            onClick={handleEmailReport}
            disabled={emailing}
            className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-55"
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Email Report
          </button>
          <Link
            to={`/report/${reportId}/business-plan`}
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <FileText className="mr-1.5 h-4 w-4" />
            Business Plan
          </Link>
          <Link
            to={`/report/${reportId}/pitch-deck`}
            className="flex items-center justify-center rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            <Presentation className="mr-1.5 h-4 w-4" />
            Pitch Deck
          </Link>
        </div>
      </div>

      {/* Startup Concept Brief */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/10">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Validated Concept</span>
        </div>
        <h2 className="font-display mt-2 text-3xl font-extrabold">{startupId.startupName}</h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">{startupId.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>Industry: <span className="text-slate-700 dark:text-slate-300 font-bold">{startupId.industry}</span></div>
          <div>Model: <span className="text-slate-700 dark:text-slate-300 font-bold">{startupId.businessModel}</span></div>
          <div>Market: <span className="text-slate-700 dark:text-slate-300 font-bold">{startupId.targetMarket}</span></div>
          <div>Country: <span className="text-slate-700 dark:text-slate-300 font-bold">{startupId.country}</span></div>
        </div>
      </div>

      {/* Key Metric Scores */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* KPI 1 */}
        <div className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${getScoreBorder(validationScore)}`}>
          <div className="flex items-center justify-between text-slate-400">
            <Award className="h-5 w-5 text-indigo-500" />
          </div>
          <span className={`mt-4 block text-3xl font-extrabold tracking-tight ${getScoreColor(validationScore)}`}>
            {validationScore}/100
          </span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Validation Score</span>
        </div>

        {/* KPI 2 */}
        <div className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${getScoreBorder(marketOpportunityScore)}`}>
          <div className="flex items-center justify-between text-slate-400">
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <span className={`mt-4 block text-3xl font-extrabold tracking-tight ${getScoreColor(marketOpportunityScore)}`}>
            {marketOpportunityScore}/100
          </span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Market Score</span>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <span className="mt-4 block text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {competitors.saturationScore}%
          </span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Market Saturation</span>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <span className="mt-4 block text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {riskAnalysis.overallRiskScore}%
          </span>
          <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Risk</span>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="mt-10">
        <h3 className="font-display text-xl font-bold tracking-tight">SWOT Analysis</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/10">
            <h4 className="flex items-center text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="mr-1.5 h-4 w-4" /> Strengths
            </h4>
            <ul className="mt-3.5 space-y-2">
              {swot.strengths.map((str, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">• {str}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-red-200 bg-red-50/20 p-5 dark:border-red-900/30 dark:bg-red-950/10">
            <h4 className="flex items-center text-sm font-bold text-red-700 dark:text-red-400">
              <MinusCircle className="mr-1.5 h-4 w-4" /> Weaknesses
            </h4>
            <ul className="mt-3.5 space-y-2">
              {swot.weaknesses.map((weak, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">• {weak}</li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/20 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/10">
            <h4 className="flex items-center text-sm font-bold text-indigo-700 dark:text-indigo-400">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Opportunities
            </h4>
            <ul className="mt-3.5 space-y-2">
              {swot.opportunities.map((opp, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">• {opp}</li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/20 p-5 dark:border-amber-900/30 dark:bg-amber-950/10">
            <h4 className="flex items-center text-sm font-bold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mr-1.5 h-4 w-4" /> Threats
            </h4>
            <ul className="mt-3.5 space-y-2">
              {swot.threats.map((thr, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">• {thr}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Market Demand Analysis */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold">Market Opportunity & Sizing</h3>
          <div className="mt-4 space-y-4 text-xs leading-relaxed">
            <div>
              <span className="block font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Market Sizing (TAM/SAM/SOM)</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{marketDemand.marketSize}</p>
            </div>
            <div>
              <span className="block font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Demand Assessment</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{marketDemand.demandAnalysis}</p>
            </div>
            <div>
              <span className="block font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">CAGR & Growth Potential</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{marketDemand.growthPotential}</p>
            </div>
            <div>
              <span className="block font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Opportunity Summary</span>
              <p className="mt-1 text-slate-800 dark:text-slate-300 font-semibold">{marketDemand.marketSummary}</p>
            </div>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <h3 className="font-display text-lg font-bold mb-4">Competitor Landscape</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase dark:border-slate-800">
                  <th className="p-3">Competitor Name</th>
                  <th className="p-3">Strengths</th>
                  <th className="p-3">Weaknesses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {competitors.competitorList.map((comp, idx) => (
                  <tr key={idx} className="align-top hover:bg-slate-50/10 dark:hover:bg-slate-850/10">
                    <td className="p-3 font-semibold">
                      <div className="font-bold">{comp.companyName}</div>
                      <div className="font-normal text-[10px] text-slate-400 mt-1 max-w-[140px] leading-relaxed">{comp.description}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[180px] leading-relaxed">{comp.strengths}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[180px] leading-relaxed">{comp.weaknesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Visual Analytics / Charts */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Risk Analysis Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold mb-4">Risk Factors Index</h3>
          <div className="mx-auto aspect-square max-w-[280px] flex items-center justify-center">
            <Radar 
              data={riskChartData} 
              options={{
                scales: {
                  r: {
                    angleLines: { color: 'rgba(128,128,128,0.2)' },
                    grid: { color: 'rgba(128,128,128,0.2)' },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false }
                  }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* Investment Readiness Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold mb-4">Investment Readiness Metrics</h3>
          <div className="mx-auto flex aspect-video items-center justify-center w-full">
            <Bar 
              data={readinessChartData}
              options={{
                scales: {
                  y: {
                    grid: { color: 'rgba(128,128,128,0.1)' },
                    min: 0,
                    max: 100
                  },
                  x: {
                    grid: { display: false }
                  }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Revenue Generator */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-lg font-bold">Revenue Strategy & Pricing</h3>
        
        {/* Highlight Box */}
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/20 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/15">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Recommended Model</span>
          <h4 className="text-xl font-bold mt-1 text-indigo-700 dark:text-indigo-400">{revenueModel.recommendedModel}</h4>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{revenueModel.recommendedModelReason}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {revenueModel.options.map((opt, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-950/20 text-xs">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">{opt.modelName}</h5>
              <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">{opt.description}</p>
              
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">PROS</span>
                  <span className="text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">{opt.pros}</span>
                </div>
                <div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 block">CONS</span>
                  <span className="text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">{opt.cons}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisor Chat Panel Button widget */}
      <ChatAssistant reportId={reportId} />
    </div>
  );
}
