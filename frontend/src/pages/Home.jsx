import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Sparkles, Compass, ShieldCheck, TrendingUp, Presentation, FileText, Bot, ArrowRight, Zap, Target } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/30 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-500" />
          <span>Next-Generation Startup Incubator</span>
        </div>
        
        <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white leading-tight">
          Validate Your Startup Idea <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            Before You Invest A Single Dollar
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Stop relying on guesswork. StartupSense AI utilizes advanced language models and real-time market templates to generate comprehensive SWOT analysis, revenue plans, competitor maps, and exportable business structures in seconds.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={user ? "/new-validation" : "/register"}
            className="group flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-98 transition-all"
          >
            Start Validating Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center rounded-xl border border-slate-350 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Explore Features
          </a>
        </div>

        {/* Demo Stats Row */}
        <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center divide-x divide-slate-200 dark:divide-slate-800">
            <div className="p-4">
              <span className="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">0 - 100</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Readiness Index</span>
            </div>
            <div className="p-4">
              <span className="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">10 Secs</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Report Speed</span>
            </div>
            <div className="p-4">
              <span className="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">SWOT</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Interactive Matrix</span>
            </div>
            <div className="p-4">
              <span className="block text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">PDF / PPT</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">One-click Exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Complete AI validation Suite
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Everything you need to turn a vague concept into an investor-ready startup.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Market Demand Analysis</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find out whether people are actively searching for your solution. Get growth CAGR rates, TAM / SAM estimates, and general demand reviews.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Competitor Intelligence</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Identify competitors automatically. Compare strengths and weaknesses, evaluate market saturation scores, and identify gaps to exploit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">SWOT Grid Generation</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize your strengths, weaknesses, opportunities, and threats inside detailed, responsive grids optimized for modern pitch standards.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Revenue Modeling</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore subscription, freemium, or marketplace structures. Find the recommended setup and write down pros/cons for each financial layer.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">AI Business Plan Document</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate a structured business plan outline containing Executive Summary, GTM strategy, cost estimates, and financial projections. Export as PDF.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glow-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Presentation className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Interactive Pitch Slides</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Draft pitch layouts describing the problem, solution, TAM sizing, and traction. Seamlessly preview slides online and print/export to PDF.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
