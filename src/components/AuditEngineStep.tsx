import React, { useState, useMemo, useRef, UIEvent } from 'react';
import { 
  EmployeeRecord, 
  ViolationType, 
  AuditSummary, 
  ProcessingMode,
  ComplianceIssue
} from '../types/payroll';
import { formatINR } from '../utils/statutoryRules';
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  CheckCheck, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
  Calendar,
  Layers,
  Scale,
  Clock,
  Check,
  Slash,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter
} from 'lucide-react';

interface AuditEngineStepProps {
  records: EmployeeRecord[];
  summary: AuditSummary;
  processingMode?: ProcessingMode;
  headcountScale?: 'demo' | 'enterprise';
  onSelectHeadcountScale?: (scale: 'demo' | 'enterprise') => void;
  isSeptemberRun?: boolean;
  onToggleSeptemberRun?: (isSept: boolean) => void;
  onApproveAllFixes: () => void;
  onToggleRecordFix: (recordId: string, issueId: string) => void;
  onToggleOverrule?: (recordId: string, issueId: string) => void;
  onFixAllInTopic?: (issues: { recordId: string; issueId: string }[]) => void;
  onOverruleAllInTopic?: (issues: { recordId: string; issueId: string }[]) => void;
  onInspectRecord: (record: EmployeeRecord) => void;
  onProceedToExport: () => void;
}

interface TopicConfig {
  id: string;
  name: string;
  shortName: string;
  codeCategory: string;
  legalCitation: string;
  description: string;
  violationTypes: ViolationType[];
  icon: React.ReactNode;
}

const STATUTORY_TOPICS: TopicConfig[] = [
  {
    id: 'MINIMUM_WAGE',
    name: 'Minimum Wage Floor Compliance',
    shortName: 'Minimum Wage',
    codeCategory: 'Wage Code · Sec 6 & 8',
    legalCitation: 'Sec 6 & 8 Code on Wages 2019 & State Scheduled Employment Gazettes',
    description: 'Pro-rata monthly floor wages based on actual days worked and state skill grade schedules.',
    violationTypes: ['MINIMUM_WAGE_BREACH'],
    icon: <Scale className="w-3.5 h-3.5 text-slate-700" />,
  },
  {
    id: 'EPF_CEILING',
    name: 'EPFO ₹25,000 Wage Ceiling & EPS Enrolment',
    shortName: 'EPF ₹25K Ceiling',
    codeCategory: 'SS Code · S.O. 5109(E)',
    legalCitation: 'EPFO Notification S.O. 5109(E) (Effective 17 Sept 2026) under SS Code 2020',
    description: 'Enforces revised ₹25,000 statutory wage ceiling and mandatory EPS coverage for ₹15,001–₹25,000 bracket.',
    violationTypes: ['EPF_25K_CEILING_ERROR', 'SEPT_2026_ECR_SPLIT_ERROR'],
    icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-700" />,
  },
  {
    id: 'WAGE_CODE_50',
    name: '50% Wage Code Rule (Base vs Exclusion Cap)',
    shortName: '50% Wage Cap',
    codeCategory: 'Wage Code · Sec 2(y)',
    legalCitation: 'Proviso to Sec 2(y) Code on Wages 2019 & Sec 2(88) SS Code 2020',
    description: 'Excluded allowances cannot exceed 50% of total remuneration; excess is added back to Basic Wages.',
    violationTypes: ['WAGE_CODE_50_RULE'],
    icon: <Layers className="w-3.5 h-3.5 text-amber-700" />,
  },
  {
    id: 'OT_DOUBLE_RATE',
    name: 'Overtime Double-Rate (200% Ordinary Rate)',
    shortName: 'OT 2x Rate',
    codeCategory: 'OSHWC Code · Sec 27',
    legalCitation: 'Sec 14 Code on Wages 2019 & Sec 27 OSHWC Code 2020',
    description: 'Overtime in retail stores and commercial establishments must be paid at twice the ordinary wage rate.',
    violationTypes: ['OT_DOUBLE_RATE_MISMATCH'],
    icon: <Clock className="w-3.5 h-3.5 text-blue-700" />,
  },
  {
    id: 'IFSC_KYC',
    name: 'Banking IFSC, UAN, PAN Entity & UIDAI Verhoeff Aadhaar KYC',
    shortName: 'KYC & Verhoeff',
    codeCategory: 'IndiaValidator · RBI',
    legalCitation: 'UIDAI Verhoeff Checksum, ITD PAN Entity Code, EPFO UAN & RBI IFSC Rules',
    description: '12-digit Aadhaar Verhoeff dihedral checksum, 10-char PAN 4th-char entity code, 17-digit ESIC IP, 12-digit UAN & 11-char IFSC.',
    violationTypes: ['IFSC_KYC_ERROR'],
    icon: <CreditCard className="w-3.5 h-3.5 text-purple-700" />,
  },
  {
    id: 'LEAVE_DEDUCTIONS',
    name: 'PT, LWF, Statutory Bonus (8.33%), Gratuity & Leave Cap',
    shortName: 'PT, Bonus & Leaves',
    codeCategory: 'Frappe & Chetan Payroll',
    legalCitation: 'Bonus Act Sec 10, Gratuity Act Sec 4, Art 276 PT, LWF & OSHWC Sec 32(5)',
    description: 'Statutory Bonus (8.33%–20% on ₹7K cap), Gratuity (15/26 formula, ₹20L cap), State PT, LWF, ESIC ₹176/day rule & Leave Encashment.',
    violationTypes: [
      'PT_SLAB_OR_EXEMPTION_ERROR',
      'LWF_SCHEDULE_ERROR',
      'ESI_PWD_OR_CEILING_ERROR',
      'TDS_2025_ACT_OR_REGIME_ERROR',
      'STATUTORY_BONUS_BREACH',
      'GRATUITY_PROVISION_OR_CAP_ERROR',
      'LEAVE_ENCASHMENT_BREACH',
      'DEDUCTION_50_PERCENT_CAP',
    ],
    icon: <CalendarCheck className="w-3.5 h-3.5 text-slate-700" />,
  },
];

const VIRTUAL_ROW_HEIGHT = 48; // Fixed compact row height in px for virtualization
const VIRTUAL_VIEWPORT_HEIGHT = 576; // 12 visible rows at 48px
const VIRTUAL_OVERSCAN = 8;

export const AuditEngineStep: React.FC<AuditEngineStepProps> = ({
  records,
  summary,
  headcountScale = 'enterprise',
  onSelectHeadcountScale,
  isSeptemberRun = false,
  onToggleSeptemberRun,
  onApproveAllFixes,
  onToggleRecordFix,
  onToggleOverrule,
  onFixAllInTopic,
  onOverruleAllInTopic,
  onInspectRecord,
  onProceedToExport,
}) => {
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'fixed' | 'overruled'>('all');
  
  // Table View Mode: 'paginated' or 'virtualized' (for 1,000+ rows continuous scrolling)
  const [tableDisplayMode, setTableDisplayMode] = useState<'paginated' | 'virtualized'>('paginated');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Flattened exception list for fast, scalable processing
  const allExceptionItems = useMemo(() => {
    const list: { employee: EmployeeRecord; issue: ComplianceIssue; topic: TopicConfig }[] = [];

    for (let i = 0; i < records.length; i++) {
      const emp = records[i];
      if (filterState !== 'all' && emp.state !== filterState) continue;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          emp.name.toLowerCase().includes(q) ||
          emp.empCode.toLowerCase().includes(q) ||
          emp.storeLocation.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          (emp.uan && emp.uan.includes(q));
        if (!matches) continue;
      }

      for (let j = 0; j < emp.complianceIssues.length; j++) {
        const issue = emp.complianceIssues[j];
        if (statusFilter === 'pending' && (issue.autoFixApplied || issue.isOverruled)) continue;
        if (statusFilter === 'fixed' && !issue.autoFixApplied) continue;
        if (statusFilter === 'overruled' && !issue.isOverruled) continue;

        const matchedTopic = STATUTORY_TOPICS.find((t) => t.violationTypes.includes(issue.type));
        if (matchedTopic) {
          if (activeTopicFilter !== 'all' && matchedTopic.id !== activeTopicFilter) {
            continue;
          }
          list.push({ employee: emp, issue, topic: matchedTopic });
        }
      }
    }

    return list;
  }, [records, filterState, searchQuery, statusFilter, activeTopicFilter]);

  // Topic metrics summary
  const topicStats = useMemo(() => {
    const stats: Record<string, { total: number; pending: number; fixed: number; overruled: number; exposure: number }> = {};
    STATUTORY_TOPICS.forEach((t) => {
      stats[t.id] = { total: 0, pending: 0, fixed: 0, overruled: 0, exposure: 0 };
    });

    for (let i = 0; i < records.length; i++) {
      const emp = records[i];
      for (let j = 0; j < emp.complianceIssues.length; j++) {
        const issue = emp.complianceIssues[j];
        const matched = STATUTORY_TOPICS.find((t) => t.violationTypes.includes(issue.type));
        if (matched) {
          stats[matched.id].total++;
          stats[matched.id].exposure += issue.liabilityInr;
          if (issue.autoFixApplied) {
            stats[matched.id].fixed++;
          } else if (issue.isOverruled) {
            stats[matched.id].overruled++;
          } else {
            stats[matched.id].pending++;
          }
        }
      }
    }

    return stats;
  }, [records]);

  // Pagination & Virtualization calculations
  const totalItems = allExceptionItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, totalItems);

  // Virtual window slice when in 'virtualized' mode
  const virtualStartIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - VIRTUAL_OVERSCAN);
  const virtualVisibleCount = Math.ceil(VIRTUAL_VIEWPORT_HEIGHT / VIRTUAL_ROW_HEIGHT) + VIRTUAL_OVERSCAN * 2;
  const virtualEndIndex = Math.min(totalItems, virtualStartIndex + virtualVisibleCount);
  const topSpacerHeight = virtualStartIndex * VIRTUAL_ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (totalItems - virtualEndIndex) * VIRTUAL_ROW_HEIGHT);

  const visibleRows = useMemo(() => {
    if (tableDisplayMode === 'virtualized') {
      return allExceptionItems.slice(virtualStartIndex, virtualEndIndex);
    }
    return allExceptionItems.slice(pageStartIndex, pageEndIndex);
  }, [allExceptionItems, tableDisplayMode, virtualStartIndex, virtualEndIndex, pageStartIndex, pageEndIndex]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (tableDisplayMode === 'virtualized') {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };

  const resetScrollAndPage = () => {
    setCurrentPage(1);
    setScrollTop(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const totalPendingAction = summary.totalIssuesCount - summary.resolvedIssuesCount - (summary.overruledCount || 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* 1. COMPACT EXECUTIVE HEADER & METRIC STRIP                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Step 2 · Statutory Exception Pre-Processor</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-normal">
                2026 Four Labour Codes & EPFO ₹25K Ceiling (S.O. 5109(E))
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Payroll Compliance Triage
            </h1>
          </div>

          {/* Scale & Primary Action Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onSelectHeadcountScale && (
              <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200/70">
                <button
                  onClick={() => {
                    onSelectHeadcountScale('demo');
                    resetScrollAndPage();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    headcountScale === 'demo'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Demo (21)
                </button>
                <button
                  onClick={() => {
                    onSelectHeadcountScale('enterprise');
                    resetScrollAndPage();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    headcountScale === 'enterprise'
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>1,450 Staff</span>
                </button>
              </div>
            )}

            {onToggleSeptemberRun && (
              <button
                onClick={() => onToggleSeptemberRun(!isSeptemberRun)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSeptemberRun
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Toggle September 2026 Split-Period ECR (16/30 days @ ₹15K + 14/30 days @ ₹25K)"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isSeptemberRun ? 'Sept 2026 Split' : 'Oct 2026+ Cap'}</span>
              </button>
            )}

            <button
              onClick={onApproveAllFixes}
              disabled={totalPendingAction === 0}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                totalPendingAction > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Fix All ({totalPendingAction})</span>
            </button>

            <button
              onClick={onProceedToExport}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Export</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Minimalist 4-Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3.5">
          <div className="flex items-baseline justify-between md:block border-r border-slate-100 pr-4">
            <div className="text-[11px] font-medium text-slate-500">Audited Workforce</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {summary.totalHeadcount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">
                (<span className="text-emerald-700 font-semibold">{summary.cleanHeadcount}</span> clean · {summary.flaggedHeadcount} flagged)
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between md:block border-r border-slate-100 pr-4">
            <div className="text-[11px] font-medium text-slate-500">Unresolved Risk Exposure</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-rose-700 font-mono tabular-nums">
                {formatINR(summary.totalStatutoryRiskInr)}
              </span>
              <span className="text-[11px] text-slate-400">arrears</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between md:block border-r border-slate-100 pr-4">
            <div className="text-[11px] font-medium text-slate-500">EPF ₹25K Delta</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-indigo-700 font-mono tabular-nums">
                {formatINR(summary.epfAdjustmentsInr)}
              </span>
              <span className="text-[11px] text-slate-400">S.O. 5109(E)</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between md:block">
            <div className="text-[11px] font-medium text-slate-500">Resolution Progress</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {summary.resolvedIssuesCount + (summary.overruledCount || 0)}/{summary.totalIssuesCount}
              </span>
              <span className="text-[11px] text-slate-500">
                <span className="text-emerald-700 font-semibold">{summary.resolvedIssuesCount}</span> fixed ·{' '}
                <span className="text-amber-700 font-semibold">{summary.overruledCount || 0}</span> overruled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. COMPACT TOPIC TRIAGE STRIP (6 TOPICS)                  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STATUTORY_TOPICS.map((topic) => {
          const stat = topicStats[topic.id];
          const isSelected = activeTopicFilter === topic.id;
          const isAllResolved = stat.total > 0 && stat.pending === 0;

          return (
            <div
              key={topic.id}
              onClick={() => {
                setActiveTopicFilter(isSelected ? 'all' : topic.id);
                resetScrollAndPage();
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900 shadow-2xs'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      {topic.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {topic.shortName}
                    </span>
                  </div>
                  {isAllResolved ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="All resolved" />
                  ) : stat.pending > 0 ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                      {stat.pending}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex items-baseline justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">{stat.total} items</span>
                  <span className="font-mono font-semibold text-slate-700">{formatINR(stat.exposure)}</span>
                </div>
              </div>

              {/* Compact Topic Actions */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                {stat.pending > 0 ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    {onFixAllInTopic && (
                      <button
                        onClick={() => {
                          const targetItems = records
                            .flatMap((r) => r.complianceIssues.map((i) => ({ recordId: r.id, issue: i })))
                            .filter((it) => topic.violationTypes.includes(it.issue.type) && !it.issue.autoFixApplied && !it.issue.isOverruled)
                            .map((it) => ({ recordId: it.recordId, issueId: it.issue.id }));
                          onFixAllInTopic(targetItems);
                        }}
                        className="flex-1 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer text-center"
                      >
                        Fix All
                      </button>
                    )}
                    {onOverruleAllInTopic && (
                      <button
                        onClick={() => {
                          const targetItems = records
                            .flatMap((r) => r.complianceIssues.map((i) => ({ recordId: r.id, issue: i })))
                            .filter((it) => topic.violationTypes.includes(it.issue.type) && !it.issue.autoFixApplied && !it.issue.isOverruled)
                            .map((it) => ({ recordId: it.recordId, issueId: it.issue.id }));
                          onOverruleAllInTopic(targetItems);
                        }}
                        className="flex-1 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer text-center"
                      >
                        Overrule
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Triaged ({stat.fixed}F / {stat.overruled}O)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. MINIMALIST 4-COLUMN TABLE (PAGINATED + VIRTUALIZED)    */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Compact Filter Bar */}
        <div className="px-4 py-2.5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 bg-slate-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-900">
              {activeTopicFilter === 'all'
                ? 'All Exceptions'
                : STATUTORY_TOPICS.find((t) => t.id === activeTopicFilter)?.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200/70 text-slate-800">
              {totalItems.toLocaleString('en-IN')} rows
            </span>
            {activeTopicFilter !== 'all' && (
              <button
                onClick={() => {
                  setActiveTopicFilter('all');
                  resetScrollAndPage();
                }}
                className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer ml-1"
              >
                Clear Topic Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* State Filter */}
            <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'karnataka_may2026', label: 'KA' },
                { id: 'maharashtra', label: 'MH' },
                { id: 'tamilnadu', label: 'TN' },
                { id: 'delhi_ncr', label: 'DL' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setFilterState(st.id);
                    resetScrollAndPage();
                  }}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    filterState === st.id
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'fixed', label: 'Fixed' },
                { id: 'overruled', label: 'Overruled' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setStatusFilter(st.id as 'all' | 'pending' | 'fixed' | 'overruled');
                    resetScrollAndPage();
                  }}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Pagination vs Virtual Scroll Switcher */}
            <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-[11px]" title="Switch between Paginated pages or Virtualized 1,000+ row stream">
              <button
                onClick={() => {
                  setTableDisplayMode('paginated');
                  resetScrollAndPage();
                }}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  tableDisplayMode === 'paginated'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => {
                  setTableDisplayMode('virtualized');
                  resetScrollAndPage();
                }}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  tableDisplayMode === 'virtualized'
                    ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Virtual Scroll
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-44 sm:w-52">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter name, ID, store..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetScrollAndPage();
                }}
                className="w-full pl-7 pr-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Minimalist 4-Column Table Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`overflow-x-auto ${
            tableDisplayMode === 'virtualized' ? 'max-h-[576px] overflow-y-auto' : ''
          }`}
        >
          <table className="w-full text-left border-collapse text-xs table-fixed min-w-[780px]">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2 px-3 font-semibold w-[26%]">Employee & Location</th>
                <th className="py-2 px-3 font-semibold w-[28%]">Topic & Statutory Breach</th>
                <th className="py-2 px-3 font-semibold w-[26%]">Reported → Statutory Value</th>
                <th className="py-2 px-3 font-semibold w-[20%] text-right">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {totalItems === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-slate-900">No Exceptions Match Filter</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All payroll records in this view are compliant or filtered out.
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {tableDisplayMode === 'virtualized' && topSpacerHeight > 0 && (
                    <tr style={{ height: `${topSpacerHeight}px` }}>
                      <td colSpan={4} className="p-0 border-0" />
                    </tr>
                  )}

                  {visibleRows.map(({ employee, issue, topic }) => {
                    const isFixed = issue.autoFixApplied;
                    const isOverruled = issue.isOverruled;
                    const isPending = !isFixed && !isOverruled;
                    const stateCode =
                      employee.state === 'karnataka_may2026'
                        ? 'KA'
                        : employee.state === 'maharashtra'
                        ? 'MH'
                        : employee.state === 'tamilnadu'
                        ? 'TN'
                        : 'DL';

                    return (
                      <tr
                        key={`${employee.id}-${issue.id}`}
                        className={`h-12 hover:bg-slate-50/90 transition-colors ${
                          isFixed
                            ? 'bg-emerald-50/20'
                            : isOverruled
                            ? 'bg-amber-50/20'
                            : 'bg-white'
                        }`}
                      >
                        {/* COL 1: Employee & Location (Single compact cell) */}
                        <td className="py-1.5 px-3 truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-semibold text-slate-900 truncate">
                              {employee.name}
                            </span>
                            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-100 text-slate-600 shrink-0">
                              {stateCode}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {employee.empCode} · <span className="font-sans">{employee.storeLocation.split(',')[0]}</span>
                          </div>
                        </td>

                        {/* COL 2: Topic & Statutory Breach */}
                        <td className="py-1.5 px-3 truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 shrink-0">
                              {topic.shortName}
                            </span>
                            <span className="font-medium text-slate-800 truncate" title={issue.title}>
                              {issue.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {issue.ruleReference.split('&')[0]} ·{' '}
                            <span className="text-rose-700 font-mono font-semibold">
                              {formatINR(issue.liabilityInr)} risk
                            </span>
                          </div>
                        </td>

                        {/* COL 3: Reported -> AI Statutory Value */}
                        <td className="py-1.5 px-3 font-mono text-[11px] truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-500 line-through decoration-slate-300 truncate" title={`Reported: ${issue.reportedValue}`}>
                              {issue.reportedValue}
                            </span>
                            <span className="text-slate-300 shrink-0">→</span>
                            <span className="font-bold text-emerald-800 flex items-center gap-0.5 truncate" title={`Statutory: ${issue.correctedValue}`}>
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{issue.correctedValue}</span>
                            </span>
                          </div>
                        </td>

                        {/* COL 4: Unified Status & Action */}
                        <td className="py-1.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => onToggleRecordFix(employee.id, issue.id)}
                                  className="px-2 py-0.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                                  title="Apply statutory fix"
                                >
                                  Fix
                                </button>
                                {onToggleOverrule && (
                                  <button
                                    onClick={() => onToggleOverrule(employee.id, issue.id)}
                                    className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
                                    title="Overrule suggestion"
                                  >
                                    Overrule
                                  </button>
                                )}
                              </>
                            ) : isFixed ? (
                              <button
                                onClick={() => onToggleRecordFix(employee.id, issue.id)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                                title="Click to undo fix"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                <span>Fixed · Undo</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onToggleOverrule && onToggleOverrule(employee.id, issue.id)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                                title="Click to undo overrule"
                              >
                                <Slash className="w-2.5 h-2.5" />
                                <span>Overruled · Undo</span>
                              </button>
                            )}

                            <button
                              onClick={() => onInspectRecord(employee)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                              title="Inspect worker statutory calculation"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {tableDisplayMode === 'virtualized' && bottomSpacerHeight > 0 && (
                    <tr style={{ height: `${bottomSpacerHeight}px` }}>
                      <td colSpan={4} className="p-0 border-0" />
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Bar: Pagination or Virtualized Status */}
        {totalItems > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            {tableDisplayMode === 'virtualized' ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  Virtual window rendering rows{' '}
                  <span className="font-mono font-semibold text-slate-800">
                    {virtualStartIndex + 1}–{virtualEndIndex}
                  </span>{' '}
                  of{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    {totalItems.toLocaleString('en-IN')}
                  </span>{' '}
                  total exceptions (60fps DOM windowing active)
                </div>
                <button
                  onClick={() => setTableDisplayMode('paginated')}
                  className="text-slate-700 font-semibold hover:underline cursor-pointer"
                >
                  Switch to Paginated View
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span>Rows</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {pageStartIndex + 1}–{pageEndIndex}
                  </span>
                  <span>of</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {totalItems.toLocaleString('en-IN')}
                  </span>

                  <span className="text-slate-300 mx-1">|</span>
                  <span>Page size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={safeCurrentPage <= 1}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="First page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="px-2 font-mono text-slate-700 font-semibold">
                    {safeCurrentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safeCurrentPage >= totalPages}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Last page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
