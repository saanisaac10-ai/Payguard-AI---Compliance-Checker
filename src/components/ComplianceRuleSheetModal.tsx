import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Scale, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  TrendingUp,
  Table as TableIcon
} from 'lucide-react';

interface ComplianceRuleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceRuleSheetModal: React.FC<ComplianceRuleSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'epfo2026' | 'frappe' | 'wagecode' | 'sscode' | 'oshwc' | 'ir' | 'penalties'>('epfo2026');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-400">
                Statutory Compliance Knowledge Base · Notification S.O. 5109(E)
              </div>
              <h2 className="text-base font-bold text-white">
                Four Labour Codes & EPFO ₹25,000 Wage Ceiling Compliance Engine
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

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('epfo2026')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'epfo2026'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            EPFO ₹25K Ceiling & Sept ECR Split
          </button>
          <button
            onClick={() => setActiveTab('frappe')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'frappe'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Frappe & Chetan India Payroll (PT, LWF, Bonus, Gratuity & Verhoeff)
          </button>
          <button
            onClick={() => setActiveTab('wagecode')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'wagecode'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Wage Code 2019 (50% Cap & OT)
          </button>
          <button
            onClick={() => setActiveTab('sscode')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sscode'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Security (ESIC, Gratuity, Gigs)
          </button>
          <button
            onClick={() => setActiveTab('oshwc')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'oshwc'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            OSHWC Code (Leaves & CLRA)
          </button>
          <button
            onClick={() => setActiveTab('ir')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ir'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            IR Code (GRC & Standing Orders)
          </button>
          <button
            onClick={() => setActiveTab('penalties')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'penalties'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Penalty Matrix & Compounding
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-xs text-slate-700 space-y-4">
          {activeTab === 'epfo2026' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-indigo-950">
                    Notification S.O. 5109(E) (Effective 17 September 2026)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-900">
                    Mandatory Central Order
                  </span>
                </div>
                <p className="leading-relaxed">
                  The statutory wage ceiling under the Code on Social Security 2020 has been elevated from <strong>₹15,000/month to ₹25,000/month</strong> across EPF, EPS, and EDLI. Every employee drawing Statutory EPF Wages up to ₹25,000/month is mandatorily covered. Existing employees earning between ₹15,001 and ₹25,000 who were previously excluded from EPS must be enrolled into EPS starting 17.09.2026.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-200 text-[11px] text-indigo-900 font-medium">
                  <strong>CTC Protection Rule (Q14 & Q15):</strong> Employers cannot treat the increased Employer PF share as an employee deduction or reduce the employee's base wages to offset the 12% employer matching contribution.
                </div>
              </div>

              {/* Standard Monthly Contribution Matrix Table */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                  Standard Monthly Contribution Matrix (October 2026 Wage Month Onwards)
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Monthly PF Wages</th>
                        <th className="py-2 px-3 text-right">Employee EPF (12%)</th>
                        <th className="py-2 px-3 text-right">Employer EPS (8.33%)</th>
                        <th className="py-2 px-3 text-right">Employer EPF (3.67%)</th>
                        <th className="py-2 px-3 text-right">Employer EDLI (0.50%)</th>
                        <th className="py-2 px-3 text-right">Admin (0.50%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr>
                        <td className="py-2 px-3 font-sans font-semibold">₹10,000</td>
                        <td className="py-2 px-3 text-right">₹1,200</td>
                        <td className="py-2 px-3 text-right">₹833</td>
                        <td className="py-2 px-3 text-right">₹367</td>
                        <td className="py-2 px-3 text-right">₹50</td>
                        <td className="py-2 px-3 text-right">₹50</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans font-semibold">₹15,000 (Old Cap)</td>
                        <td className="py-2 px-3 text-right">₹1,800</td>
                        <td className="py-2 px-3 text-right">₹1,250</td>
                        <td className="py-2 px-3 text-right">₹550</td>
                        <td className="py-2 px-3 text-right">₹75</td>
                        <td className="py-2 px-3 text-right">₹75</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="py-2 px-3 font-sans font-semibold text-emerald-900">₹20,000 (New Bracket)</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-900">₹2,400</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-900">₹1,666</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-900">₹734</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-900">₹100</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-900">₹100</td>
                      </tr>
                      <tr className="bg-emerald-100/50">
                        <td className="py-2 px-3 font-sans font-semibold text-emerald-950">₹25,000 (New Statutory Cap)</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-950">₹3,000</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-950">₹2,083</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-950">₹917</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-950">₹125</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-950">₹125</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* September 2026 Split-Period Rule */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block">
                  Transition Math: September 2026 Split-Period Single ECR Rule (Q7–Q11)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  For September 2026 (30 days), employers file a <strong>SINGLE ECR</strong> (due by <strong>15 October 2026</strong>) splitting calculations into two proportionate periods:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold block text-slate-900">Period 1 (01.09.2026 to 16.09.2026 = 16/30 days)</span>
                    <span className="text-[11px] text-slate-500">Subject to old ₹15,000 ceiling. Pro-rata cap = ₹8,000.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold block text-slate-900">Period 2 (17.09.2026 to 30.09.2026 = 14/30 days)</span>
                    <span className="text-[11px] text-slate-500">Subject to new ₹25,000 ceiling. Pro-rata cap = ₹11,667.</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <strong>Para 22 Deferred Employee Share Recovery:</strong> If the additional EE share could not be deducted in September payroll, the employer may recover it in the <strong>October payroll cycle</strong> without prior approval, provided the full September ECR is deposited on or before <strong>15 October 2026</strong>.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'frappe' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-950">
                    Frappe & Chetan India Payroll Engines (PT, LWF, Bonus, Gratuity, Verhoeff KYC & IT 2025)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
                    frappe + chetanpayroll Logics
                  </span>
                </div>
                <p className="leading-relaxed">
                  Combines <strong>frappe/india-payroll</strong> and <strong>chetanpayroll/India-Payroll</strong> statutory engines: State <strong>Professional Tax (PT)</strong> & <strong>LWF</strong>, <strong>Payment of Bonus Act (8.33%–20% on ₹7,000 cap)</strong>, <strong>Payment of Gratuity Act (15/26 formula, 4y 240d rule, ₹20L cap)</strong>, <strong>ESIC ₹176/day exemption & ₹25K PwD ceiling</strong>, <strong>UIDAI Verhoeff Aadhaar Checksum</strong>, and <strong>Income-tax Act 2025 (Form 138)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold block text-slate-900">State Professional Tax (Art. 276 · Max ₹2,500/yr)</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                    <li><strong>Karnataka:</strong> ≤ ₹24,999 → ₹0; ≥ ₹25,000 → ₹200/mo (₹300 in February; Senior ≥60 yrs exempt).</li>
                    <li><strong>Maharashtra:</strong> ≤ ₹7,500 → ₹0; ₹7,501–₹10,000 → ₹175; &gt; ₹10,000 → ₹200/mo (₹300 in Feb). <strong>Women earning ≤ ₹25,000/mo & Senior ≥65 yrs are 100% exempt.</strong></li>
                    <li><strong>Tamil Nadu:</strong> Half-yearly slabs on 6-month cumulative gross (up to ₹1,250 / ₹1,095 half-yearly above ₹75,000).</li>
                    <li><strong>Odisha, Delhi, Punjab & UP:</strong> ₹0 PT (Repealed in Odisha from 1 Apr 2026).</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold block text-slate-900">Statutory Bonus & Gratuity Calculators (chetanpayroll)</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                    <li><strong>Payment of Bonus Act, 1965:</strong> Eligible if Basic + DA ≤ <strong>₹21,000/mo</strong> and worked ≥ 30 days. Computed on <strong>₹7,000/mo</strong> ceiling at <strong>8.33% minimum</strong> (₹100 floor) to <strong>20% maximum</strong>.</li>
                    <li><strong>Payment of Gratuity Act, 1972:</strong> Formula <code>(Basic + DA) × 15 × Rounded Years / 26</code> (7 days for seasonal). Part service ≥ 6 months rounded to +1 year; <strong>4 yrs 240 days (56 mos)</strong> qualifies (waived on Death/Disability); tax-exempt cap <strong>₹20,00,000</strong>.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold block text-slate-900">ESIC ₹176 Daily Wage Exemption, PwD ₹25K & International PF</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                    <li><strong>ESIC Daily Wage &lt; ₹176 Exemption:</strong> Employees with average daily wage &lt; <strong>₹176/day</strong> are <strong>100% exempt from the 0.75% employee share</strong> (Employer 3.25% still applies).</li>
                    <li><strong>ESIC PwD & Continuity:</strong> ₹21,000 standard ceiling (<strong>₹25,000 for PwD</strong>), evaluated on full-cycle gross with 6-month contribution window continuity (Apr–Sep, Oct–Mar).</li>
                    <li><strong>International Workers & Admin Min:</strong> Uncapped PF wages with <strong>0% EPS redirect</strong> (full 12% ER to EPF) and ₹500 minimum establishment EPF admin charge.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold block text-slate-900">UIDAI Verhoeff Checksum & Income-Tax Act 2025</span>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                    <li><strong>IndiaValidator Checksums:</strong> Cryptographic 12-digit <strong>Aadhaar Verhoeff dihedral group D5 checksum</strong> (cannot start with 0/1), 10-char PAN 4th-char entity status (<code>P</code>, <code>C</code>, <code>H</code>, <code>F</code>), 17-digit ESIC IP, 12-digit UAN, and 11-char IFSC (5th char <code>0</code>).</li>
                    <li><strong>New Regime 2025–26 & Senior Slabs:</strong> ₹75K Std Deduction, Sec 87A zero-tax up to ₹12L (marginal relief to ₹12.75L), Old Regime Senior (60–79 yrs: ₹3L) & Super-Senior (80+ yrs: ₹5L) slabs, Sec 80D (₹25K/₹50K), Sec 24 (₹2L), and <strong>Form 138</strong> (replacing Form 24Q).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wagecode' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100 space-y-2">
                <span className="font-bold text-sm text-amber-950 block">
                  Universal Definition of "Wages" & 50% Add-Back Formula (Sec 2(y))
                </span>
                <p className="leading-relaxed">
                  Under Section 2(y) of Code on Wages 2019 and Section 2(88) of Code on Social Security 2020:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Included Base Wages:</strong> Basic Pay + Dearness Allowance (DA) + Retaining Allowance.</li>
                  <li><strong>Excluded Allowances (Subject to 50% Cap):</strong> Statutory bonus, HRA, conveyance, special allowance, medical, overtime, commissions.</li>
                  <li><strong>The 50% Rule:</strong> If total excluded allowances exceed 50% of total remuneration, the excess amount is deemed as wages and added back to calculate PF, ESIC, Gratuity, and Statutory Minimum Wage.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Overtime Double-Rate (Section 14)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Any work beyond 8 hours a day or 48 hours a week must be compensated at <strong>not less than twice (2x) the ordinary rate of wages</strong>, calculated using the statutory wage base.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Deductions Capped at 50% (Section 18 & 19)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Total deductions in any wage period (fines, absence, loan recovery, damages) must NOT exceed <strong>50% of statutory wages</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Full & Final (F&F) Settlement (Section 17)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    In case of resignation, discharge, or termination, all due wages must be paid within <strong>2 working days</strong> from the last day of employment.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">3-Year Claims Limitation (Section 45)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    The limitation period for worker wage claims is enhanced to <strong>3 years</strong>, with compensation penalties up to <strong>10 times</strong> the claim value.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sscode' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-2">
                <span className="font-bold text-sm text-emerald-950 block">
                  Code on Social Security, 2020 (ESIC, Gratuity, Maternity & Gigs)
                </span>
                <p className="leading-relaxed">
                  Consolidates EPF, ESIC, Gratuity, Maternity Benefit, BOCW Cess, and Social Security for gig workers under a unified regulatory framework.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">ESIC Coverage & Capitalised Recovery (Sec 31 & 42)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Applies to establishments with 10+ employees. Family includes dependent parents-in-law for females. Under Section 42, ESIC can recover the <strong>capitalised value</strong> of benefits from employers defaulting on contributions.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Gratuity (Section 53 & 56)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>5 years</strong> continuous service for permanent staff; <strong>1 year</strong> for Fixed-Term Employees (FTE). Rate: <strong>15 days' wages</strong> calculated on the new <code>Statutory_Wages</code> definition. Payable within 30 days.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Maternity Benefit & Crèche (Chapter VI)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    80 days worked in preceding 12 months; <strong>26 weeks</strong> paid leave; ₹3,500 medical bonus; mandatory crèche for establishments employing <strong>50 or more workers</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Gig Worker Aggregators (Section 114)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Digital platforms must contribute <strong>1% to 2% of annual turnover</strong>, capped at 5% of amounts payable to gig and platform workers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'oshwc' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 space-y-2">
                <span className="font-bold text-sm text-blue-950 block">
                  OSHWC Code, 2020 (Working Hours, Leave & Contract Labour)
                </span>
                <p className="leading-relaxed">
                  Overhauls factories, commercial establishments, and contract labour regulations across India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Annual Leave & Encashment (Section 32)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Qualification reduced to <strong>180 days</strong> of work (from 240 days). Carry-forward capped at <strong>30 days</strong>. Accrued leave in excess of 30 days must be encashed. Exit encashment payable within <strong>2 days</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">CLRA Threshold & Core Activity (Section 45 & 53)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Contract labour threshold raised to <strong>50+ workers</strong>. Deploying contract labour in <strong>core activities is prohibited</strong>. Principal Employer is directly liable for unpaid contractor wages.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Women Night Shifts (Section 43)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Permitted for work before 6:00 AM or after 7:00 PM with <strong>prior written consent</strong> and mandatory transport, lighting, and security safeguards.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Mandatory Appointment Letters (Section 6)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Employers must issue a formal electronic or physical appointment letter to every worker upon onboarding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ir' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100 space-y-2">
                <span className="font-bold text-sm text-purple-950 block">
                  Industrial Relations (IR) Code, 2020
                </span>
                <p className="leading-relaxed">
                  Streamlines employee disputes, standing orders, trade unions, and workplace closures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Grievance Redressal Committee (Section 4)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mandatory for every establishment employing <strong>20 or more workers</strong>. Equal employer and worker representation (max 10 members). Chairperson rotates annually. Proceedings must conclude within <strong>30 days</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Standing Orders Threshold (Section 28)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Threshold raised to <strong>300 or more workers</strong>. Domestic inquiry into suspended worker misconduct must conclude within <strong>90 days</strong> (Section 38).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Worker Re-Skilling Fund (Section 83)</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    In addition to retrenchment compensation (15 days/yr), employers must deposit <strong>15 days' last drawn wages</strong> into the Worker Re-Skilling Fund within 45 days.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 mb-1">Definition of "Worker" (Section 2(zr))</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Excludes managerial staff and supervisors drawing wages exceeding <strong>₹18,000/month</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'penalties' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100 flex items-center gap-2 text-rose-950 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Statutory Penalties and Compounding under All Four Labour Codes</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Code & Section</th>
                      <th className="py-2.5 px-3">Offence Category</th>
                      <th className="py-2.5 px-3">First Offence Penalty</th>
                      <th className="py-2.5 px-3">Repeat Offence</th>
                      <th className="py-2.5 px-3">Compounding Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Wage Code (Sec 54 & 56)</td>
                      <td className="py-2 px-3">Paying less than due wages</td>
                      <td className="py-2 px-3 text-rose-700 font-medium">Fine up to ₹50,000 (+ up to 10x compensation)</td>
                      <td className="py-2 px-3">Up to 3 months imprisonment and/or ₹1,00,000 fine</td>
                      <td className="py-2 px-3 text-slate-500">50% of max fine (opportunity to rectify on 1st violation)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Wage Code (Sec 54)</td>
                      <td className="py-2 px-3">General contravention (bonus, registers)</td>
                      <td className="py-2 px-3 text-rose-700 font-medium">Fine up to ₹20,000</td>
                      <td className="py-2 px-3">Up to 1 month imprisonment and/or ₹40,000 fine</td>
                      <td className="py-2 px-3 text-slate-500">50% of max fine</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">SS Code (Sec 133 & 134)</td>
                      <td className="py-2 px-3">Failure to pay deducted PF/ESIC contribution</td>
                      <td className="py-2 px-3 text-rose-700 font-medium">Up to 3 years imprisonment and/or ₹1,00,000 fine</td>
                      <td className="py-2 px-3">Up to 3 years imprisonment and/or ₹3,00,000 fine</td>
                      <td className="py-2 px-3 text-slate-500">Fine-only: 50% max fine; Imprisonment ≤1 yr: 75%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">OSHWC Code (Sec 94–103)</td>
                      <td className="py-2 px-3">General contravention / Women & CLRA breach</td>
                      <td className="py-2 px-3 text-rose-700 font-medium">Fine up to ₹5,00,000 (CLRA breach up to ₹1,00,000)</td>
                      <td className="py-2 px-3">Enhanced fine / imprisonment for continuing offence</td>
                      <td className="py-2 px-3 text-slate-500">50% of max fine</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">IR Code (Sec 86 & 89)</td>
                      <td className="py-2 px-3">Illegal lay-off, retrenchment, closure</td>
                      <td className="py-2 px-3 text-rose-700 font-medium">Fine up to ₹2,00,000</td>
                      <td className="py-2 px-3">Up to 6 months imprisonment and/or ₹5,00,000 fine</td>
                      <td className="py-2 px-3 text-slate-500">50% of max fine</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PayGuard AI validates all 4 Labour Codes & Notification S.O. 5109(E) rules step-by-step.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};
