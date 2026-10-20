import React, { useState } from 'react';
import { 
  TargetHRMS, 
  StateRuleset, 
  ProcessingMode, 
  UploadedFileMeta, 
  EmployeeRecord 
} from '../types/payroll';
import { STATE_MIN_WAGE_BENCHMARKS, STATE_NAMES } from '../utils/statutoryRules';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Info,
  Server,
  Scale,
  Layers,
  MapPin,
  Check,
  Users
} from 'lucide-react';

interface UploadConfigureStepProps {
  processingMode: ProcessingMode;
  onSelectProcessingMode: (mode: ProcessingMode) => void;
  targetHrms: TargetHRMS;
  onSelectTargetHrms: (hrms: TargetHRMS) => void;
  stateRuleset: StateRuleset;
  onSelectStateRuleset: (state: StateRuleset) => void;
  onLoadBengaluruData: () => void;
  onLoadMultiStateData: () => void;
  onLoadEnterpriseScaleData?: () => void;
  onProceedToAudit: () => void;
  files: UploadedFileMeta[];
  onAddFiles: (files: UploadedFileMeta[]) => void;
  onRemoveFile: (index: number) => void;
  records: EmployeeRecord[];
}

export const UploadConfigureStep: React.FC<UploadConfigureStepProps> = ({
  processingMode,
  onSelectProcessingMode,
  targetHrms,
  onSelectTargetHrms,
  stateRuleset,
  onSelectStateRuleset,
  onLoadBengaluruData,
  onLoadMultiStateData,
  onLoadEnterpriseScaleData,
  onProceedToAudit,
  files,
  onAddFiles,
  onRemoveFile,
  records,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const activeBenchmark = STATE_MIN_WAGE_BENCHMARKS[stateRuleset];

  // Count employees per state in current records
  const stateCounts: Record<StateRuleset, number> = {
    karnataka_may2026: 0,
    maharashtra: 0,
    tamilnadu: 0,
    delhi_ncr: 0,
  };

  records.forEach((r) => {
    if (stateCounts[r.state] !== undefined) {
      stateCounts[r.state]++;
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles: UploadedFileMeta[] = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: `${Math.max(12, Math.round(f.size / 1024))} KB`,
        type: f.name.endsWith('.pdf') ? 'kyc_pack' : f.name.includes('vendor') ? 'vendor_invoice' : 'attendance',
        recordCount: processingMode === 'multi_state_batch' ? 21 : 12,
        timestamp: 'Just now',
      }));
      onAddFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFiles: UploadedFileMeta[] = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${Math.max(12, Math.round(f.size / 1024))} KB`,
        type: f.name.endsWith('.pdf') ? 'kyc_pack' : 'attendance',
        recordCount: processingMode === 'multi_state_batch' ? 21 : 12,
        timestamp: 'Just now',
      }));
      onAddFiles(uploadedFiles);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner introducing the step */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <span>Step 1 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Data Intake & Target Harmonization</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Upload Attendance Muster & Statutory Configuration
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Cross-reconcile biometrics, contractor agency invoices, and new-joiner KYC dossiers against 2026 statutory frameworks before generating payroll files.
            </p>
          </div>

          {/* Quick Demo Loaders */}
          <div className="shrink-0 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onLoadBengaluruData}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer ${
                processingMode === 'single_state'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Load single-state Bengaluru QSR sample dataset (12 records)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Bengaluru QSR Store Data</span>
            </button>

            <button
              onClick={onLoadMultiStateData}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer ${
                processingMode === 'multi_state_batch'
                  ? 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
              }`}
              title="Load multi-state national retail cluster across KA, MH, TN, DL (21 records)"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load Multi-State Demo (21 Staff)</span>
            </button>

            {onLoadEnterpriseScaleData && (
              <button
                onClick={onLoadEnterpriseScaleData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                title="Load multi-state enterprise roster scaled to 1,450 workers across 48 stores"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Load Enterprise Cluster (1,450 Staff)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector Segment */}
        <div className="pt-6 pb-2 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Audit Intake & Ruleset Processing Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Single State Mode Option */}
            <button
              type="button"
              onClick={() => onSelectProcessingMode('single_state')}
              className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                processingMode === 'single_state'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className={`w-4 h-4 ${processingMode === 'single_state' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>Single State Mode</span>
                </span>
                {processingMode === 'single_state' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${processingMode === 'single_state' ? 'text-slate-300' : 'text-slate-500'}`}>
                Apply one uniform state ruleset across all uploaded store rosters (ideal for single-city QSR chains).
              </p>
            </button>

            {/* Batch Multi-State Mode Option */}
            <button
              type="button"
              onClick={() => onSelectProcessingMode('multi_state_batch')}
              className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                processingMode === 'multi_state_batch'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className={`w-4 h-4 ${processingMode === 'multi_state_batch' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>Multi-State Batch Mode (Auto-Detected)</span>
                </span>
                {processingMode === 'multi_state_batch' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${processingMode === 'multi_state_batch' ? 'text-slate-300' : 'text-slate-500'}`}>
                Upload a consolidated national muster. PayGuard AI auto-detects employee state jurisdictions and routes each row to its state-specific minimum wage & overtime schedule.
              </p>
            </button>
          </div>
        </div>

        {/* Configuration Row: Target HRMS & State Ruleset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Target HRMS Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Target HRMS Output Schema</span>
            </label>
            <div className="relative">
              <select
                value={targetHrms}
                onChange={(e) => onSelectTargetHrms(e.target.value as TargetHRMS)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              >
                <option value="keka">Keka HR (Attendance & Salary Structure v2.4 CSV)</option>
                <option value="greythr">greytHR (Salary Upload & Monthly Pay Slip Batch)</option>
                <option value="darwinbox">Darwinbox (Payroll Interface Flat-File CSV)</option>
                <option value="razorpayx">RazorpayX Payroll (Direct Disbursement Batch)</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Auto-formats export headers, column keys, and decimal rounding specific to {targetHrms.toUpperCase()}.
            </p>
          </div>

          {/* State Ruleset Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {processingMode === 'single_state'
                  ? 'State Statutory Ruleset & Minimum Wage Gazette'
                  : 'Default Fallback State (for records without location)'}
              </span>
            </label>
            <div className="relative">
              <select
                value={stateRuleset}
                onChange={(e) => onSelectStateRuleset(e.target.value as StateRuleset)}
                disabled={processingMode === 'multi_state_batch'}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  processingMode === 'multi_state_batch'
                    ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900'
                }`}
              >
                <option value="karnataka_may2026">
                  Karnataka - May 2026 Revision (Shops & Commercial Est. VDA)
                </option>
                <option value="maharashtra">Maharashtra (Shops & Est. Act Minimum Wage Zone 1)</option>
                <option value="tamilnadu">Tamil Nadu (Catering & Commercial Est. MW Schedule)</option>
                <option value="delhi_ncr">Delhi NCR (Scheduled Employment High-Wage Order)</option>
              </select>
            </div>
            
            {processingMode === 'single_state' ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Zone 1 Floor:</span>
                <span className="font-semibold text-slate-700">₹{activeBenchmark.skilled.toLocaleString('en-IN')}/mo (Skilled)</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">₹{activeBenchmark.unskilled.toLocaleString('en-IN')}/mo (Unskilled)</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-state routing enabled. Each row automatically maps to its state gazette.</span>
              </div>
            )}
          </div>
        </div>

        {/* Multi-State Batch Partition Matrix (Only in Batch Mode) */}
        {processingMode === 'multi_state_batch' && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Auto-Detected State Jurisdictions ({records.length} Total Workers)
                </h3>
                <span className="text-xs text-slate-400">· 4 State Gazette Engines Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Karnataka Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Karnataka (Bengaluru)</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {stateCounts.karnataka_may2026} Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Floor: ₹18,450 (Skilled) / ₹14,920 (Unskilled)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Shops & Com. Est. May 2026 VDA
                </div>
              </div>

              {/* Maharashtra Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Maharashtra (Mumbai/Pune)</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {stateCounts.maharashtra} Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Floor: ₹17,850 (Skilled) / ₹14,450 (Unskilled)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Zone 1 Shops & Est. MW Schedule
                </div>
              </div>

              {/* Tamil Nadu Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tamil Nadu (Chennai)</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {stateCounts.tamilnadu} Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Floor: ₹17,200 (Skilled) / ₹14,100 (Unskilled)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Catering & Commercial Est. MW
                </div>
              </div>

              {/* Delhi NCR Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delhi NCR (Gurugram/Noida)</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {stateCounts.delhi_ncr} Staff
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Floor: ₹21,215 (Skilled) / ₹17,494 (Unskilled)
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  NCT Scheduled Employment Order
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".csv,.xlsx,.xls,.pdf"
          onChange={handleFileInputChange}
          className="sr-only"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
            <UploadCloud className="w-6 h-6 text-slate-700" />
          </div>
          <div className="text-base font-semibold text-slate-900">
            {processingMode === 'multi_state_batch'
              ? 'Drop Pan-India multi-state attendance spreadsheets, contractor invoices, or KYC packs'
              : 'Drop biometric attendance sheets, vendor invoices, or KYC packs here'}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {processingMode === 'multi_state_batch'
              ? 'Auto-partitions multi-state sheets by store location columns into Karnataka, Maharashtra, Tamil Nadu, and Delhi NCR.'
              : 'Supports CSV / XLSX biometric logs, third-party staffing muster rolls, and PDF new-joiner Aadhaar/Bank passbook scans.'}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
              Browse Local Files
            </span>
          </div>
        </label>
      </div>

      {/* Uploaded Documents Staging List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Active Ingestion Queue ({files.length} Files Loaded)
            </h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-semibold text-emerald-700">
              {records.length} Employee Records Extracted
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {processingMode === 'multi_state_batch'
              ? 'Multi-State Partition Active'
              : 'Single State Active'}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    file.type === 'kyc_pack'
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : file.type === 'vendor_invoice'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {file.name}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Parsed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{file.size}</span>
                    <span aria-hidden="true">·</span>
                    <span>{file.recordCount} Records Matched</span>
                    <span aria-hidden="true">·</span>
                    <span>Added {file.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => onRemoveFile(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next step button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>
              {processingMode === 'multi_state_batch'
                ? 'Ready to execute 4-state statutory audit split across KA, MH, TN, and Delhi NCR.'
                : 'Ready to run 5-point statutory audit against May 2026 Indian labour codes.'}
            </span>
          </div>

          <button
            onClick={onProceedToAudit}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Proceed to AI Statutory Audit Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
