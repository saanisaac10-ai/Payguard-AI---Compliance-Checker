export type TargetHRMS = 'keka' | 'greythr' | 'darwinbox' | 'razorpayx';

export type StateRuleset = 'karnataka_may2026' | 'maharashtra' | 'tamilnadu' | 'delhi_ncr';

export type ViolationType =
  | 'MINIMUM_WAGE_BREACH'
  | 'EPF_25K_CEILING_ERROR'
  | 'SEPT_2026_ECR_SPLIT_ERROR'
  | 'WAGE_CODE_50_RULE'
  | 'OT_DOUBLE_RATE_MISMATCH'
  | 'DEDUCTION_50_PERCENT_CAP'
  | 'LEAVE_ENCASHMENT_BREACH'
  | 'IFSC_KYC_ERROR'
  | 'PT_SLAB_OR_EXEMPTION_ERROR'
  | 'LWF_SCHEDULE_ERROR'
  | 'ESI_PWD_OR_CEILING_ERROR'
  | 'TDS_2025_ACT_OR_REGIME_ERROR'
  | 'STATUTORY_BONUS_BREACH'
  | 'GRATUITY_PROVISION_OR_CAP_ERROR';

export interface ComplianceIssue {
  id: string;
  type: ViolationType;
  severity: 'critical' | 'high' | 'medium';
  codeCategory: 'Wage Code' | 'SS Code' | 'OSHWC Code' | 'IR Code' | 'Frappe Payroll';
  title: string;
  description: string;
  ruleReference: string;
  legalClause: string;
  penaltyReference?: string;
  reportedValue: string;
  correctedValue: string;
  liabilityInr: number;
  calculationBreakdown?: string[];
  autoFixApplied: boolean;
  isOverruled?: boolean;
}

export interface SeptemberSplitDetails {
  period1Days: number; // 16 days (Sept 1 - Sept 16)
  period2Days: number; // 14 days (Sept 17 - Sept 30)
  period1Ceiling: number; // ₹8,000
  period2Ceiling: number; // ₹11,667
  period1Wage: number;
  period2Wage: number;
  totalSeptPfWage: number;
  totalSeptEpsWage: number;
  employeePf12: number;
  employerEps833: number;
  employerEpf367: number;
  employerEdli05: number;
  adminCharges05: number;
  totalSeptRemittance: number;
}

export interface EmployeeRecord {
  id: string;
  empCode: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  role: string;
  department: string;
  storeLocation: string;
  state: StateRuleset;
  employmentType: 'direct' | 'contract';
  contractorAgency?: string;
  daysWorked: number;
  standardMonthDays: number;
  overtimeHours: number;
  unavailedLeaveDays: number;
  yearsOfService?: number;
  isInternationalWorker?: boolean;

  // Remuneration Components
  basicPay: number;
  da: number;
  retainingAllowance: number;
  hra: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  otherAllowances: number;
  totalRemuneration: number;
  sumOfExclusions: number;
  excessExclusions: number;
  statutoryWages: number;

  // Gross & OT
  reportedGrossPay: number;
  reportedOtPay: number;
  correctedOtPay: number;

  // EPF / EPS / EDLI / VPF
  reportedPfWage: number;
  correctedPfWage: number;
  reportedPfEmployee: number;
  correctedPfEmployee: number;
  reportedPfEmployer: number;
  correctedPfEmployer: number;
  epsEmployer833: number;
  epfEmployer367: number;
  edliEmployer05: number;
  adminCharges05: number;
  isEpsMember: boolean;
  vpfPercentage?: number;
  vpfAmount?: number;
  septemberSplit?: SeptemberSplitDetails;

  // ESIC (with PwD ₹25K ceiling & ₹176/day exemption from frappe + chetanpayroll)
  esicApplicable: boolean;
  isDisabledPwD?: boolean;
  esicCeiling?: number;
  esiExemptUnder176DailyWage?: boolean;
  esiForceContPeriod?: boolean;
  reportedEsic: number;
  correctedEsicEmployee: number;
  correctedEsicEmployer: number;

  // Frappe & Chetan India Payroll: State PT, LWF, Statutory Bonus, Gratuity & Income-tax Act 2025 (Form 138)
  payrollMonth?: number; // 1-12 (e.g. 2 = Feb, 5 = May, 6 = June, 9 = Sept, 12 = Dec)
  reportedPt?: number;
  correctedPt?: number;
  reportedLwf?: number;
  correctedLwfEmployee?: number;
  correctedLwfEmployer?: number;
  bonusPaidMonthly?: number;
  statutoryBonusMonthly?: number;
  gratuityAccruedTotal?: number;
  gratuityEligible?: boolean;
  monthlyGratuityProvision?: number;
  taxRegime?: 'NEW_2025_26' | 'OLD';
  reportedTdsMonthly?: number;
  correctedTdsMonthly?: number;
  tdsFormCode?: 'Form 138 (TY 2026-27)' | 'Form 24Q (FY 2025-26)';
  netPayInWords?: string;

  // Deductions & Net
  reportedDeductions: number;
  deductionsCap50: number;
  correctedGrossPay: number;
  correctedNetPay: number;

  // Banking & KYC (IndiaValidator Verhoeff Aadhaar Checksum, PAN Entity, UAN, ESIC 17-digit, IFSC)
  bankAccount: string;
  ifscCode: string;
  bankName: string;
  ifscStatus: 'valid' | 'merged_bank_invalid' | 'obsolete_merged' | 'format_error';
  panNumber: string;
  panRaw?: string;
  panMasked: string;
  panStatus: 'verified' | 'unverified' | 'mismatch' | 'invalid_format' | 'unlinked_aadhaar' | 'placeholder_20pct_tds';
  aadhaarRaw?: string;
  aadhaarMasked: string;
  aadhaarLinked: boolean;
  esicNumber?: string;
  uan: string;
  uanStatus: 'valid' | 'missing' | 'format_error';

  // Compliance Output
  complianceIssues: ComplianceIssue[];
  status: 'compliant' | 'clean' | 'flagged' | 'auto_fixed' | 'overruled';
}

export interface AuditSummary {
  totalHeadcount: number;
  totalStatutoryRiskInr: number;
  epfAdjustmentsInr: number;
  kycBlockersCount: number;
  totalIssuesCount: number;
  resolvedIssuesCount: number;
  overruledCount?: number;
  cleanHeadcount: number;
  flaggedHeadcount: number;
  byCategory: {
    minimumWage: number;
    epfCeiling: number;
    septSplit: number;
    wageCode50: number;
    otDoubleRate: number;
    deductionsCap: number;
    leaveEncashment: number;
    ifscKyc: number;
    ptLwfTds?: number;
  };
  byState?: Record<StateRuleset, { count: number; flagged: number; riskInr: number }>;
}

export type ProcessingMode = 'single_state' | 'multi_state_batch';

export interface UploadedFileMeta {
  name: string;
  size: string;
  type: 'attendance' | 'vendor_invoice' | 'kyc_pack';
  recordCount: number;
  timestamp: string;
}
