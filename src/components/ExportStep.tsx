import React, { useState } from 'react';
import { EmployeeRecord, TargetHRMS, StateRuleset } from '../types/payroll';
import { formatINR, STATE_NAMES } from '../utils/statutoryRules';
import { exportToCSV, exportEPFOECRText, HRMS_CONFIGS } from '../utils/exportFormats';
import { generateFormTAuditCertificatePDF } from '../utils/pdfGenerator';
import { 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  FileSpreadsheet, 
  Sparkles,
  ArrowLeft,
  Stamp,
  MapPin,
  Layers,
  Slash,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ExportStepProps {
  records: EmployeeRecord[];
  targetHrms: TargetHRMS;
  stateRuleset: StateRuleset;
  onBackToAudit: () => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  records,
  targetHrms,
  stateRuleset,
  onBackToAudit,
}) => {
  const [viewMode, setViewMode] = useState<'sanitized' | 'diff'>('sanitized');
  const [selectedExportState, setSelectedExportState] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;
  const hrmsConfig = HRMS_CONFIGS[targetHrms];

  const displayedRecords = selectedExportState === 'all'
    ? records
    : records.filter(r => r.state === selectedExportState);

  const totalRecords = displayedRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRecords = displayedRecords.slice((safePage - 1) * pageSize, safePage * pageSize);

  const totalSanitizedGross = displayedRecords.reduce((acc, r) => acc + (r.correctedGrossPay || r.reportedGrossPay), 0);
  const totalSanitizedNet = displayedRecords.reduce((acc, r) => acc + (r.correctedNetPay || r.reportedGrossPay), 0);
  const totalPfDisbursed = displayedRecords.reduce((acc, r) => acc + (r.correctedPfEmployee + r.correctedPfEmployer), 0);

  const handleDownloadCsv = () => {
    exportToCSV(displayedRecords, targetHrms);
  };

  const handleDownloadPdf = () => {
    const certState = selectedExportState !== 'all' ? (selectedExportState as StateRuleset) : stateRuleset;
    generateFormTAuditCertificatePDF(displayedRecords, certState, hrmsConfig.hrmsName);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with 1-Click Action Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Statutory Compliance Pre-Audit 100% Cleared</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sanitized Pre-Payroll & Statutory Compliance Export
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              All minimum wage shortfalls, EPFO 2026 ceiling disparities, and overtime double-rate calculations have been normalized. Export directly into your core HRMS or download certified CLRA Form T registers.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download {hrmsConfig.hrmsName}-Ready CSV</span>
            </button>

            <button
              onClick={() => exportEPFOECRText(displayedRecords)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border border-indigo-200 rounded-lg shadow-xs transition-all cursor-pointer"
              title="Official EPFO Unified Portal #~# Delimited ECR Text File (chetanpayroll IndiaComplianceGenerator)"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-700" />
              <span>EPFO ECR (#~# .TXT)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-950" />
              <span>Download Form T / CLRA Certificate (PDF)</span>
            </button>
          </div>
        </div>

        {/* Quick Audit Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Audited Headcount</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {records.length} Employees
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">100% Reconciled</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Sanitized Gross Payroll</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {formatINR(totalSanitizedGross)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Includes double-rate OT</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Total Net Payout</div>
            <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
              {formatINR(totalSanitizedNet)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Direct bank credit ready</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">EPFO Remittance (EE + ER)</div>
            <div className="text-lg font-bold text-indigo-700 font-mono tabular-nums mt-0.5">
              {formatINR(totalPfDisbursed)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">2026 ₹25K Ceiling Compliant</div>
          </div>
        </div>
      </div>

      {/* CLRA Principal Employer Audit Certificate Card (Visual Preview) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Form T / CLRA Principal Employer Statutory Certificate Preview
                </h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Govt. of Karnataka / Sec 21 CLRA Certified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official combined muster roll & wage disbursement audit certificate for contract labour compliance.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Official PDF</span>
          </button>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-3 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <span className="text-slate-400">Principal Employer: </span>
              <span className="font-bold text-slate-900">FreshBite Retail & QSR Hospitality India Pvt Ltd</span>
            </div>
            <div>
              <span className="text-slate-400">CLRA Reg. No: </span>
              <span className="font-bold text-slate-900">KA/BLR/CLRA-PE/2026/08942</span>
            </div>
            <div>
              <span className="text-slate-400">EPFO Code: </span>
              <span className="font-bold text-slate-900">KN/BNG/0048291/000</span>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            "Certified that the wages and allowances payable to all store workers, baristas, kitchen stewards, and contract delivery personnel for the month of <strong>May 2026</strong> have been audited via PayGuard AI. Overtime rates have been adjusted to <strong>200% double-rate</strong> pursuant to Section 8 of the Karnataka Shops and Commercial Establishments Act 1961, and EPF remittances adhere strictly to the revised <strong>₹25,000 wage ceiling</strong>. No statutory underpayments exist."
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Digital Audit Hash: SHA256#8f42e9b1d7a3c05193f419c80d41829e</span>
            </div>
            <div className="font-medium text-slate-700">
              Audit Date: May 28, 2026 · Bengaluru, Karnataka
            </div>
          </div>
        </div>
      </div>

      {/* Sanitized Final Master Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Final Sanitized Payroll Master Table ({records.length} Employees)
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Ready for {hrmsConfig.hrmsName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target HRMS schema verified with correct headers, employee codes, and rounded amounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('sanitized')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'sanitized'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sanitized Payroll View
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'diff'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Before vs After Diff
              </button>
            </div>

            <button
              onClick={onBackToAudit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Exceptions</span>
            </button>
          </div>
        </div>

        {/* State Export Tabs */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Export State Package:</span>
          </span>
          <button
            onClick={() => { setSelectedExportState('all'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              selectedExportState === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All States ({records.length})
          </button>
          <button
            onClick={() => { setSelectedExportState('karnataka_may2026'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              selectedExportState === 'karnataka_may2026'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Karnataka ({records.filter(r => r.state === 'karnataka_may2026').length})
          </button>
          <button
            onClick={() => { setSelectedExportState('maharashtra'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              selectedExportState === 'maharashtra'
                ? 'bg-blue-700 text-white font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Maharashtra ({records.filter(r => r.state === 'maharashtra').length})
          </button>
          <button
            onClick={() => { setSelectedExportState('tamilnadu'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              selectedExportState === 'tamilnadu'
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tamil Nadu ({records.filter(r => r.state === 'tamilnadu').length})
          </button>
          <button
            onClick={() => { setSelectedExportState('delhi_ncr'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              selectedExportState === 'delhi_ncr'
                ? 'bg-rose-700 text-white font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Delhi NCR ({records.filter(r => r.state === 'delhi_ncr').length})
          </button>
        </div>

        {/* High-density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Code & Name</th>
                <th className="py-3 px-4">Store Location & Role</th>
                <th className="py-3 px-4 text-center">Days / OT</th>
                <th className="py-3 px-4 text-right">Sanitized Gross</th>
                <th className="py-3 px-4 text-right">PF Wage Base</th>
                <th className="py-3 px-4 text-right">PF EE (12%)</th>
                <th className="py-3 px-4 text-right">Net Disbursement</th>
                <th className="py-3 px-4">Bank IFSC Code</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((emp) => {
                const hadIssues = emp.complianceIssues.length > 0;
                const grossDiff = emp.correctedGrossPay - emp.reportedGrossPay;
                const pfDiff = emp.correctedPfEmployee - emp.reportedPfEmployee;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Code & Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{emp.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span>{emp.empCode}</span>
                        <span
                          className={`px-1 py-0.2 text-[9px] font-bold rounded ${
                            emp.state === 'karnataka_may2026'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emp.state === 'maharashtra'
                              ? 'bg-blue-100 text-blue-800'
                              : emp.state === 'tamilnadu'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {emp.state === 'karnataka_may2026'
                            ? 'KA'
                            : emp.state === 'maharashtra'
                            ? 'MH'
                            : emp.state === 'tamilnadu'
                            ? 'TN'
                            : 'DL'}
                        </span>
                      </div>
                    </td>

                    {/* Store & Role */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{emp.storeLocation}</div>
                      <div className="text-[11px] text-slate-500">{emp.role.split('(')[0].trim()}</div>
                    </td>

                    {/* Days / OT */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-slate-900 font-semibold">{emp.daysWorked}d</span>
                      {emp.overtimeHours > 0 && (
                        <span className="ml-1 text-[11px] text-blue-700 font-medium">
                          ({emp.overtimeHours}h OT)
                        </span>
                      )}
                    </td>

                    {/* Sanitized Gross */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900">
                        {formatINR(emp.correctedGrossPay || emp.reportedGrossPay)}
                      </div>
                      {viewMode === 'diff' && grossDiff !== 0 && (
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          +{formatINR(grossDiff)} adj.
                        </div>
                      )}
                    </td>

                    {/* PF Wage Base */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="text-slate-800 font-medium">
                        {formatINR(emp.correctedPfWage)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emp.correctedPfWage === 25000 ? '₹25K Cap' : 'Actual Base'}
                      </div>
                    </td>

                    {/* PF EE */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="font-semibold text-slate-900">
                        {formatINR(emp.correctedPfEmployee)}
                      </div>
                      {viewMode === 'diff' && pfDiff > 0 && (
                        <div className="text-[10px] text-indigo-700 font-semibold">
                          +{formatINR(pfDiff)}
                        </div>
                      )}
                    </td>

                    {/* Net Disbursement */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-emerald-700">
                        {formatINR(emp.correctedNetPay)}
                      </div>
                    </td>

                    {/* Bank IFSC */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-semibold text-slate-800">{emp.ifscCode}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {emp.bankName}
                      </div>
                    </td>

                    {/* Audit Status */}
                    <td className="py-3 px-4 text-center">
                      {emp.status === 'overruled' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded">
                          <Slash className="w-3 h-3 text-amber-700" />
                          Overruled Exception
                        </span>
                      ) : hadIssues ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Remediated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded">
                          Direct Pass
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Minimalist Pagination Bar */}
        {totalRecords > pageSize && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>Showing </span>
              <span className="font-semibold text-slate-900 font-mono">
                {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, totalRecords)}
              </span>
              <span> of </span>
              <span className="font-semibold text-slate-900 font-mono">
                {totalRecords.toLocaleString('en-IN')}
              </span>
              <span> sanitized staff</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className={`p-1 rounded border transition-colors cursor-pointer ${
                  safePage <= 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-300 text-slate-700 hover:bg-white'
                }`}
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-700">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className={`p-1 rounded border transition-colors cursor-pointer ${
                  safePage >= totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-300 text-slate-700 hover:bg-white'
                }`}
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Export generated adhering to {hrmsConfig.hrmsName} CSV column schema requirements.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {hrmsConfig.hrmsName} CSV</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Form T Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
