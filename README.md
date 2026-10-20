# BharatPay Statutory Audit & Compliance Engine (FY 2026–27)

An enterprise-scale Indian Payroll Statutory Audit, Remediation & HRMS Export platform designed to audit **1,000 to 2,000+ employee records** with zero latency. Built with rulesets from the **India Four Labour Codes (2026)**, **[frappe/india-payroll](https://github.com/frappe/india-payroll)**, and **[chetanpayroll/India-Payroll](https://github.com/chetanpayroll/India-Payroll)**.

---

## Core Statutory & Compliance Engines

### 1. Code on Wages, 2019 — 50% Base Wage Floor & State Minimum Wages
- **Section 2(y) 50% Rule**: Automatically detects when excluded allowances (HRA, Conveyance, Special Allowance, Overtime, Commission) exceed 50% of Total Remuneration and adds the excess back into "Wages" for EPF, ESIC, Gratuity, and Bonus calculations.
- **State Minimum Wage Benchmarks**: Supports **Karnataka (May 2026 Draft Notification)**, **Maharashtra (Zone I Mumbai/Pune)**, **Tamil Nadu (Chennai)**, and **Delhi NCR** across Unskilled, Semi-Skilled, Skilled, and Highly Skilled categories.

### 2. EPFO & ESIC Social Security Engines
- **EPF Dual-Ceiling Audit**: Supports both the ₹15,000 statutory ceiling and the 2026 ₹25,000 draft ceiling, EPS 8.33% diversion cap (₹1,250/month), and **September 2026 Split-ECR** calculation (1–15 Sept @ ₹15,000 cap vs. 16–30 Sept @ ₹25,000 cap).
- **International Worker (IW) PF Mode**: Uncapped PF on full Basic + DA (`12%` EE, `8.33%` EPS uncapped, `3.67%` EPF difference).
- **ESIC Dual-Ceiling & Daily Wage Exemption**:
  - Standard ₹21,000 gross ceiling and **₹25,000 ceiling for Persons with Disabilities (PwD)**.
  - **Section 42 Low-Wage Exemption**: Employees earning an average daily wage up to **₹176/day** are exempt from the `0.75%` employee contribution while the employer continues to pay `3.25%`.

### 3. Statutory Bonus & Gratuity Engines (`chetanpayroll/India-Payroll`)
- **Payment of Bonus Act, 1965 (`BonusCalculator`)**:
  - Eligibility check (`Basic + DA ≤ ₹21,000/month` and `≥ 30` working days).
  - Applies the **₹7,000/month calculation ceiling** prorated by days worked (`daysWorked / 26`), enforcing the statutory minimum (`8.33%` or ₹100 floor) and maximum (`20%`).
- **Payment of Gratuity Act, 1972 & Social Security Code (`GratuityCalculator`)**:
  - Monthly accrual (`4.81%` of Code Wages) and exact lump-sum formula (`(Basic + DA) × 15 / 26 × completed years`, rounding `> 6` months up after 5 years or 1 year for Fixed-Term Employees), capped at **₹20,00,000** tax-exempt ceiling.

### 4. Multi-State Professional Tax (PT) & Labour Welfare Fund (LWF) (`frappe/india-payroll`)
- **Professional Tax (PT)**: Gender- and month-aware slabs including Maharashtra's ₹10,000 women's exemption & ₹300 February slab, Karnataka's ₹25,000 threshold (₹300 Feb), and Tamil Nadu's half-yearly slab equalized at ₹208/month.
- **Labour Welfare Fund (LWF)**: Cycle-aware deductions for Maharashtra (Jun/Dec: ₹25 EE / ₹75 ER), Karnataka (Dec: ₹20 EE / ₹40 ER), Delhi (Jun/Dec: ₹0.75 EE / ₹2.25 ER), and Tamil Nadu.

### 5. Income-tax Act, 2025 (Effective 1 April 2026)
- **New Tax Regime (Default)**: ₹4,00,000 basic exemption, **₹75,000 Standard Deduction**, **Section 87A Rebate up to ₹12,00,000 taxable income** (₹12.75L salaried gross) with marginal relief, and 4% Health & Education Cess.
- **Old Tax Regime**: Age-stratified slabs for Normal (`<60 yrs`: ₹2.5L), Senior Citizen (`60–79 yrs`: ₹3L), and Super Senior Citizen (`80+ yrs`: ₹5L) with ₹50,000 Standard Deduction and Section 87A rebate up to ₹5,00,000.

### 6. Banking, Identity & UIDAI Verhoeff KYC (`IndiaValidator`)
- **Aadhaar UIDAI Verhoeff Checksum**: Validates 12-digit Aadhaar numbers using the dihedral group $D_5$ multiplication and permutation tables.
- **PAN Entity Status**: Validates 10-character PAN format and 4th-character taxpayer status (`P` Individual, `C` Company, `H` HUF, `F` Firm, etc.).
- **NPCI / RBI Merged Bank IFSC Blocker**: Flags obsolete IFSC prefixes from merged PSU banks (`SYNB`, `ALLB`, `CORP`, `AND B`, `ORBC`, `UTBI`, `VIJB`, `DENA`) to prevent NEFT/NACH salary disbursement failures.

---

## Export Formats
- **HRMS Bulk Import CSVs**: Keka, greytHR, Darwinbox, and RazorpayX Payroll.
- **EPFO Unified Portal ECR (`#~#` Text File)**: Direct 11-field `#~#` delimited text file ready for EPFO employer portal upload.
- **EPFO September 2026 Split-Challan CSV**: Dual-period ECR breakdown for the September 2026 ceiling transition.
- **CA-Ready PDF Statutory Audit Certificate**: Printable compliance summary with violation ledger and financial liability delta.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build
```
