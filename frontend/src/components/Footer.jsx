import React from 'react';
import { Lightbulb, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
                <Lightbulb className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-lg">StartupSense AI</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering early-stage entrepreneurs with data-backed, AI-driven validation. Analyze market sizing, SWOT parameters, competitor landscapes, and generate investor-ready business plans in minutes.
            </p>
          </div>

          {/* Nav Links Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#features" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Features</a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Pricing</a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Socials Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Connect</h3>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} StartupSense AI. All rights reserved. Built with Advanced Agentic AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
