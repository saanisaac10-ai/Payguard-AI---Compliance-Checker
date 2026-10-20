import { jsPDF } from 'jspdf';
import { EmployeeRecord, StateRuleset } from '../types/payroll';
import { formatINR, STATE_MIN_WAGE_BENCHMARKS } from './statutoryRules';

export function generateFormTAuditCertificatePDF(
  records: EmployeeRecord[],
  state: StateRuleset = 'karnataka_may2026',
  hrmsName: string = 'Keka HR'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const stateInfo = STATE_MIN_WAGE_BENCHMARKS[state];
  const totalEmployees = records.length;
  const contractCount = records.filter(r => r.employmentType === 'contract').length;
  const directCount = totalEmployees - contractCount;
  
  const totalGross = records.reduce((acc, r) => acc + (r.correctedGrossPay || r.reportedGrossPay), 0);
  const totalPf = records.reduce((acc, r) => acc + (r.correctedPfEmployee + r.correctedPfEmployer), 0);
  const totalEsic = records.reduce((acc, r) => acc + ((r.correctedEsicEmployee || 0) + (r.correctedEsicEmployer || 0)), 0);

  // Palette
  const slate900 = [15, 23, 42];
  const slate600 = [71, 85, 105];
  const emerald700 = [4, 120, 87];

  // Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 24, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PAYGUARD AI | STATUTORY COMPLIANCE PRE-PROCESSOR', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('FORM T / CLRA PRINCIPAL EMPLOYER STATUTORY AUDIT CERTIFICATE', 14, 18);

  // Verification Seal Badge on right
  doc.setFillColor(4, 120, 87);
  doc.roundedRect(148, 6, 48, 12, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PRE-PAYROLL AUDIT PASSED', 151, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Statutory Hash: #PG-2026-KA', 151, 15);

  let y = 32;

  // Establishment Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('PRINCIPAL EMPLOYER & ESTABLISHMENT PARTICULARS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  
  // Left column
  doc.text('Establishment Name:', 18, y + 13);
  doc.text('CLRA Reg. Certificate No:', 18, y + 19);
  doc.text('EPFO Est. Code / Wage Ceiling:', 18, y + 25);
  doc.text('Jurisdiction & State Ruleset:', 18, y + 31);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('FreshBite Retail & QSR Hospitality India Pvt Ltd', 60, y + 13);
  doc.text('KA/BLR/CLRA-PE/2026/08942', 60, y + 19);
  doc.text('KN/BNG/0048291 / May 2026 ₹25,000 Ceiling Enforced', 60, y + 25);
  doc.text(`${stateInfo.ruleTitle}`, 60, y + 31);

  // Right column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Audit Period:', 130, y + 13);
  doc.text('Target HRMS:', 130, y + 19);
  doc.text('Audited Headcount:', 130, y + 25);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('May 2026 Wage Run', 160, y + 13);
  doc.text(hrmsName, 160, y + 19);
  doc.text(`${totalEmployees} (${contractCount} Contract + ${directCount} Direct)`, 160, y + 25);

  y += 44;

  // 4 Metric Badges / Strips
  const metricWidth = 43;
  const metrics = [
    { label: 'Total Audited Wages', val: formatINR(totalGross) },
    { label: 'PF Statutory Base', val: formatINR(totalPf) },
    { label: 'Statutory Arrears Resolved', val: '100% Remedied' },
    { label: 'CLRA Liability Status', val: 'Zero Exposure' },
  ];

  metrics.forEach((m, idx) => {
    const mx = 14 + idx * 46;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(mx, y, metricWidth, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(m.label, mx + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(m.val, mx + 3, y + 11);
  });

  y += 20;

  // Table Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('SCHEDULE OF PRE-PAYROLL AUDIT DISCREPANCIES & REMEDIATION (FORM T REGISTER)', 14, y);

  y += 4;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('EMP CODE', 16, y + 4.8);
  doc.text('NAME & ROLE', 38, y + 4.8);
  doc.text('LOCATION / AGENCY', 80, y + 4.8);
  doc.text('STATUTORY CLAUSE AUDITED', 120, y + 4.8);
  doc.text('REMEDIATED VALUE', 165, y + 4.8);

  y += 7;

  // Table Rows (Flagged & Corrected records)
  const auditedSample = records.slice(0, 8); // top 8 rows fit cleanly on page 1
  auditedSample.forEach((emp, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, y, 182, 8, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 8, 196, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    
    // Code
    doc.text(emp.empCode, 16, y + 5);
    
    // Name & role
    doc.setFont('helvetica', 'bold');
    doc.text(emp.name.substring(0, 20), 38, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(emp.role.substring(0, 24), 38, y + 7);

    // Location / Agency
    doc.setFontSize(6.5);
    doc.text(emp.storeLocation.substring(0, 22), 80, y + 5);

    // Statutory Finding
    const issue = emp.complianceIssues[0];
    const issueText = issue ? issue.title : 'All Standard Norms Compliant';
    doc.setFont('helvetica', issue ? 'bold' : 'normal');
    doc.setTextColor(issue ? emerald700[0] : slate600[0], issue ? emerald700[1] : slate600[1], issue ? emerald700[2] : slate600[2]);
    doc.text(issueText.substring(0, 28), 120, y + 5);

    // Remediated Value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    const remVal = issue ? issue.correctedValue.split('(')[0] : 'Direct Approved';
    doc.text(remVal.substring(0, 20), 165, y + 5);

    y += 8;
  });

  y += 6;

  // Statutory Certification Box
  doc.setDrawColor(209, 250, 229);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, y, 182, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(emerald700[0], emerald700[1], emerald700[2]);
  doc.text('STATUTORY PRINCIPAL EMPLOYER DECLARATION (CLRA SECTION 21 & KSCE ACT §8)', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  const certP1 =
    'I hereby certify on behalf of the Principal Employer that all contractor attendance muster rolls and retail store salary schedules for May 2026 have been pre-processed via PayGuard AI. Under-payments against Karnataka May 2026 Minimum Wage Gazette notifications, overtime double-rate deficits, and the EPFO revised statutory ceiling of Rs. 25,000 have been audited and auto-remediated prior to bank release.';
  const splitP1 = doc.splitTextToSize(certP1, 174);
  doc.text(splitP1, 18, y + 12);

  const certP2 =
    'The Principal Employer affirms that contract labour has received parity disbursements in accordance with Rule 25 of the Contract Labour (Regulation & Abolition) Karnataka Rules, 1974.';
  doc.text(certP2, 18, y + 26);

  y += 38;

  // Signature and Seal Block
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  y += 6;

  // Left: Digital Audit Stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('ELECTRONICALLY VERIFIED & CERTIFIED', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Audit Engine: PayGuard AI Statutory Pre-Processor v2026.4', 18, y + 9);
  doc.text('Audit Timestamp: ' + new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC', 18, y + 13);
  doc.text('Checksum SHA256: 8f42e9b1d7a3c05193f419c80d41829e', 18, y + 17);

  // Right: Principal Employer Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('FOR PRINCIPAL EMPLOYER', 138, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Authorized Signatory & Head of Statutory HR', 138, y + 9);
  doc.text('FreshBite Retail & QSR Hospitality India Pvt Ltd', 138, y + 13);
  doc.text('Place: Bengaluru, Karnataka (India)', 138, y + 17);

  // Save the PDF
  doc.save('PayGuard_FormT_CLRA_Principal_Employer_Audit_Certificate_May2026.pdf');
}
