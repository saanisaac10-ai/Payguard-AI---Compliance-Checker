import React, { useState, useMemo, useCallback } from 'react';
import { 
  EmployeeRecord, 
  TargetHRMS, 
  StateRuleset, 
  ProcessingMode,
  AuditSummary, 
  UploadedFileMeta 
} from './types/payroll';
import { 
  getEvaluatedSampleData, 
  getEvaluatedMultiStateData, 
  generateEnterpriseScaleRecords,
  RAW_BENGALURU_QSR_RECORDS,
  ALL_PAN_INDIA_RECORDS
} from './data/sampleStoreData';
import { recalculateEmployeeCompliance, formatINR } from './utils/statutoryRules';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { UploadConfigureStep } from './components/UploadConfigureStep';
import { AuditEngineStep } from './components/AuditEngineStep';
import { ExportStep } from './components/ExportStep';
import { AuditDetailModal } from './components/AuditDetailModal';
import { ComplianceRuleSheetModal } from './components/ComplianceRuleSheetModal';
import { CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const BENGALURU_FILES: UploadedFileMeta[] = [
  {
    name: 'Bengaluru_Stores_Biometric_Attendance_May2026.xlsx',
    size: '84 KB',
    type: 'attendance',
    recordCount: 12,
    timestamp: '10 mins ago',
  },
  {
    name: 'QuickStaff_Contractor_Monthly_Billing_May2026.csv',
    size: '42 KB',
    type: 'vendor_invoice',
    recordCount: 8,
    timestamp: '12 mins ago',
  },
  {
    name: 'Bengaluru_Store_Staff_KYC_Dossiers.pdf',
    size: '1.4 MB',
    type: 'kyc_pack',
    recordCount: 4,
    timestamp: '15 mins ago',
  },
];

const MULTI_STATE_FILES: UploadedFileMeta[] = [
  {
    name: 'PanIndia_Retail_Attendance_Muster_May2026.xlsx',
    size: '156 KB',
    type: 'attendance',
    recordCount: 21,
    timestamp: '5 mins ago',
  },
  {
    name: 'National_Contractor_Billing_KA_MH_TN_DL.csv',
    size: '88 KB',
    type: 'vendor_invoice',
    recordCount: 14,
    timestamp: '8 mins ago',
  },
  {
    name: 'MultiState_KYC_NewJoiner_Dossiers.pdf',
    size: '2.6 MB',
    type: 'kyc_pack',
    recordCount: 7,
    timestamp: '11 mins ago',
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(2); // Default to Step 2 to immediately showcase the AI Statutory Audit Engine
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('multi_state_batch'); // Default to multi-state batch mode
  const [targetHrms, setTargetHrms] = useState<TargetHRMS>('keka');
  const [stateRuleset, setStateRuleset] = useState<StateRuleset>('karnataka_may2026');
  const [headcountScale, setHeadcountScale] = useState<'demo' | 'enterprise'>('enterprise');
  const [records, setRecords] = useState<EmployeeRecord[]>(() => generateEnterpriseScaleRecords(1450, false));
  const [files, setFiles] = useState<UploadedFileMeta[]>(MULTI_STATE_FILES);
  const [inspectingRecord, setInspectingRecord] = useState<EmployeeRecord | null>(null);
  const [showRulebook, setShowRulebook] = useState<boolean>(false);
  const [isSeptemberRun, setIsSeptemberRun] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    'Active: Enterprise Scaled Cluster (1,450 Workers · 48 Stores in KA, MH, TN, DL)'
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  // Recalculate summary metrics dynamically
  const summary: AuditSummary = useMemo(() => {
    let totalStatutoryRiskInr = 0;
    let epfAdjustmentsInr = 0;
    let kycBlockersCount = 0;
    let totalIssuesCount = 0;
    let resolvedIssuesCount = 0;
    let overruledCount = 0;
    let cleanHeadcount = 0;
    let flaggedHeadcount = 0;

    const byCategory = {
      minimumWage: 0,
      epfCeiling: 0,
      septSplit: 0,
      wageCode50: 0,
      otDoubleRate: 0,
      deductionsCap: 0,
      leaveEncashment: 0,
      ifscKyc: 0,
      ptLwfTds: 0,
    };

    const byState: Record<StateRuleset, { count: number; flagged: number; riskInr: number }> = {
      karnataka_may2026: { count: 0, flagged: 0, riskInr: 0 },
      maharashtra: { count: 0, flagged: 0, riskInr: 0 },
      tamilnadu: { count: 0, flagged: 0, riskInr: 0 },
      delhi_ncr: { count: 0, flagged: 0, riskInr: 0 },
    };

    records.forEach((emp) => {
      if (emp.complianceIssues.length === 0) {
        cleanHeadcount++;
      } else {
        flaggedHeadcount++;
      }

      if (byState[emp.state]) {
        byState[emp.state].count++;
        if (emp.complianceIssues.length > 0) {
          byState[emp.state].flagged++;
          const unappliedRisk = emp.complianceIssues
            .filter((i) => !i.autoFixApplied && !i.isOverruled)
            .reduce((sum, i) => sum + i.liabilityInr, 0);
          byState[emp.state].riskInr += unappliedRisk;
        }
      }

      emp.complianceIssues.forEach((issue) => {
        totalIssuesCount++;
        if (issue.autoFixApplied) {
          resolvedIssuesCount++;
        } else if (issue.isOverruled) {
          overruledCount++;
        } else {
          totalStatutoryRiskInr += issue.liabilityInr;
        }

        if (issue.type === 'MINIMUM_WAGE_BREACH') byCategory.minimumWage++;
        if (issue.type === 'EPF_25K_CEILING_ERROR') {
          byCategory.epfCeiling++;
          if (!issue.autoFixApplied && !issue.isOverruled) {
            epfAdjustmentsInr += issue.liabilityInr;
          }
        }
        if (issue.type === 'SEPT_2026_ECR_SPLIT_ERROR') byCategory.septSplit++;
        if (issue.type === 'WAGE_CODE_50_RULE') byCategory.wageCode50++;
        if (issue.type === 'OT_DOUBLE_RATE_MISMATCH') byCategory.otDoubleRate++;
        if (issue.type === 'DEDUCTION_50_PERCENT_CAP') byCategory.deductionsCap++;
        if (issue.type === 'LEAVE_ENCASHMENT_BREACH') byCategory.leaveEncashment++;
        if (
          issue.type === 'PT_SLAB_OR_EXEMPTION_ERROR' ||
          issue.type === 'LWF_SCHEDULE_ERROR' ||
          issue.type === 'ESI_PWD_OR_CEILING_ERROR' ||
          issue.type === 'TDS_2025_ACT_OR_REGIME_ERROR' ||
          issue.type === 'STATUTORY_BONUS_BREACH' ||
          issue.type === 'GRATUITY_PROVISION_OR_CAP_ERROR'
        ) {
          byCategory.ptLwfTds++;
        }
        if (issue.type === 'IFSC_KYC_ERROR') {
          byCategory.ifscKyc++;
          if (!issue.autoFixApplied && !issue.isOverruled) kycBlockersCount++;
        }
      });
    });

    return {
      totalHeadcount: records.length,
      totalStatutoryRiskInr,
      epfAdjustmentsInr,
      kycBlockersCount,
      totalIssuesCount,
      resolvedIssuesCount,
      overruledCount,
      cleanHeadcount,
      flaggedHeadcount,
      byCategory,
      byState,
    };
  }, [records]);

  // Mode switcher handler
  const handleSelectProcessingMode = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    if (mode === 'multi_state_batch') {
      const multi = getEvaluatedMultiStateData();
      setRecords(multi);
      setFiles(MULTI_STATE_FILES);
      showToast('Switched to Multi-State Batch Mode: Auto-splitting by Karnataka, Maharashtra, Tamil Nadu & Delhi NCR.');
    } else {
      const single = getEvaluatedSampleData(stateRuleset);
      setRecords(single);
      setFiles(BENGALURU_FILES);
      showToast(`Switched to Single State Mode: Applying ${stateRuleset.replace('_', ' ').toUpperCase()} across all rows.`);
    }
  };

  // Handler: Change State Ruleset (in Single State Mode)
  const handleSelectStateRuleset = (state: StateRuleset) => {
    setStateRuleset(state);
    if (processingMode === 'single_state') {
      const updated = RAW_BENGALURU_QSR_RECORDS.map((emp) =>
        recalculateEmployeeCompliance(emp, state)
      );
      setRecords(updated);
      showToast(`Re-evaluated payroll against ${state.replace('_', ' ').toUpperCase()} minimum wage rates.`);
    }
  };

  // Handler: Load Bengaluru data
  const handleLoadBengaluruData = () => {
    setProcessingMode('single_state');
    const single = getEvaluatedSampleData('karnataka_may2026');
    setRecords(single);
    setFiles(BENGALURU_FILES);
    setStateRuleset('karnataka_may2026');
    setCurrentStep(2);
    showToast('Loaded Bengaluru QSR Store sample run (12 records · Karnataka May 2026 ruleset).');
  };

  // Handler: Load Multi-state data
  const handleLoadMultiStateData = () => {
    setProcessingMode('multi_state_batch');
    const multi = getEvaluatedMultiStateData();
    setRecords(multi);
    setFiles(MULTI_STATE_FILES);
    setCurrentStep(2);
    showToast('Loaded Pan-India Multi-State Retail Cluster (21 records · Auto-split by 4 State Rulesets).');
  };

  // Handler: Select Headcount Scale (Demo vs Enterprise 1,000-2,000)
  const handleSelectHeadcountScale = (scale: 'demo' | 'enterprise') => {
    setHeadcountScale(scale);
    if (scale === 'enterprise') {
      const ent = generateEnterpriseScaleRecords(1450, isSeptemberRun);
      setRecords(ent);
      showToast('Loaded Enterprise Cluster: 1,450 Workers across 48 Stores in KA, MH, TN & DL.');
    } else {
      const demo = getEvaluatedMultiStateData(isSeptemberRun);
      setRecords(demo);
      showToast('Loaded Demo Cluster: 21 sample worker records.');
    }
  };

  // Handler: Toggle September 2026 Split-Period Run
  const handleToggleSeptemberRun = (isSept: boolean) => {
    setIsSeptemberRun(isSept);
    const updated = records.map((emp) =>
      recalculateEmployeeCompliance(
        emp,
        processingMode === 'single_state' ? stateRuleset : emp.state,
        isSept
      )
    );
    setRecords(updated);
    showToast(
      isSept
        ? 'Simulating September 2026 Split ECR: Dual proportionate ceiling (16/30 @ ₹15K, 14/30 @ ₹25K).'
        : 'Switched to Standard Statutory Run: Full ₹25K EPFO wage ceiling under Notification S.O. 5109(E).'
    );
  };

  // Handler: Approve All Auto-Fixes
  const handleApproveAllFixes = () => {
    const updated = records.map((emp) => {
      const issues = emp.complianceIssues.map((issue) => ({
        ...issue,
        autoFixApplied: true,
      }));

      // In a real system, applying fixes normalizes bank IFSC and values
      let finalIfsc = emp.ifscCode;
      let finalBank = emp.bankName;
      if (emp.ifscCode.startsWith('CORP')) {
        finalIfsc = 'UBIN0902891';
        finalBank = 'Union Bank of India (Post-Merger)';
      } else if (emp.ifscCode.startsWith('SYNB')) {
        finalIfsc = 'CNRB0001100';
        finalBank = 'Canara Bank (Post-Merger)';
      } else if (emp.ifscCode.startsWith('ALLA')) {
        finalIfsc = 'IDIB0002019';
        finalBank = 'Indian Bank (Post-Merger)';
      } else if (emp.ifscCode.startsWith('ANDB')) {
        finalIfsc = 'UBIN0800412';
        finalBank = 'Union Bank of India (Post-Merger)';
      } else if (emp.ifscCode.startsWith('ORBC')) {
        finalIfsc = 'PUNB0001004';
        finalBank = 'Punjab National Bank (Post-Merger)';
      }

      return {
        ...emp,
        ifscCode: finalIfsc,
        bankName: finalBank,
        complianceIssues: issues,
        status: 'auto_fixed' as const,
      };
    });

    setRecords(updated);
    showToast('Applied all statutory auto-fixes across all states: EPF ₹25K adjustments, 2x OT rates & IFSC normalizations.');
  };

  // Handler: Toggle single issue fix
  const handleToggleRecordFix = (recordId: string, issueId: string) => {
    const updated = records.map((emp) => {
      if (emp.id !== recordId) return emp;
      const issues = emp.complianceIssues.map((issue) => {
        if (issue.id !== issueId) return issue;
        const nextFix = !issue.autoFixApplied;
        return {
          ...issue,
          autoFixApplied: nextFix,
          isOverruled: nextFix ? false : issue.isOverruled,
        };
      });

      const allResolved = issues.every((i) => i.autoFixApplied || i.isOverruled);
      const anyOverruled = issues.some((i) => i.isOverruled);
      return {
        ...emp,
        complianceIssues: issues,
        status: (allResolved ? (anyOverruled ? 'overruled' : 'auto_fixed') : 'flagged') as 'auto_fixed' | 'flagged' | 'overruled',
      };
    });

    setRecords(updated);
  };

  // Handler: Toggle single issue overrule (employer exception)
  const handleToggleOverrule = (recordId: string, issueId: string) => {
    const updated = records.map((emp) => {
      if (emp.id !== recordId) return emp;
      const issues = emp.complianceIssues.map((issue) => {
        if (issue.id !== issueId) return issue;
        const nextOverruled = !issue.isOverruled;
        return {
          ...issue,
          isOverruled: nextOverruled,
          autoFixApplied: nextOverruled ? false : issue.autoFixApplied,
          overruleReason: nextOverruled ? 'Authorized Employer Discretion / Contractual Exception' : undefined,
        };
      });

      const allResolved = issues.every((i) => i.autoFixApplied || i.isOverruled);
      const anyOverruled = issues.some((i) => i.isOverruled);
      return {
        ...emp,
        complianceIssues: issues,
        status: (allResolved ? (anyOverruled ? 'overruled' : 'auto_fixed') : 'flagged') as 'auto_fixed' | 'flagged' | 'overruled',
      };
    });

    setRecords(updated);
    showToast('Updated status: Suggestion overruled (reported value retained as employer exception).');
  };

  // Handler: Fix all issues in a specific topic
  const handleFixAllInTopic = (targetIssues: { recordId: string; issueId: string }[]) => {
    const targetMap = new Map<string, Set<string>>();
    targetIssues.forEach(({ recordId, issueId }) => {
      if (!targetMap.has(recordId)) targetMap.set(recordId, new Set());
      targetMap.get(recordId)!.add(issueId);
    });

    const updated = records.map((emp) => {
      const issueSet = targetMap.get(emp.id);
      if (!issueSet) return emp;
      const issues = emp.complianceIssues.map((issue) => {
        if (!issueSet.has(issue.id)) return issue;
        return {
          ...issue,
          autoFixApplied: true,
          isOverruled: false,
        };
      });

      let finalIfsc = emp.ifscCode;
      let finalBank = emp.bankName;
      if (emp.ifscCode.startsWith('CORP')) { finalIfsc = 'UBIN0902891'; finalBank = 'Union Bank of India (Post-Merger)'; }
      else if (emp.ifscCode.startsWith('SYNB')) { finalIfsc = 'CNRB0001100'; finalBank = 'Canara Bank (Post-Merger)'; }
      else if (emp.ifscCode.startsWith('ALLA')) { finalIfsc = 'IDIB0002019'; finalBank = 'Indian Bank (Post-Merger)'; }
      else if (emp.ifscCode.startsWith('ANDB')) { finalIfsc = 'UBIN0800412'; finalBank = 'Union Bank of India (Post-Merger)'; }
      else if (emp.ifscCode.startsWith('ORBC')) { finalIfsc = 'PUNB0001004'; finalBank = 'Punjab National Bank (Post-Merger)'; }

      const allResolved = issues.every((i) => i.autoFixApplied || i.isOverruled);
      const anyOverruled = issues.some((i) => i.isOverruled);
      return {
        ...emp,
        ifscCode: finalIfsc,
        bankName: finalBank,
        complianceIssues: issues,
        status: (allResolved ? (anyOverruled ? 'overruled' : 'auto_fixed') : 'flagged') as 'auto_fixed' | 'flagged' | 'overruled',
      };
    });

    setRecords(updated);
    showToast(`Applied AI statutory auto-fixes to ${targetIssues.length} items in this topic.`);
  };

  // Handler: Overrule all issues in a specific topic
  const handleOverruleAllInTopic = (targetIssues: { recordId: string; issueId: string }[]) => {
    const targetMap = new Map<string, Set<string>>();
    targetIssues.forEach(({ recordId, issueId }) => {
      if (!targetMap.has(recordId)) targetMap.set(recordId, new Set());
      targetMap.get(recordId)!.add(issueId);
    });

    const updated = records.map((emp) => {
      const issueSet = targetMap.get(emp.id);
      if (!issueSet) return emp;
      const issues = emp.complianceIssues.map((issue) => {
        if (!issueSet.has(issue.id)) return issue;
        return {
          ...issue,
          isOverruled: true,
          autoFixApplied: false,
          overruleReason: 'Authorized Employer Exception / Contractual Discretion',
        };
      });

      const allResolved = issues.every((i) => i.autoFixApplied || i.isOverruled);
      return {
        ...emp,
        complianceIssues: issues,
        status: (allResolved ? 'overruled' : 'flagged') as 'auto_fixed' | 'flagged' | 'overruled',
      };
    });

    setRecords(updated);
    showToast(`Overruled suggestions for ${targetIssues.length} items in this topic.`);
  };

  const handleAddFiles = (newFiles: UploadedFileMeta[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    showToast(`Added ${newFiles.length} file(s) to pre-payroll ingestion queue.`);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Executive Top Bar */}
      <Header
        onOpenRulebook={() => setShowRulebook(true)}
        onResetToDemo={handleLoadMultiStateData}
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* 3-Step Workflow Indicator */}
      <StepProgress
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        flaggedCount={summary.totalIssuesCount}
        resolvedCount={summary.resolvedIssuesCount}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <UploadConfigureStep
            processingMode={processingMode}
            onSelectProcessingMode={handleSelectProcessingMode}
            targetHrms={targetHrms}
            onSelectTargetHrms={setTargetHrms}
            stateRuleset={stateRuleset}
            onSelectStateRuleset={handleSelectStateRuleset}
            onLoadBengaluruData={handleLoadBengaluruData}
            onLoadMultiStateData={handleLoadMultiStateData}
            onLoadEnterpriseScaleData={() => handleSelectHeadcountScale('enterprise')}
            onProceedToAudit={() => setCurrentStep(2)}
            files={files}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            records={records}
          />
        )}

        {currentStep === 2 && (
          <AuditEngineStep
            records={records}
            summary={summary}
            processingMode={processingMode}
            headcountScale={headcountScale}
            onSelectHeadcountScale={handleSelectHeadcountScale}
            isSeptemberRun={isSeptemberRun}
            onToggleSeptemberRun={handleToggleSeptemberRun}
            onApproveAllFixes={handleApproveAllFixes}
            onToggleRecordFix={handleToggleRecordFix}
            onToggleOverrule={handleToggleOverrule}
            onFixAllInTopic={handleFixAllInTopic}
            onOverruleAllInTopic={handleOverruleAllInTopic}
            onInspectRecord={(rec) => setInspectingRecord(rec)}
            onProceedToExport={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <ExportStep
            records={records}
            targetHrms={targetHrms}
            stateRuleset={stateRuleset}
            onBackToAudit={() => setCurrentStep(2)}
          />
        )}
      </main>

      {/* Modals */}
      <AuditDetailModal
        record={inspectingRecord}
        onClose={() => setInspectingRecord(null)}
        onToggleFix={handleToggleRecordFix}
        onToggleOverrule={handleToggleOverrule}
      />

      <ComplianceRuleSheetModal
        isOpen={showRulebook}
        onClose={() => setShowRulebook(false)}
      />

      {/* Executive Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">PayGuard AI</span>
            <span>·</span>
            <span>Pre-Payroll & Statutory Compliance Pre-Processor</span>
            <span>·</span>
            <span>Multi-State Auto-Partitioning: KA · MH · TN · DL</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setShowRulebook(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Statutory Gazette Citations
            </button>
            <span>·</span>
            <button
              onClick={handleLoadMultiStateData}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Reload Multi-State Batch
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
