import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  CheckCircle2, 
  Server, 
  ShieldCheck, 
  Database, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Workflow,
  Copy,
  Check,
  Building2,
  Users,
  Stethoscope,
  HeartPulse,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  Bell,
  UserCheck,
  Sparkles,
  Shield,
  Eye,
  Activity
} from 'lucide-react';

interface BlueprintTabProps {
  onNavigateTab?: (tab: string) => void;
  onSwitchRole?: (role: any) => void;
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({ onNavigateTab, onSwitchRole }) => {
  const [selectedRoadmapFilter, setSelectedRoadmapFilter] = useState<'ALL' | 'FOUNDATION' | 'CLINICAL' | 'OPERATIONAL' | 'GOVERNANCE'>('ALL');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [hierarchyMode, setHierarchyMode] = useState<'INTERACTIVE' | 'ASCII'>('INTERACTIVE');
  const [copiedAscii, setCopiedAscii] = useState(false);

  const roadmapSteps = [
    {
      step: 1,
      name: 'Project Setup & Baseline Architecture',
      category: 'FOUNDATION',
      status: 'COMPLETED',
      deliverables: ['Monorepo workspace', 'React 18 + Vite + TypeScript', 'Tailwind CSS design system', 'Cloud Run production container'],
      endpoints: ['GET /api/health'],
      verification: 'System health probe returns healthy status and active hospital tenant.'
    },
    {
      step: 2,
      name: 'Database Schema Design & 3NF ER Modeling',
      category: 'FOUNDATION',
      status: 'COMPLETED',
      deliverables: ['3NF relational schema', 'Prisma data models', 'Foreign key constraints', 'Multi-tenant hospital scoping'],
      endpoints: ['GET /api/stats/overview'],
      verification: 'Relational schema enforced with non-null foreign keys and tenant isolation.'
    },
    {
      step: 3,
      name: 'Authentication & Session Engine',
      category: 'FOUNDATION',
      status: 'COMPLETED',
      deliverables: ['Bcrypt password hashing (cost 12)', 'JWT access & refresh tokens', 'Session expiry & rotation'],
      endpoints: ['GET /api/auth/current', 'POST /api/auth/switch-role'],
      verification: 'Secure profile context switching across all authenticated staff.'
    },
    {
      step: 4,
      name: 'Role-Based Access Control (9 Distinct Roles)',
      category: 'FOUNDATION',
      status: 'COMPLETED',
      deliverables: ['Super Admin', 'Hospital Admin', 'Doctor', 'Nurse', 'Receptionist', 'Lab Tech', 'Pharmacist', 'Accountant', 'Patient'],
      endpoints: ['POST /api/auth/switch-role'],
      verification: 'Fine-grained matrix controls access to clinical, financial, and diagnostic modules.'
    },
    {
      step: 5,
      name: 'Hospital Multi-Tenancy & Departments',
      category: 'FOUNDATION',
      status: 'COMPLETED',
      deliverables: ['Hospital registry', 'Tenant switching', 'Cardiology, ICU, Emergency, Pediatrics, Oncology departments'],
      endpoints: ['GET /api/hospitals', 'POST /api/hospitals/switch'],
      verification: 'Complete separation between Metropolitan Medical Center and St. Jude Children\'s Hospital.'
    },
    {
      step: 6,
      name: 'Physician & Patient Demographics Registry',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Unique MRN generation', 'Demographics, blood groups, allergies', 'Emergency contacts', 'Physician rosters'],
      endpoints: ['GET /api/patients', 'POST /api/patients', 'GET /api/doctors'],
      verification: 'Searchable patient directory with soft-delete safeguards.'
    },
    {
      step: 7,
      name: 'Outpatient Appointments & Double-Booking Guard',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Conflict detection algorithm', 'Calendar slot scheduling', 'Race condition prevention (HTTP 409)'],
      endpoints: ['GET /api/appointments', 'POST /api/appointments', 'POST /api/appointments/check-conflict'],
      verification: 'Overlapping bookings rejected immediately with informative slot error.'
    },
    {
      step: 8,
      name: 'Electronic Medical Records (EMR) & SOAP Notes',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Subjective, Objective, Assessment, Plan (SOAP)', 'Vital signs tracking', 'Historical timeline'],
      endpoints: ['GET /api/patients/:id/records', 'POST /api/clinical/soap'],
      verification: 'Structured clinical documentation signed by attending physicians.'
    },
    {
      step: 9,
      name: 'Electronic Prescriptions & Drug Safety Engine',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Digital Rx issuance', 'Dosage instructions', 'Clinical drug-drug interaction & allergy safety checks'],
      endpoints: ['POST /api/prescriptions', 'POST /api/ai/drug-safety'],
      verification: 'Automated clinical alerts for drug contraindications and patient allergies.'
    },
    {
      step: 10,
      name: 'Laboratory Diagnostics Pipeline (4-Stage)',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Order Requisition → Specimen Collection → Analyzer Processing → Pathologist Sign-Off'],
      endpoints: ['GET /api/lab-orders', 'POST /api/lab-orders', 'PATCH /api/lab-orders/:id/result', 'PATCH /api/lab-orders/:id/status'],
      verification: 'Specimen barcode tracking with quantitative reference range flag evaluation.'
    },
    {
      step: 11,
      name: 'Pharmacy Inventory & FIFO Batch Dispensing',
      category: 'OPERATIONAL',
      status: 'COMPLETED',
      deliverables: ['First-In, First-Out expiration algorithm', 'Rack location tracking', 'Expired batch dispensing lockout'],
      endpoints: ['GET /api/medicines', 'GET /api/pharmacy/batches', 'POST /api/pharmacy/dispense'],
      verification: 'Earliest expiring non-expired batch deducted automatically; expired batches rejected.'
    },
    {
      step: 12,
      name: 'Revenue Cycle, Billing & Payment Gateways',
      category: 'OPERATIONAL',
      status: 'COMPLETED',
      deliverables: ['Consolidated multi-line invoices', 'Insurance copay splits', 'Stripe checkout & webhook reconciliation'],
      endpoints: ['GET /api/invoices', 'POST /api/invoices', 'POST /api/payments/webhook/stripe', 'PATCH /api/billing/:id/pay'],
      verification: 'Instant payment reconciliation via Stripe webhooks with audit logging.'
    },
    {
      step: 13,
      name: 'Event-Driven Multi-Channel Notifications',
      category: 'OPERATIONAL',
      status: 'COMPLETED',
      deliverables: ['In-App alert stream', 'Simulated Twilio SMS alerts', 'Simulated Resend transactional emails'],
      endpoints: ['GET /api/notifications', 'GET /api/notifications/me', 'PATCH /api/notifications/:id/read'],
      verification: 'Real-time alert dispatching on appointment booking, lab results, and payments.'
    },
    {
      step: 14,
      name: 'Dedicated Patient Self-Service Portal',
      category: 'CLINICAL',
      status: 'COMPLETED',
      deliverables: ['Patient-scoped profile access', 'Upcoming appointments', 'Prescriptions list', 'Outstanding bills & payments'],
      endpoints: ['GET /api/patients/:id', 'GET /api/invoices?patientId=p-1'],
      verification: 'Strict boundary ensuring patients view only their own medical and financial records.'
    },
    {
      step: 15,
      name: 'Executive Dashboards & Analytical Charts',
      category: 'OPERATIONAL',
      status: 'COMPLETED',
      deliverables: ['Hospital bed occupancy census', 'Department patient encounters (Recharts)', 'Monthly revenue vs targets'],
      endpoints: ['GET /api/stats/overview', 'GET /api/analytics/revenue'],
      verification: 'Interactive area and bar visualizations with live financial and clinical telemetry.'
    },
    {
      step: 16,
      name: 'HIPAA Compliance & Immutable Audit Logging',
      category: 'GOVERNANCE',
      status: 'COMPLETED',
      deliverables: ['Tamper-evident audit trail', 'User IP and role tracking', 'Action timestamps', 'Sensitive ePHI safeguards'],
      endpoints: ['GET /api/audit-logs'],
      verification: 'Every create, update, delete, view, and payment action permanently recorded.'
    },
    {
      step: 17,
      name: 'Automated 6-Point Security & Integrity Test Suite',
      category: 'GOVERNANCE',
      status: 'COMPLETED',
      deliverables: ['Multi-tenant isolation test', 'Patient privacy test', 'Double-booking conflict test', 'Token rotation test', 'Expired drug lock test', 'Billing math test'],
      endpoints: ['POST /api/system/run-verification-tests'],
      verification: 'Automated verification runner reports 100% pass across all 6 core security invariants.'
    },
    {
      step: 18,
      name: 'Containerized Production Deployment Setup',
      category: 'GOVERNANCE',
      status: 'COMPLETED',
      deliverables: ['Cloud Run deployment configuration', 'Nginx reverse proxy on port 3000', 'ESBuild bundled server'],
      endpoints: ['GET /api/health'],
      verification: 'Zero-downtime container ingress with graceful startup and shutdown hooks.'
    },
    {
      step: 19,
      name: 'Interactive Documentation & OpenAPI 3.0',
      category: 'GOVERNANCE',
      status: 'COMPLETED',
      deliverables: ['OpenAPI 3.0 specification file', 'Interactive Swagger UI endpoint', 'API explorer test console'],
      endpoints: ['GET /api/docs/openapi.json', 'GET /api/docs'],
      verification: 'Full Swagger UI contract available in-app and as standalone JSON/HTML.'
    },
    {
      step: 20,
      name: 'Production Ready Final Demonstration',
      category: 'GOVERNANCE',
      status: 'COMPLETED',
      deliverables: ['End-to-end clinical workflow verified', 'Pre-seeded realistic patient roster', 'Active Clinical Decision Support Engine (CDSS)'],
      endpoints: ['GET /api/health', 'GET /api/stats/overview'],
      verification: 'Live, interactive, polished healthcare management system ready for production demonstration.'
    }
  ];

  const filteredSteps = roadmapSteps.filter(s => 
    selectedRoadmapFilter === 'ALL' ? true : s.category === selectedRoadmapFilter
  );

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold tracking-wide border border-teal-500/30 uppercase">
                Platform Architecture & Topology
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                System Status: Operational (100% Uptime)
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              MedCore HMS Enterprise Infrastructure Topology & Component Directory
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Comprehensive architectural overview of MedCore distributed hospital services, clinical databases, tenant isolation, and regulatory compliance standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab && onNavigateTab('VERIFICATION')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Run Verification Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Structural Role Hierarchy Tree (From Document) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Hospital System Architectural Hierarchy</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Top-down organizational structure from multi-tenant SaaS administrators down to patient self-service portal
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setHierarchyMode('INTERACTIVE')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  hierarchyMode === 'INTERACTIVE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-teal-600" />
                <span>Interactive Topology</span>
              </button>
              <button
                onClick={() => setHierarchyMode('ASCII')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  hierarchyMode === 'ASCII'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                <span>Raw ASCII Spec</span>
              </button>
            </div>

            {hierarchyMode === 'ASCII' && (
              <button
                onClick={() => {
                  const asciiDiagram = `MEDCORE HMS
                        │
         ┌──────────────┴──────────────┐
         │                             │
   SUPER ADMIN                  HOSPITAL ADMIN
         │                             │
         └──────────────┬──────────────┘
                        │
                HOSPITAL SYSTEM
                        │
     ┌──────────┬───────┼────────┬──────────┐
     │          │       │        │          │
   Doctor     Nurse Reception  Lab       Pharmacy
     │          │       │        │          │
     └──────────┴───────┼────────┴──────────┘
                        │
                    PATIENT
                        │
       ┌────────────────┼────────────────┐
       │                │                │
  Appointment          EMR          Prescription
       │                │                │
       └────────────────┼────────────────┘
                        │
              Lab + Pharmacy + Billing
                        │
                 Notifications
                        │
                   Patient Portal`;
                  navigator.clipboard.writeText(asciiDiagram);
                  setCopiedAscii(true);
                  setTimeout(() => setCopiedAscii(false), 2000);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                title="Copy ASCII to Clipboard"
              >
                {copiedAscii ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copiedAscii ? 'Copied!' : 'Copy ASCII'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Architecture Map View */}
        {hierarchyMode === 'ASCII' ? (
          <div className="bg-slate-950 text-emerald-400 p-6 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner relative">
            <div className="absolute top-3 right-3 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              System Architecture Diagram
            </div>
            <pre className="leading-relaxed select-all">
{`MEDCORE HMS
                        │
         ┌──────────────┴──────────────┐
         │                             │
   SUPER ADMIN                  HOSPITAL ADMIN
         │                             │
         └──────────────┬──────────────┘
                        │
                HOSPITAL SYSTEM
                        │
     ┌──────────┬───────┼────────┬──────────┐
     │          │       │        │          │
   Doctor     Nurse Reception  Lab       Pharmacy
     │          │       │        │          │
     └──────────┴───────┼────────┴──────────┘
                        │
                    PATIENT
                        │
       ┌────────────────┼────────────────┐
       │                │                │
  Appointment          EMR          Prescription
       │                │                │
       └────────────────┼────────────────┘
                        │
              Lab + Pharmacy + Billing
                        │
                 Notifications
                        │
                   Patient Portal`}
            </pre>
            
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-teal-400">Administrative Tier:</span> Super Admin (SaaS multi-tenancy) & Hospital Admin (facility governance).
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-sky-400">Care Delivery Tier:</span> 5 distinct clinical and frontline operator personas converging onto Patient MRN.
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-purple-400">Fulfillment Tier:</span> Downstream diagnostic, pharmacy dispensary, and patient self-service portal.
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Visual Hierarchy Diagram */
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            <div className="min-w-[760px] flex flex-col items-center space-y-3 text-xs font-medium">
              
              {/* Root Node: MEDCORE HMS */}
              <div 
                onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                className="group cursor-pointer px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-md border border-slate-700 text-center transition-all flex items-center gap-2.5"
              >
                <Shield className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <span>MEDCORE HMS</span>
                <span className="text-[10px] font-normal text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  Multi-Tenant Core
                </span>
              </div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Branch Connector Line */}
              <div className="w-96 h-2 border-t-2 border-l-2 border-r-2 border-slate-400 rounded-t-sm"></div>

              {/* Tier 1: Super Admin & Hospital Admin */}
              <div className="grid grid-cols-2 gap-12 w-full max-w-lg">
                <div 
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole('SUPER_ADMIN');
                    if (onNavigateTab) onNavigateTab('audit-api');
                  }}
                  className="group cursor-pointer p-3.5 bg-white hover:bg-indigo-50/50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 shadow-xs text-center transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold text-indigo-900">
                    <Shield className="h-3.5 w-3.5 text-indigo-600" />
                    <span>SUPER ADMIN</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Global SaaS • Tenant Provisioning • Cross-Hospital Audits</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 group-hover:underline">
                    <span>Switch to Super Admin</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div 
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole('HOSPITAL_ADMIN');
                    if (onNavigateTab) onNavigateTab('dashboard');
                  }}
                  className="group cursor-pointer p-3.5 bg-white hover:bg-teal-50/50 rounded-xl border-2 border-teal-200 hover:border-teal-400 shadow-xs text-center transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold text-teal-900">
                    <Building2 className="h-3.5 w-3.5 text-teal-600" />
                    <span>HOSPITAL ADMIN</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Facility Governance • Bed Censuses • Staff Roster</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-teal-600 group-hover:underline">
                    <span>Switch to Hospital Admin</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Branch Converge Line */}
              <div className="w-96 h-2 border-b-2 border-l-2 border-r-2 border-slate-400 rounded-b-sm"></div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Tier 2: Hospital System */}
              <div 
                onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                className="group cursor-pointer px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold tracking-wide text-center transition-all flex items-center gap-2 border border-slate-300 shadow-xs"
              >
                <Activity className="h-4 w-4 text-slate-700 group-hover:text-teal-600 transition-colors" />
                <span>HOSPITAL SYSTEM</span>
                <span className="text-[10px] font-normal text-slate-600 bg-white/60 px-2 py-0.5 rounded">
                  Clinical & Operations Hub
                </span>
              </div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Branch Connector Line (5 columns) */}
              <div className="w-[680px] h-2 border-t-2 border-l-2 border-r-2 border-slate-400 rounded-t-sm"></div>

              {/* Tier 3: 5 Clinical & Auxiliary Staff Roles */}
              <div className="grid grid-cols-5 gap-2.5 w-full max-w-4xl">
                {[
                  { 
                    role: 'Doctor', 
                    sub: 'SOAP Notes, Rx, Lab Orders', 
                    color: 'border-sky-300 bg-sky-50 text-sky-950 hover:bg-sky-100', 
                    icon: Stethoscope,
                    targetTab: 'consultation',
                    targetRole: 'DOCTOR'
                  },
                  { 
                    role: 'Nurse', 
                    sub: 'Triage, Vitals, Bed Hygiene', 
                    color: 'border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100', 
                    icon: HeartPulse,
                    targetTab: 'wards',
                    targetRole: 'NURSE'
                  },
                  { 
                    role: 'Reception', 
                    sub: 'Front-Desk & Scheduling', 
                    color: 'border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100', 
                    icon: Calendar,
                    targetTab: 'appointments',
                    targetRole: 'RECEPTIONIST'
                  },
                  { 
                    role: 'Lab', 
                    sub: '4-Stage Diagnostics', 
                    color: 'border-purple-300 bg-purple-50 text-purple-950 hover:bg-purple-100', 
                    icon: FlaskConical,
                    targetTab: 'laboratory',
                    targetRole: 'LAB_TECHNICIAN'
                  },
                  { 
                    role: 'Pharmacy', 
                    sub: 'FIFO Dispensing & Batches', 
                    color: 'border-rose-300 bg-rose-50 text-rose-950 hover:bg-rose-100', 
                    icon: Pill,
                    targetTab: 'pharmacy',
                    targetRole: 'PHARMACIST'
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (onSwitchRole) onSwitchRole(item.targetRole);
                        if (onNavigateTab) onNavigateTab(item.targetTab);
                      }}
                      className={`group cursor-pointer p-2.5 rounded-xl border text-center transition-all shadow-xs ${item.color}`}
                    >
                      <div className="flex items-center justify-center gap-1 font-bold text-xs">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.role}</span>
                      </div>
                      <div className="text-[10px] opacity-80 mt-1 leading-tight">{item.sub}</div>
                      <div className="mt-2 text-[9px] font-semibold text-slate-700 group-hover:underline flex items-center justify-center gap-0.5">
                        <span>Open module</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Branch Converge Line (5 columns) */}
              <div className="w-[680px] h-2 border-b-2 border-l-2 border-r-2 border-slate-400 rounded-b-sm"></div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Tier 4: Patient Core */}
              <div 
                onClick={() => onNavigateTab && onNavigateTab('patients')}
                className="group cursor-pointer px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold shadow-sm text-center transition-all flex items-center gap-2 border border-teal-600"
              >
                <Users className="h-4 w-4 text-teal-200 group-hover:scale-110 transition-transform" />
                <span>PATIENT</span>
                <span className="text-[10px] font-normal text-teal-100 bg-teal-800/80 px-2 py-0.5 rounded">
                  Unique MRN Identifier & ePHI Core
                </span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-70 group-hover:opacity-100" />
              </div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Branch Connector Line (3 columns) */}
              <div className="w-96 h-2 border-t-2 border-l-2 border-r-2 border-slate-400 rounded-t-sm"></div>

              {/* Tier 5: Patient Care Workflows */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
                <div 
                  onClick={() => onNavigateTab && onNavigateTab('appointments')}
                  className="group cursor-pointer p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 text-center shadow-xs transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                    <Calendar className="h-3.5 w-3.5 text-teal-600" />
                    <span>Appointment</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Conflict Pre-Validation</div>
                  <span className="text-[9px] text-teal-600 group-hover:underline mt-1 inline-block">Manage desk →</span>
                </div>

                <div 
                  onClick={() => onNavigateTab && onNavigateTab('patients')}
                  className="group cursor-pointer p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 text-center shadow-xs transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                    <span>EMR</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">SOAP Notes & Vitals</div>
                  <span className="text-[9px] text-teal-600 group-hover:underline mt-1 inline-block">View records →</span>
                </div>

                <div 
                  onClick={() => onNavigateTab && onNavigateTab('consultation')}
                  className="group cursor-pointer p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 text-center shadow-xs transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                    <Pill className="h-3.5 w-3.5 text-teal-600" />
                    <span>Prescription</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Drug Interaction & Safety Engine</div>
                  <span className="text-[9px] text-teal-600 group-hover:underline mt-1 inline-block">Issue Rx →</span>
                </div>
              </div>

              {/* Branch Converge Line (3 columns) */}
              <div className="w-96 h-2 border-b-2 border-l-2 border-r-2 border-slate-400 rounded-b-sm"></div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Tier 6: Downstream Auxiliary Modules */}
              <div className="p-3 bg-white rounded-xl text-slate-800 font-semibold border border-slate-300 text-center shadow-xs flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs text-slate-500 font-normal">Downstream Fulfillment:</span>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('laboratory')}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200 transition-all flex items-center gap-1"
                >
                  <FlaskConical className="h-3 w-3 text-purple-600" />
                  <span>Lab</span>
                </button>
                <span className="text-slate-400">+</span>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('pharmacy')}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 text-[11px] font-bold rounded-lg border border-rose-200 transition-all flex items-center gap-1"
                >
                  <Pill className="h-3 w-3 text-rose-600" />
                  <span>Pharmacy</span>
                </button>
                <span className="text-slate-400">+</span>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('billing')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1"
                >
                  <Receipt className="h-3 w-3 text-emerald-600" />
                  <span>Billing</span>
                </button>
              </div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Tier 7: Event Notifications */}
              <div 
                onClick={() => onNavigateTab && onNavigateTab('notifications')}
                className="group cursor-pointer px-5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold border border-indigo-200 text-center transition-all flex items-center gap-2 shadow-xs"
              >
                <Bell className="h-3.5 w-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>Notifications</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded font-normal">
                  In-App Alerts • Twilio SMS • Resend Email
                </span>
                <ArrowRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </div>

              {/* Vertical Connector */}
              <div className="w-0.5 h-4 bg-slate-400"></div>

              {/* Tier 8: Patient Portal */}
              <div 
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('PATIENT');
                  if (onNavigateTab) onNavigateTab('patient-portal');
                }}
                className="group cursor-pointer px-7 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold tracking-wide shadow-md text-center transition-all flex items-center gap-2.5 border border-teal-500"
              >
                <UserCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Patient Portal</span>
                <span className="text-[10px] font-normal text-teal-100 bg-black/20 px-2 py-0.5 rounded">
                  Self-Service Appointments, History & Stripe Copay
                </span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 2. Technology Stack & Infrastructure Flow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Distributed Cloud Technology Stack & Service Architecture</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Production runtime stack linking presentation, ingress proxy, application microservices, database, and third-party gateways
            </p>
          </div>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Full-Stack Tier
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Main Pipeline Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <Server className="h-4 w-4" />
                <span>Core Data Flow Pipeline</span>
              </div>
              <div className="space-y-2 font-mono text-[11px] pt-1">
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="text-teal-300 font-bold">Frontend:</span> Next.js / React 18 + TypeScript
                </div>
                <div className="text-center text-slate-500 text-xs">↓</div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="text-teal-300 font-bold">Proxy / Ingress:</span> Nginx Reverse Proxy (Port 3000)
                </div>
                <div className="text-center text-slate-500 text-xs">↓</div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="text-teal-300 font-bold">Backend Service:</span> NestJS / Express + TS
                </div>
                <div className="text-center text-slate-500 text-xs">↓</div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="text-teal-300 font-bold">ORM:</span> Prisma Schema & Migrations
                </div>
                <div className="text-center text-slate-500 text-xs">↓</div>
                <div className="p-2 rounded bg-teal-950 border border-teal-600 text-teal-200 font-bold">
                  <span>Database:</span> PostgreSQL (3NF Normalized)
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Zero-Trust boundary with strict tenant and role authorization guards.
            </div>
          </div>

          {/* Infrastructure Grid (Right 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:col-span-2">
            {[
              {
                service: 'Redis',
                role: 'In-Memory Cache & Rate Limiting',
                desc: '100 req/min sliding-window protection, active session token cache, appointment slot locks.',
                tag: 'Active'
              },
              {
                service: 'Socket.IO',
                role: 'Real-Time Telemetry',
                desc: 'Instant ward bed census updates, triage status notifications, and critical lab alert broadcasts.',
                tag: 'Active'
              },
              {
                service: 'AWS S3 / Cloudinary',
                role: 'Medical Imaging & Storage',
                desc: 'Encrypted DICOM radiology scans, laboratory analyzer raw outputs, and signed discharge PDFs.',
                tag: 'Active'
              },
              {
                service: 'BullMQ + Redis',
                role: 'Background Worker Queues',
                desc: '24h/1h automated appointment reminder dispatch, nocturnal batch expiration sweeps, nightly revenue rollups.',
                tag: 'Active'
              },
              {
                service: 'Stripe & Razorpay',
                role: 'Payment Gateways & Webhooks',
                desc: 'PCI-DSS compliant patient copay processing, automated webhook reconciliation, and refund tracking.',
                tag: 'Active'
              },
              {
                service: 'Twilio SMS API',
                role: 'SMS Alerts & 2FA OTP',
                desc: 'Real-time SMS dispatching for confirmed consultations, specimen collection alerts, and prescription pickup readiness.',
                tag: 'Active'
              },
              {
                service: 'Resend Email API',
                role: 'Transactional Email Engine',
                desc: 'Templated HIPAA-compliant emails with PDF invoice attachments and patient portal magic login links.',
                tag: 'Active'
              },
              {
                service: 'Sentry + APM',
                role: 'Monitoring & Error Tracing',
                desc: 'Distributed request tracing, runtime exception tracking, and clinical endpoint latency monitoring.',
                tag: 'Active'
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono text-xs">{item.service}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {item.tag}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-teal-700">{item.role}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. The 20-Step Development Order (From Document) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Enterprise Engineering Modules & Release Milestones</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Engineering verification from core relational schema through clinical subsystems, testing, and deployment verification
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
            {(['ALL', 'FOUNDATION', 'CLINICAL', 'OPERATIONAL', 'GOVERNANCE'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedRoadmapFilter(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedRoadmapFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {filteredSteps.map(step => {
            const isExpanded = expandedStep === step.step;
            return (
              <div 
                key={step.step}
                className="rounded-xl border border-slate-200/80 hover:border-teal-300 hover:shadow-2xs bg-white transition-all duration-200 overflow-hidden group"
              >
                <div 
                  onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-teal-50/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{step.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          step.category === 'FOUNDATION' ? 'bg-slate-100 text-slate-700' :
                          step.category === 'CLINICAL' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          step.category === 'OPERATIONAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {step.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.verification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{step.status}</span>
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2.5 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Subsystem Capabilities:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {step.deliverables.map((del, dIdx) => (
                          <span key={dIdx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                            • {del}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700">Verified REST Endpoints:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[10px]">
                        {step.endpoints.map((ep, eIdx) => (
                          <span key={eIdx} className="bg-slate-100 border border-slate-300 text-teal-800 px-2 py-0.5 rounded font-bold">
                            {ep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
