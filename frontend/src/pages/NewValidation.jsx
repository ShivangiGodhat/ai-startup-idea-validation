import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lightbulb, Compass, Award, Building, Globe, Layers, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';

export default function NewValidation() {
  const navigate = useNavigate();
  
  // Form States
  const [startupName, setStartupName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('AI & Machine Learning');
  const [targetMarket, setTargetMarket] = useState('');
  const [country, setCountry] = useState('Global');
  const [businessModel, setBusinessModel] = useState('Subscription');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Analyzing market size and demand indexes...",
    "Scanning industry databases for major competitors...",
    "Assembling SWOT strengths, threats, and gaps matrix...",
    "Formulating optimal pricing tiers and revenue metrics...",
    "Generating standard 1-page business structures...",
    "Finalizing readiness index scores and pitch summaries..."
  ];

  // Effect to cycle through loading steps
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const examples = [
    {
      name: "ResumeAI Pro",
      desc: "An AI-powered resume builder that automatically tailors job applications to matching keyword algorithms on ATS systems.",
      industry: "AI & Machine Learning",
      market: "Recent college graduates and job seekers",
      country: "USA",
      model: "Freemium"
    },
    {
      name: "CampusBites",
      desc: "Hyper-local peer-to-peer food delivery app specifically for university dorms and campuses.",
      industry: "E-Commerce & Delivery",
      market: "College students",
      country: "Canada",
      model: "Marketplace"
    },
    {
      name: "MediSync",
      desc: "HIPAA-compliant telemedicine platform connecting small clinics with freelance medical scribes.",
      industry: "Healthcare & Medtech",
      market: "Private clinical practices",
      country: "Global",
      model: "Subscription"
    },
    {
      name: "LingoFlow",
      desc: "Interactive learning app teaching corporate jargon and professional business english through role-playing games.",
      industry: "Edtech & Education",
      market: "Corporate professionals and immigrants",
      country: "Global",
      model: "Subscription"
    }
  ];

  const loadExample = (ex) => {
    setStartupName(ex.name);
    setDescription(ex.desc);
    setIndustry(ex.industry);
    setTargetMarket(ex.market);
    setCountry(ex.country);
    setBusinessModel(ex.model);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startupName || !description || !industry || !targetMarket || !country || !businessModel) {
      return setError("Please fill in all inputs to run the analysis.");
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/validation/submit', {
        startupName,
        description,
        industry,
        targetMarket,
        country,
        businessModel
      });

      // Redirect to report details page
      navigate(`/report/${response.data.report._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Validation failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
          {/* Scanning Radar sonar */}
          <div className="absolute h-20 w-20 animate-sonar rounded-full bg-indigo-500/20"></div>
          {/* Bulb Icon */}
          <Lightbulb className="absolute h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h3 className="font-display mt-8 text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          StartupSense AI is working
        </h3>
        
        {/* Animated Loading Text */}
        <p className="mt-2 text-sm text-indigo-600 font-medium animate-pulse dark:text-indigo-400 text-center max-w-sm">
          {loadingSteps[loadingStep]}
        </p>

        {/* Progress Dots */}
        <div className="mt-6 flex gap-1.5 justify-center">
          {loadingSteps.map((_, index) => (
            <span 
              key={index} 
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index <= loadingStep ? 'bg-indigo-600 scale-120' : 'bg-slate-300'}`}
            ></span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Headings */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Validate Your Idea</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Enter your startup details below to trigger our comprehensive AI validation engine.
        </p>
      </div>

      {/* Examples Grid */}
      <div className="mt-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-3 text-center">
          Or Load An Example Concept
        </span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadExample(ex)}
              className="flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-center dark:border-slate-850 dark:bg-slate-900 transition-all text-xs"
            >
              <span className="font-bold text-slate-700 dark:text-slate-200">{ex.name}</span>
              <span className="mt-1 text-[10px] text-slate-400 truncate w-full">{ex.industry}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs text-red-650 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Startup Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
              Startup Name
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lightbulb className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="e.g. FitScan, AgriDrone, EduBot"
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Startup Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-300">
              Startup Description (Describe the problem and your solution)
            </label>
            <textarea
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exactly what your product or service does, the core features, and the primary benefit it provides to customers."
              className="mt-1 block w-full rounded-xl border border-slate-250 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-955/45 dark:focus:border-indigo-400"
            ></textarea>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
              Industry Segment
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Building className="h-4.5 w-4.5" />
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Healthcare & Medtech">Healthcare & Medtech</option>
                <option value="Fintech & Finance">Fintech & Finance</option>
                <option value="Edtech & Education">Edtech & Education</option>
                <option value="E-Commerce & Delivery">E-Commerce & Delivery</option>
                <option value="SaaS & Productivity">SaaS & Productivity</option>
                <option value="Clean Energy & Climate Tech">Clean Energy & Climate Tech</option>
                <option value="Entertainment & Gaming">Entertainment & Gaming</option>
                <option value="Agrotech & Farming">Agrotech & Farming</option>
                <option value="Hardware & Robotics">Hardware & Robotics</option>
              </select>
            </div>
          </div>

          {/* Preferred Business Model */}
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
              Business Model
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <select
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value)}
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              >
                <option value="Subscription">Subscription (SaaS)</option>
                <option value="Freemium">Freemium</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Advertising">Advertising / Media</option>
                <option value="Enterprise">Enterprise Contracts</option>
                <option value="Transactional">Transactional Fees</option>
              </select>
            </div>
          </div>

          {/* Target Market */}
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
              Target Market Audience
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Target className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="e.g. Small business owners, Teens, Developers"
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
              Target Country / Region
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. USA, Germany, Global"
                className="block w-full rounded-xl border border-slate-250 bg-slate-50 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/45 dark:focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl bg-indigo-650 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Zap className="mr-1.5 h-4.5 w-4.5 text-amber-300" />
          Generate Validation Report
          <ArrowRight className="ml-2 h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
