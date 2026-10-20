import { EmployeeRecord, TargetHRMS } from '../types/payroll';

export interface HRMSExportConfig {
  filename: string;
  hrmsName: string;
  headers: string[];
  rowMapper: (emp: EmployeeRecord) => (string | number)[];
}

export const HRMS_CONFIGS: Record<TargetHRMS, HRMSExportConfig> = {
  keka: {
    filename: 'keka_labour_codes_2026_sanitized_batch.csv',
    hrmsName: 'Keka HR',
    headers: [
      'Emp ID',
      'Employee Name',
      'UAN Number',
      'Work Location',
      'State Ruleset',
      'Designation',
      'Days Worked',
      'OT Hours',
      'Reported Basic',
      'Reported HRA',
      'Special Allowance',
      'Statutory_Wages',
      'EPF_Employee_12%',
      'EPS_Employer_8.33%',
      'EPF_Employer_3.67%',
      'EDLI_0.5%',
      'Admin_0.5%',
      'ESIC_Employee_0.75%',
      'ESIC_Employer_3.25%',
      'OT_2x_Pay',
      'Gross Disbursement',
      'Net Disbursement',
      'Bank Account Number',
      'Bank IFSC Code',
      'Masked PAN',
      'KYC_Validation_Status',
    ],
    rowMapper: (emp: EmployeeRecord) => [
      emp.empCode,
      emp.name,
      emp.uan || 'NA',
      emp.storeLocation,
      emp.state,
      emp.role,
      emp.daysWorked,
      emp.overtimeHours,
      emp.basicPay,
      emp.hra,
      emp.specialAllowance,
      emp.statutoryWages || emp.basicPay,
      emp.correctedPfEmployee,
      emp.epsEmployer833,
      emp.epfEmployer367,
      emp.edliEmployer05,
      emp.adminCharges05,
      emp.correctedEsicEmployee,
      emp.correctedEsicEmployer,
      emp.correctedOtPay || emp.reportedOtPay,
      emp.correctedGrossPay,
      emp.correctedNetPay,
      `'${emp.bankAccount}`,
      emp.ifscCode,
      emp.panMasked || '[ID Redacted]',
      emp.uanStatus === 'valid' && emp.ifscStatus === 'valid' ? 'KYC_VERIFIED' : 'PENDING_REVISION',
    ],
  },
  greythr: {
    filename: 'greythr_salary_upload_2026_batch.csv',
    hrmsName: 'greytHR',
    headers: [
      'Emp_No',
      'Emp_Name',
      'UAN',
      'Location_Name',
      'Designation',
      'Att_Days',
      'OT_Hours',
      'Earn_Basic',
      'Earn_HRA',
      'Statutory_Wages',
      'EPF_Employee_12%',
      'EPS_Employer_8.33%',
      'EPF_Employer_3.67%',
      'EDLI_0.5%',
      'Admin_0.5%',
      'ESIC_Employee_0.75%',
      'ESIC_Employer_3.25%',
      'OT_2x_Pay',
      'Gross_Earnings',
      'Net_Salary',
      'Bank_AC_No',
      'Bank_IFSC',
      'KYC_Validation_Status',
    ],
    rowMapper: (emp: EmployeeRecord) => [
      emp.empCode,
      emp.name,
      emp.uan || 'NA',
      emp.storeLocation,
      emp.role,
      emp.daysWorked,
      emp.overtimeHours,
      emp.basicPay,
      emp.hra,
      emp.statutoryWages || emp.basicPay,
      emp.correctedPfEmployee,
      emp.epsEmployer833,
      emp.epfEmployer367,
      emp.edliEmployer05,
      emp.adminCharges05,
      emp.correctedEsicEmployee,
      emp.correctedEsicEmployer,
      emp.correctedOtPay || emp.reportedOtPay,
      emp.correctedGrossPay,
      emp.correctedNetPay,
      `'${emp.bankAccount}`,
      emp.ifscCode,
      emp.uanStatus === 'valid' && emp.ifscStatus === 'valid' ? 'KYC_VALIDATED' : 'FLAGGED',
    ],
  },
  darwinbox: {
    filename: 'darwinbox_payroll_interface_2026.csv',
    hrmsName: 'Darwinbox',
    headers: [
      'Company_Worker_ID',
      'Worker_Name',
      'UAN',
      'Cost_Center',
      'Job_Profile',
      'Paid_Days',
      'Approved_OT_Hrs',
      'Basic_Component',
      'Statutory_Wages',
      'EPF_Employee_12%',
      'EPS_Employer_8.33%',
      'EPF_Employer_3.67%',
      'EDLI_0.5%',
      'Admin_0.5%',
      'ESIC_Employee_0.75%',
      'ESIC_Employer_3.25%',
      'OT_2x_Pay',
      'Gross_Payable',
      'Net_Payable',
      'Bank_Account_Number',
      'IFSC',
      'KYC_Validation_Status',
    ],
    rowMapper: (emp: EmployeeRecord) => [
      emp.empCode,
      emp.name,
      emp.uan || 'NA',
      emp.storeLocation,
      emp.role,
      emp.daysWorked,
      emp.overtimeHours,
      emp.basicPay,
      emp.statutoryWages || emp.basicPay,
      emp.correctedPfEmployee,
      emp.epsEmployer833,
      emp.epfEmployer367,
      emp.edliEmployer05,
      emp.adminCharges05,
      emp.correctedEsicEmployee,
      emp.correctedEsicEmployer,
      emp.correctedOtPay || emp.reportedOtPay,
      emp.correctedGrossPay,
      emp.correctedNetPay,
      `'${emp.bankAccount}`,
      emp.ifscCode,
      emp.uanStatus === 'valid' && emp.ifscStatus === 'valid' ? 'PASSED' : 'BLOCKED',
    ],
  },
  razorpayx: {
    filename: 'razorpayx_payroll_2026_direct_batch.csv',
    hrmsName: 'RazorpayX Payroll',
    headers: [
      'employee_id',
      'employee_name',
      'uan',
      'work_location',
      'role',
      'payable_days',
      'overtime_hours',
      'basic',
      'Statutory_Wages',
      'EPF_Employee_12%',
      'EPS_Employer_8.33%',
      'EPF_Employer_3.67%',
      'EDLI_0.5%',
      'Admin_0.5%',
      'ESIC_Employee_0.75%',
      'ESIC_Employer_3.25%',
      'OT_2x_Pay',
      'gross_salary',
      'net_disbursement',
      'bank_account',
      'ifsc',
      'KYC_Validation_Status',
    ],
    rowMapper: (emp: EmployeeRecord) => [
      emp.empCode,
      emp.name,
      emp.uan || 'NA',
      emp.storeLocation,
      emp.role,
      emp.daysWorked,
      emp.overtimeHours,
      emp.basicPay,
      emp.statutoryWages || emp.basicPay,
      emp.correctedPfEmployee,
      emp.epsEmployer833,
      emp.epfEmployer367,
      emp.edliEmployer05,
      emp.adminCharges05,
      emp.correctedEsicEmployee,
      emp.correctedEsicEmployer,
      emp.correctedOtPay || emp.reportedOtPay,
      emp.correctedGrossPay,
      emp.correctedNetPay,
      `'${emp.bankAccount}`,
      emp.ifscCode,
      emp.uanStatus === 'valid' && emp.ifscStatus === 'valid' ? 'CLEARED' : 'NEEDS_FIX',
    ],
  },
};

/**
 * Generate CSV string and trigger browser download
 */
export function exportToCSV(records: EmployeeRecord[], hrms: TargetHRMS): void {
  const config = HRMS_CONFIGS[hrms];
  const rows = records.map(config.rowMapper);
  
  const formatCell = (val: string | number) => {
    const stringVal = String(val);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const csvContent = [
    config.headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', config.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate September 2026 Split-Period Single ECR CSV Export
 * (Proportionate 16/30 @ ₹15K ceiling and 14/30 @ ₹25K ceiling)
 */
export function exportSeptember2026ECRCSV(records: EmployeeRecord[]): void {
  const headers = [
    'UAN (12 Digits)',
    'Member Name',
    'Gross Monthly Wages (₹)',
    'Period 1 (01-16 Sept) PF Wage',
    'Period 2 (17-30 Sept) PF Wage',
    'Total Sept PF Wages',
    'Total Sept EPS Wages',
    'EE Share (12%)',
    'ER EPF Share (3.67%)',
    'ER EPS Share (8.33%)',
    'EDLI Contribution (0.5%)',
    'Admin Charges (0.5%)',
    'Total Remittance (A/c 1+2+10+21)',
    'Para 22 Deferred Recovery Flag',
  ];

  const formatCell = (val: string | number) => {
    const stringVal = String(val);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const rows = records.map((emp) => {
    const split = emp.septemberSplit;
    return [
      emp.uan || '101982736451',
      emp.name,
      emp.correctedGrossPay,
      split ? split.period1Wage : Math.round(emp.statutoryWages * 16 / 30),
      split ? split.period2Wage : Math.round(emp.statutoryWages * 14 / 30),
      split ? split.totalSeptPfWage : emp.statutoryWages,
      split ? split.totalSeptEpsWage : emp.statutoryWages,
      split ? split.employeePf12 : emp.correctedPfEmployee,
      split ? split.employerEpf367 : emp.epfEmployer367,
      split ? split.employerEps833 : emp.epsEmployer833,
      split ? split.employerEdli05 : emp.edliEmployer05,
      split ? split.adminCharges05 : emp.adminCharges05,
      split ? split.totalSeptRemittance : emp.correctedPfEmployee * 2 + emp.edliEmployer05,
      emp.reportedPfEmployee === 1800 ? 'OCT_PAYROLL_DEFERRED_RECOVERY' : 'SEPT_SETTLED',
    ];
  });

  const csvContent = [
    headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'EPFO_September_2026_Split_Period_Single_ECR_Filing.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Official EPFO Unified Portal ECR `#~#` Text File
 * (`chetanpayroll/India-Payroll/lib/payroll/engines/india/IndiaComplianceGenerator.ts` -> `exportECRToText`)
 * Format: UAN#~#MEMBER_NAME#~#GROSS_WAGES#~#EPF_WAGES#~#EPS_WAGES#~#EDLI_WAGES#~#EPF_CONTRI_REMITTED#~#EPS_CONTRI_REMITTED#~#EPF_EPS_DIFF_REMITTED#~#NCP_DAYS#~#REFUND_OF_ADVANCES
 */
export function exportEPFOECRText(
  records: EmployeeRecord[],
  establishmentCode: string = 'KNBNG0048291000',
  month: number = 9,
  year: number = 2026
): void {
  const lines: string[] = [];
  lines.push(`#~#${establishmentCode}#~#ECR#~#REGULAR#~#${month.toString().padStart(2, '0')}${year}`);

  records.forEach((emp) => {
    const ncpDays = Math.max(0, (emp.standardMonthDays || 26) - emp.daysWorked);
    const epfWage = Math.round(emp.correctedPfWage);
    const epsWage = emp.isEpsMember && !emp.isInternationalWorker ? epfWage : 0;
    const edliWage = epfWage;
    const line = [
      emp.uan || '101982736451',
      emp.name.toUpperCase(),
      Math.round(emp.correctedGrossPay),
      epfWage,
      epsWage,
      edliWage,
      Math.round(emp.correctedPfEmployee),
      Math.round(emp.epsEmployer833),
      Math.round(emp.epfEmployer367),
      ncpDays,
      '0',
    ].join('#~#');
    lines.push(line);
  });

  const textContent = lines.join('\r\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `EPFO_ECR_${establishmentCode}_${month.toString().padStart(2, '0')}${year}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

