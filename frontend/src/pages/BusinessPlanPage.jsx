import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, FileText, CheckCircle, HelpCircle } from 'lucide-react';

export default function BusinessPlanPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeSection, setActiveSection] = useState('summary');

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
      const { businessPlan, startupId } = report;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = margin;

      const checkPage = (needed = 12) => {
        if (y + needed > pageH - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      const writeWrapped = (text, fontSize, color, bold = false) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text || '', contentW);
        lines.forEach(line => {
          checkPage(fontSize * 0.4);
          pdf.text(line, margin, y);
          y += fontSize * 0.42;
        });
      };

      // ── Header gradient bar ──
      pdf.setFillColor(79, 70, 229);
      pdf.rect(0, 0, pageW, 38, 'F');
      pdf.setFillColor(124, 58, 237);
      pdf.rect(pageW * 0.55, 0, pageW * 0.45, 38, 'F');

      // Logo text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text('STARTUPSENSE AI', margin, 12);

      // Title
      pdf.setFontSize(18);
      pdf.text(startupId.startupName, margin, 24);

      // Subtitle
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(200, 200, 255);
      pdf.text('Business Plan Document  ·  ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), margin, 33);

      y = 48;

      // Startup Meta
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, contentW, 18, 3, 3, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont('helvetica', 'normal');
      const meta = `Industry: ${startupId.industry}   |   Model: ${startupId.businessModel}   |   Market: ${startupId.targetMarket}   |   Country: ${startupId.country}`;
      pdf.text(meta, margin + 4, y + 7);
      pdf.setFontSize(7.5);
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin + 4, y + 13);
      y += 26;

      // Sections
      const sections = [
        { title: '1. Executive Summary',     content: businessPlan.executiveSummary },
        { title: '2. Problem Statement',     content: businessPlan.problemStatement },
        { title: '3. Solution Value',        content: businessPlan.solution },
        { title: '4. Target Customers',      content: businessPlan.targetCustomers },
        { title: '5. Revenue Model',         content: businessPlan.revenueModel },
        { title: '6. Marketing & GTM',       content: businessPlan.marketingStrategy },
        { title: '7. Growth Roadmap',        content: businessPlan.growthPlan },
        { title: '8. Financial Projections', content: businessPlan.financialProjection },
        { title: '9. Funding Ask',           content: businessPlan.fundingRequirement },
      ];

      sections.forEach(sec => {
        checkPage(18);
        // Section accent bar
        pdf.setFillColor(79, 70, 229);
        pdf.rect(margin, y, 2.5, 7, 'F');
        // Section title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(17, 24, 39);
        pdf.text(sec.title.toUpperCase(), margin + 5, y + 5.5);
        y += 11;
        // Section body
        writeWrapped(sec.content, 9, [55, 65, 81]);
        y += 7;
      });

      // Footer on last page
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.setFont('helvetica', 'normal');
      pdf.text('StartupSense AI — Confidential & Proprietary', margin, pageH - 8);
      pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageW - margin, pageH - 8, { align: 'right' });

      pdf.save(`${startupId.startupName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_business_plan.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
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
          <p className="text-xs">Business plan could not be found.</p>
        </div>
        <Link to="/dashboard" className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-650">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { businessPlan, startupId } = report;

  const sections = [
    { id: 'summary', name: 'Executive Summary', refId: 'sec-summary' },
    { id: 'problem', name: 'Problem Statement', refId: 'sec-problem' },
    { id: 'solution', name: 'Solution Value', refId: 'sec-solution' },
    { id: 'customers', name: 'Target Customers', refId: 'sec-customers' },
    { id: 'model', name: 'Revenue Model', refId: 'sec-model' },
    { id: 'marketing', name: 'Marketing & GTM', refId: 'sec-marketing' },
    { id: 'growth', name: 'Growth Roadmap', refId: 'sec-growth' },
    { id: 'financials', name: 'Financial Projections', refId: 'sec-financials' },
    { id: 'funding', name: 'Funding Ask', refId: 'sec-funding' }
  ];

  const handleScrollTo = (section) => {
    setActiveSection(section.id);
    const element = document.getElementById(section.refId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/report/${reportId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
          <ArrowLeft className="mr-1.5 h-4.5 w-4.5" /> Back to Report
        </Link>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 active:scale-98 disabled:opacity-55 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Download className="mr-1.5 h-4.5 w-4.5" />
          {exporting ? 'Generating PDF...' : 'Export PDF'}
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar Index */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 px-3">Document Outline</h3>
            <div className="mt-4 space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    activeSection === sec.id 
                      ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' 
                      : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Document Frame */}
        <div className="flex-grow">
          {/* Printable White Paper Box */}
          <div 
            id="business-plan-document" 
            className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-slate-900 print:shadow-none print:border-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            {/* Header Document Sheet */}
            <div className="border-b border-slate-200 pb-8 dark:border-slate-850">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-6 w-6" />
                <span className="font-display text-sm font-bold tracking-wider uppercase">Business Plan Document</span>
              </div>
              <h2 className="font-display mt-4 text-3xl font-extrabold">{startupId.startupName}</h2>
              <p className="mt-2 text-xs text-slate-450 leading-relaxed max-w-2xl">
                Generated via AI matching templates for {startupId.industry} startups operating in {startupId.country} under the {startupId.businessModel} model.
              </p>
            </div>

            {/* Document body sections */}
            <div className="mt-8 space-y-8 text-xs leading-relaxed text-slate-700 dark:text-slate-350">
              {/* Executive Summary */}
              <section id="sec-summary" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">1. Executive Summary</h4>
                <p className="mt-3 text-justify">{businessPlan.executiveSummary}</p>
              </section>

              {/* Problem Statement */}
              <section id="sec-problem" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">2. Problem Statement</h4>
                <p className="mt-3 text-justify">{businessPlan.problemStatement}</p>
              </section>

              {/* Solution */}
              <section id="sec-solution" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">3. Solution Value</h4>
                <p className="mt-3 text-justify">{businessPlan.solution}</p>
              </section>

              {/* Target Customers */}
              <section id="sec-customers" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">4. Target Customers</h4>
                <p className="mt-3 text-justify">{businessPlan.targetCustomers}</p>
              </section>

              {/* Revenue Model */}
              <section id="sec-model" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">5. Revenue Model</h4>
                <p className="mt-3 text-justify">{businessPlan.revenueModel}</p>
              </section>

              {/* Marketing strategy */}
              <section id="sec-marketing" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">6. Marketing & GTM Strategy</h4>
                <p className="mt-3 text-justify">{businessPlan.marketingStrategy}</p>
              </section>

              {/* Growth roadmap */}
              <section id="sec-growth" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">7. Growth Roadmap</h4>
                <p className="mt-3 text-justify">{businessPlan.growthPlan}</p>
              </section>

              {/* Financial Projection */}
              <section id="sec-financials" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">8. Financial Projections</h4>
                <p className="mt-3 text-justify">{businessPlan.financialProjection}</p>
              </section>

              {/* Funding Requirement */}
              <section id="sec-funding" className="scroll-mt-24">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">9. Funding Ask</h4>
                <p className="mt-3 text-justify">{businessPlan.fundingRequirement}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
