import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize, Play, Award, Target } from 'lucide-react';


export default function PitchDeckPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    axios.get(`/api/validation/report/${reportId}`)
      .then(res => {
        setReport(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [reportId]);

  const handleExportPDF = () => {
    if (!report) return;
    setExporting(true);

    try {
      const { startupId, pitchDeck } = report;

      // Build same slides array as the UI
      const allSlides = [
        {
          title: 'Startup Introduction',
          number: 1,
          header: startupId.startupName,
          subHeader: `${startupId.industry} Solution`,
          body: `Conducting operations in: ${startupId.country}\nCore concept: ${startupId.description}`,
        },
        {
          title: '1. The Problem',
          number: 2,
          header: 'The Challenge',
          subHeader: 'Key pain points for target audience',
          body: pitchDeck.problem,
        },
        {
          title: '2. The Solution',
          number: 3,
          header: 'Our Platform',
          subHeader: 'Empowering users with automation',
          body: pitchDeck.solution,
        },
        {
          title: '3. Market Opportunity',
          number: 4,
          header: 'Market Sizing',
          subHeader: 'Total Addressable Sizing Metrics',
          body: pitchDeck.marketSize,
        },
        {
          title: '4. Business Model',
          number: 5,
          header: 'Revenue Metrics',
          subHeader: `Utilizing a ${startupId.businessModel} model`,
          body: pitchDeck.businessModel,
        },
        {
          title: '5. Market Traction',
          number: 6,
          header: 'Conceptual Traction',
          subHeader: 'Early proof points and beta sign-ups',
          body: pitchDeck.traction,
        },
        {
          title: '6. Financial Projections',
          number: 7,
          header: 'Growth Forecasts',
          subHeader: 'Expected ARR progression metrics',
          body: pitchDeck.financialForecast,
        },
        {
          title: '7. The Team',
          number: 8,
          header: 'Core Co-Founders',
          subHeader: 'Product engineering and sector professionals',
          body: pitchDeck.team,
        },
        {
          title: '8. Funding Ask',
          number: 9,
          header: 'Pre-Seed Fundraising',
          subHeader: 'Capital allocation and usage benchmarks',
          body: pitchDeck.fundingAsk,
        },
      ];

      // Landscape A4
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageW = 297;
      const pageH = 210;
      const margin = 20;
      const contentW = pageW - margin * 2;

      allSlides.forEach((slide, idx) => {
        if (idx > 0) pdf.addPage();

        // ── Dark background ──
        pdf.setFillColor(15, 23, 42);   // slate-950
        pdf.rect(0, 0, pageW, pageH, 'F');

        // Left accent strip (indigo)
        pdf.setFillColor(79, 70, 229);
        pdf.rect(0, 0, 6, pageH, 'F');

        // ── Top bar ──
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.2);
        pdf.setLineDashPattern([1, 1], 0);
        pdf.line(margin, 22, pageW - margin, 22);
        pdf.setLineDashPattern([], 0);

        // Slide label (top-left)
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(99, 102, 241); // indigo-500
        pdf.text(slide.title.toUpperCase(), margin, 16);

        // Slide counter (top-right)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(100, 116, 139); // slate-500
        pdf.text(`${slide.number} / ${allSlides.length}`, pageW - margin, 16, { align: 'right' });

        // ── Main content ──
        // Large header title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(26);
        pdf.setTextColor(255, 255, 255);
        const headerLines = pdf.splitTextToSize(slide.header, contentW - 20);
        let y = 38;
        headerLines.forEach(line => {
          pdf.text(line, margin, y);
          y += 11;
        });

        // Sub-header
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(129, 140, 248); // indigo-400
        pdf.text(slide.subHeader, margin, y + 2);
        y += 12;

        // Divider line
        pdf.setDrawColor(30, 41, 59); // slate-800
        pdf.setLineWidth(0.4);
        pdf.setLineDashPattern([], 0);
        pdf.line(margin, y, pageW - margin, y);
        y += 8;

        // Body text
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(203, 213, 225); // slate-300
        const bodyLines = pdf.splitTextToSize(slide.body || '', contentW);
        bodyLines.forEach(line => {
          if (y < pageH - 22) {
            pdf.text(line, margin, y);
            y += 5;
          }
        });

        // ── Bottom bar ──
        pdf.setDrawColor(30, 41, 59);
        pdf.setLineWidth(0.2);
        pdf.setLineDashPattern([1, 1], 0);
        pdf.line(margin, pageH - 16, pageW - margin, pageH - 16);
        pdf.setLineDashPattern([], 0);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(71, 85, 105); // slate-600
        pdf.text('StartupSense AI Pitch Builder', margin, pageH - 9);
        pdf.text('Confidential & Proprietary', pageW - margin, pageH - 9, { align: 'right' });
      });

      pdf.save(`${startupId.startupName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pitch_deck.pdf`);
    } catch (err) {
      console.error('Pitch deck PDF failed:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-xl bg-red-50 p-4 text-red-650 dark:bg-red-950/20">
          <p className="text-xs">Pitch Deck information could not be found.</p>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-650">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { startupId, pitchDeck } = report;

  const slides = [
    {
      title: "Startup Introduction",
      number: 1,
      header: startupId.startupName,
      subHeader: `${startupId.industry} Solution`,
      body: `Conducting operations in: ${startupId.country}\nCore concept: ${startupId.description}`
    },
    {
      title: "1. The Problem",
      number: 2,
      header: "The Challenge",
      subHeader: "Key pain points for target audience",
      body: pitchDeck.problem
    },
    {
      title: "2. The Solution",
      number: 3,
      header: "Our Platform",
      subHeader: "Empowering users with automation",
      body: pitchDeck.solution
    },
    {
      title: "3. Market Opportunity",
      number: 4,
      header: "Market Sizing",
      subHeader: "Total Addressable Sizing Metrics",
      body: pitchDeck.marketSize
    },
    {
      title: "4. Business Model",
      number: 5,
      header: "Revenue Metrics",
      subHeader: `Utilizing a ${startupId.businessModel} model`,
      body: pitchDeck.businessModel
    },
    {
      title: "5. Market Traction",
      number: 6,
      header: "Conceptual Traction",
      subHeader: "Early proof points and beta sign-ups",
      body: pitchDeck.traction
    },
    {
      title: "6. Financial Projections",
      number: 7,
      header: "Growth Forecasts",
      subHeader: "Expected ARR progression metrics",
      body: pitchDeck.financialForecast
    },
    {
      title: "7. The Team",
      number: 8,
      header: "Core Co-Founders",
      subHeader: "Product engineering and sector professionals",
      body: pitchDeck.team
    },
    {
      title: "8. Funding Ask",
      number: 9,
      header: "Pre-Seed Fundraising",
      subHeader: "Capital allocation and usage benchmarks",
      body: pitchDeck.fundingAsk
    }
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) setActiveSlide(activeSlide + 1);
  };

  const handlePrev = () => {
    if (activeSlide > 0) setActiveSlide(activeSlide - 1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/report/${reportId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Report
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-98 disabled:opacity-55 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Download className="mr-1.5 h-4.5 w-4.5" />
            {exporting ? 'Generating PDF...' : 'Export Deck PDF'}
          </button>
        </div>
      </div>

      {/* Main Slides Panel Frame */}
      <div className="mt-8 relative rounded-3xl border border-slate-200/80 bg-slate-900 shadow-2xl overflow-hidden aspect-video max-w-4xl mx-auto flex flex-col justify-between p-12 text-white" id="slide-content-view">
        {/* Slide Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 font-display">
            {slides[activeSlide].title}
          </span>
          <span className="text-xs font-semibold text-white/30">
            {slides[activeSlide].number} / {slides.length}
          </span>
        </div>

        {/* Slide Content View */}
        <div className="my-auto py-6">
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent">
            {slides[activeSlide].header}
          </h2>
          <h3 className="text-sm sm:text-base font-semibold text-indigo-300 mt-1">
            {slides[activeSlide].subHeader}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mt-6 leading-relaxed whitespace-pre-wrap max-w-3xl">
            {slides[activeSlide].body}
          </p>
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] uppercase font-semibold text-white/30 tracking-wider">
          <span>StartupSense AI Pitch Builder</span>
          <span>Confidential & Proprietary</span>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={handlePrev}
          disabled={activeSlide === 0}
          className="flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous Slide
        </button>

        {/* Slide Bullets */}
        <div className="hidden sm:flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i === activeSlide ? 'bg-indigo-600 scale-120' : 'bg-slate-300 dark:bg-slate-700'}`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={activeSlide === slides.length - 1}
          className="flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350"
        >
          Next Slide <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
