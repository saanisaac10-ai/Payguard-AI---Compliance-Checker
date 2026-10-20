import React from 'react';
import { UploadCloud, ShieldAlert, FileSpreadsheet, Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  flaggedCount: number;
  resolvedCount: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onSelectStep,
  flaggedCount,
  resolvedCount,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Upload & Configure',
      description: 'Attendance sheets, KYC packs & HRMS mapping',
      icon: UploadCloud,
    },
    {
      step: 2,
      title: 'AI Statutory Audit Engine',
      description: `${flaggedCount} exceptions flagged (${resolvedCount} remediated)`,
      icon: ShieldAlert,
    },
    {
      step: 3,
      title: '1-Click Clean Export',
      description: 'Sanitized HRMS CSV & Form T CLRA Certificate',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                onClick={() => onSelectStep(s.step)}
                className={`flex items-start gap-3 p-3 text-left rounded-lg transition-all border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-emerald-400'
                          : isCompleted
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold truncate ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-0.5 truncate ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {s.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
