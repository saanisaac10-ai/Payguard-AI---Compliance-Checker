import React from 'react';
import { EmployeeRecord } from '../types/payroll';
import { formatINR } from '../utils/statutoryRules';
import { 
  X, 
  ShieldAlert, 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Lock,
  Scale,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AuditDetailModalProps {
  record: EmployeeRecord | null;
  onClose: () => void;
  onToggleFix: (recordId: string, issueId: string) => void;
  onToggleOverrule?: (recordId: string, issueId: string) => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  record,
  onClose,
  onToggleFix,
  onToggleOverrule,
}) => {
  if (!record) return null;

  const totalLiability = record.complianceIssues.reduce((acc, i) => acc + i.liabilityInr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400">
                Statutory Compliance Audit Inspector · Four Labour Codes & Notification S.O. 5109(E)
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{record.name}</span>
                <span className="text-xs font-mono text-slate-300">({record.empCode})</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Worker Snapshot & Privacy Guardrail Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Store & Jurisdiction</span>
              <span className="font-semibold text-slate-800">{record.storeLocation}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Employment Model</span>
              <span className="font-semibold text-slate-800 capitalize">
                {record.employmentType} {record.contractorAgency ? `(${record.contractorAgency})` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Statutory ID Guardrails</span>
              <span className="font-semibold text-slate-800 font-mono text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>{record.panMasked}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">UAN: {record.uan || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Statutory Risk Exposure</span>
              <span className="font-bold text-rose-600 font-mono tabular-nums text-sm">
                {formatINR(totalLiability)}
              </span>
            </div>
          </div>

          {/* Execution Order Directive 1: Step-by-Step Statutory Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step-by-Step Labour Code Calculations (Directive Order)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">1. Wage Definition (50% Cap)</span>
                <div className="font-mono font-bold text-slate-900 mt-1">
                  {formatINR(record.statutoryWages || record.basicPay)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base: {formatINR(record.basicPay)} | Excess: +{formatINR(record.excessExclusions || 0)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">2. EPF / EPS / EDLI (2026 Split)</span>
                <div className="font-mono font-bold text-indigo-700 mt-1">
                  EE: {formatINR(record.correctedPfEmployee)} | EPS: {formatINR(record.epsEmployer833)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  EPF ER: {formatINR(record.epfEmployer367)} | EDLI: {formatINR(record.edliEmployer05)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">3. Overtime Double-Rate</span>
                <div className="font-mono font-bold text-emerald-700 mt-1">
                  {formatINR(record.correctedOtPay)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {record.overtimeHours} hrs @ 200% Ordinary Hourly Rate
                </div>
              </div>
            </div>

            {/* Monthly Remuneration Architecture Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Component</th>
                    <th className="py-2 px-3 text-right">Payroll Reported</th>
                    <th className="py-2 px-3 text-right">Statutory Rectified</th>
                    <th className="py-2 px-3">Statutory Rule Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Basic Pay</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.basicPay)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                      {formatINR(record.statutoryWages || record.basicPay)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      {record.excessExclusions > 0 ? '50% Wage Code Deemed Basic Add-Back' : 'Statutory Wage Base'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Overtime Wages</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.reportedOtPay)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                      {formatINR(record.correctedOtPay || record.reportedOtPay)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      Section 14 Wage Code & Sec 27 OSHWC (200% Double-Rate)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Employee EPF (12%)</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.reportedPfEmployee)}</td>
                    <td className="py-2 px-3 text-right text-indigo-700 font-bold">
                      {formatINR(record.correctedPfEmployee)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      Notification S.O. 5109(E) (₹25,000 Statutory Ceiling)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Employer EPS A/c 10 (8.33%)</td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {record.isEpsMember ? formatINR(Math.round(record.reportedPfWage * 0.0833)) : '₹0'}
                    </td>
                    <td className="py-2 px-3 text-right text-indigo-700 font-bold">
                      {formatINR(record.epsEmployer833)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      Mandatory EPS Enrolment (Max ₹2,083/mo · Half-Up Rounded)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">ESIC (0.75% EE / 3.25% ER)</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.reportedEsic || 0)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-bold">
                      {formatINR(record.correctedEsicEmployee)} <span className="text-[10px] font-normal text-slate-500">(ER: {formatINR(record.correctedEsicEmployer)})</span>
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      {record.esiExemptUnder176DailyWage
                        ? 'Daily Wage < ₹176 (EE 0.75% Exempt, ER 3.25% Active)'
                        : record.esicApplicable
                        ? `Covered (≤ ${formatINR(record.esicCeiling || 21000)} Ceiling · Math.ceil)`
                        : `Exempt (> ${formatINR(record.esicCeiling || 21000)} Full-Cycle Wage)`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Professional Tax (PT)</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.reportedPt ?? 0)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                      {formatINR(record.correctedPt ?? 0)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      State PT Slab ({record.gender === 'Female' && record.state === 'maharashtra' && record.correctedGrossPay <= 25000 ? 'MH Women ≤₹25K Exempt' : 'Art. 276 Schedule'})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Labour Welfare Fund (LWF)</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.reportedLwf ?? 0)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                      {formatINR(record.correctedLwfEmployee ?? 0)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      State LWF Cycle (Monthly / June-Dec / Dec-only)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Statutory Bonus & Gratuity Provision</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatINR(record.bonusPaidMonthly ?? record.statutoryBonusMonthly ?? 0)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                      {formatINR(record.statutoryBonusMonthly ?? 0)} <span className="text-[10px] font-normal text-slate-500">(Grat: {formatINR(record.monthlyGratuityProvision ?? Math.round((record.statutoryWages || record.basicPay) * 0.0481))}/mo)</span>
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-500">
                      Bonus Act Sec 10 (8.33% on ₹7K cap if ≤₹21K) · Gratuity (15/26 × Yrs, ₹20L Cap)
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2 px-3 font-sans text-slate-900">Total Gross Payable</td>
                    <td className="py-2 px-3 text-right text-slate-900">{formatINR(record.reportedGrossPay)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700">
                      {formatINR(record.correctedGrossPay)}
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-emerald-700">
                      Net: {formatINR(record.correctedNetPay)} ({record.netPayInWords || 'Compliant'}) · {record.tdsFormCode || 'Form 138 (24Q)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* List of compliance findings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span>Statutory Exception Findings & Legal Penalties</span>
            </h3>

            {record.complianceIssues.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All statutory wage floors, ceiling adjustments, and KYC records are valid.</span>
              </div>
            ) : (
              record.complianceIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{issue.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          {issue.severity.toUpperCase()} RISK
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {issue.codeCategory}
                        </span>
                        {issue.autoFixApplied && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Fixed (AI Suggestion)
                          </span>
                        )}
                        {issue.isOverruled && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            Overruled (Employer Exception)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">{issue.description}</div>
                    </div>

                    {/* Action buttons: Fix or Overrule */}
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => onToggleFix(record.id, issue.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          issue.autoFixApplied
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {issue.autoFixApplied ? (
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Revert Fix</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Apply Fix</span>
                          </span>
                        )}
                      </button>

                      {onToggleOverrule && (
                        <button
                          onClick={() => onToggleOverrule(record.id, issue.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            issue.isOverruled
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {issue.isOverruled ? 'Undo Overrule' : 'Overrule Suggestion'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Value Reported vs AI Corrected comparison card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Value Reported in Payroll
                      </div>
                      <div className="text-xs font-mono font-bold text-rose-700 mt-0.5">
                        {issue.reportedValue}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200/80">
                      <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                        AI Statutory Corrected Suggestion
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                        {issue.correctedValue}
                      </div>
                    </div>
                  </div>

                  {/* Legal Clause Box */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Legal Citation: {issue.ruleReference}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {issue.legalClause}
                    </p>
                    {issue.penaltyReference && (
                      <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-rose-700">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Statutory Penalty: {issue.penaltyReference}</span>
                      </div>
                    )}
                  </div>

                  {/* Mathematical breakdown */}
                  {issue.calculationBreakdown && issue.calculationBreakdown.length > 0 && (
                    <div className="p-2.5 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono space-y-1">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Statutory Math Derivation</span>
                      </div>
                      {issue.calculationBreakdown.map((line, lIdx) => (
                        <div key={lIdx} className="text-[11px]">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Applying auto-fix recalculates statutory wages and ensures clean compliance export.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
