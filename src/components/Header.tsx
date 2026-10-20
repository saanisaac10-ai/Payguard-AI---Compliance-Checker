import React from 'react';
import { ShieldCheck, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenRulebook: () => void;
  onResetToDemo: () => void;
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRulebook,
  onResetToDemo,
  currentStep,
  onSelectStep,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectStep(1);
              }}
              className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
            >
              PayGuard AI
            </a>
          </div>

          {/* Zone 2: 4 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectStep(1)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentStep === 1 ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              1. Upload & Configure
            </button>
            <button
              onClick={() => onSelectStep(2)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentStep === 2 ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              2. Statutory Audit Engine
            </button>
            <button
              onClick={() => onSelectStep(3)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                currentStep === 3 ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              3. 1-Click Export
            </button>
            <button
              onClick={onOpenRulebook}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-300"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>2026 Statutory Rules</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onResetToDemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
              title="Reset data and reload Bengaluru QSR sample batch"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo Batch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
