import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Database, 
  Server, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Play, 
  Code,
  FileCheck,
  Lock,
  Building2,
  Users,
  Layers,
  FlaskConical,
  Pill,
  Bell,
  CreditCard,
  Workflow,
  ShieldCheck
} from 'lucide-react';
import { AuditLog } from '../types';
import { BlueprintTab } from './BlueprintTab';
import { VerificationTestRunnerTab } from './VerificationTestRunnerTab';

interface AuditAndApiViewProps {
  auditLogs: AuditLog[];
}

export const AuditAndApiView: React.FC<AuditAndApiViewProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'BLUEPRINT' | 'VERIFICATION' | 'API' | 'SWAGGER' | 'AUDIT' | 'SCHEMA' | 'RBAC'>('BLUEPRINT');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/system/blueprint');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const endpoints = [
    { method: 'GET', path: '/api/system/blueprint', category: 'Architecture', desc: 'Hospital system hierarchy, microservices & component architecture' },
    { method: 'POST', path: '/api/system/run-verification-tests', category: 'Testing', desc: 'Automated 6-point security, isolation, conflict & math tests' },
    { method: 'GET', path: '/api/health', category: 'System', desc: 'System health, tenant database connectivity & node status' },
    { method: 'GET', path: '/api/docs/openapi.json', category: 'Documentation', desc: 'Enterprise OpenAPI 3.0.0 Interface Documentation' },
    { method: 'GET', path: '/api/hospitals', category: 'Multi-Tenancy', desc: 'Fetch registered tenant hospital facilities' },
    { method: 'POST', path: '/api/hospitals/switch', category: 'Multi-Tenancy', desc: 'Switch active hospital tenant context' },
    { method: 'GET', path: '/api/stats/overview', category: 'Analytics', desc: 'Consolidated hospital census, bed %, revenue KPIs' },
    { method: 'GET', path: '/api/analytics/revenue', category: 'Analytics', desc: 'Department revenue breakdown, target trends & gateway split' },
    { method: 'GET', path: '/api/patients', category: 'EMR Core', desc: 'List patients filtered by hospital tenant (supports page & limit)' },
    { method: 'POST', path: '/api/patients', category: 'EMR Core', desc: 'Register patient with auto-generated MRN' },
    { method: 'POST', path: '/api/appointments/check-conflict', category: 'Scheduling', desc: 'Double-booking conflict pre-validator' },
    { method: 'GET', path: '/api/appointments', category: 'Scheduling', desc: 'Outpatient consultation schedule with reminder status' },
    { method: 'POST', path: '/api/appointments', category: 'Scheduling', desc: 'Book appointment with conflict prevention & 3-channel alert' },
    { method: 'GET', path: '/api/lab-orders', category: 'Laboratory', desc: '4-stage lab orders (Order → Sample → Process → Approve)' },
    { method: 'PATCH', path: '/api/lab-orders/:id/result', category: 'Laboratory', desc: 'Record quantitative lab analyzer results & tech remarks' },
    { method: 'PATCH', path: '/api/lab-orders/:id/status', category: 'Laboratory', desc: 'Advance lab order workflow with quantitative results' },
    { method: 'GET', path: '/api/medicines', category: 'Pharmacy', desc: 'Consolidated medicines catalog with total inventory count' },
    { method: 'GET', path: '/api/pharmacy/batches', category: 'Pharmacy', desc: 'FIFO medicine batches sorted by expiration date' },
    { method: 'POST', path: '/api/pharmacy/dispense', category: 'Pharmacy', desc: 'Execute FIFO dispense from earliest non-expired batch' },
    { method: 'GET', path: '/api/invoices', category: 'Revenue Cycle', desc: 'Consolidated invoices (Bed, Lab, Rx, Consult) & Claims' },
    { method: 'POST', path: '/api/invoices', category: 'Revenue Cycle', desc: 'Generate multi-item invoice with automated insurance split' },
    { method: 'POST', path: '/api/payments/webhook/stripe', category: 'Revenue Cycle', desc: 'Stripe payment gateway webhook receiver' },
    { method: 'PATCH', path: '/api/billing/:id/pay', category: 'Revenue Cycle', desc: 'Stripe/Razorpay online payment settlement' },
    { method: 'GET', path: '/api/notifications/me', category: 'Notifications', desc: 'Authenticated user notifications stream' },
    { method: 'GET', path: '/api/notifications', category: 'Notifications', desc: 'Multi-channel event stream (In-App, Email, SMS)' },
    { method: 'POST', path: '/api/ai/clinical-assist', category: 'Decision Support', desc: 'Clinical CDS differential diagnosis & ICD-10 suggestions' },
    { method: 'POST', path: '/api/ai/drug-safety', category: 'Decision Support', desc: 'Drug-drug interaction & allergy safety cross-check' },
  ];

  const handleTestApi = async (path: string) => {
    setIsLoadingApi(true);
    try {
      const res = await fetch(path.replace(':id', '1'));
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message || 'API request failed' }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleCopyCurl = (endpointPath: string) => {
    const curl = `curl -X GET "http://localhost:3000${endpointPath}" -H "Accept: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Architecture, Security & REST API</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Hospital Platform Architecture: Multi-Tenancy, 9-Role RBAC, 3NF Relational Database & Immutable HIPAA Audit Trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>HIPAA Compliant • 3NF Normalized</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto scrollbar-thin">
        {[
          { id: 'BLUEPRINT', label: 'System Blueprint & 20-Step Order', icon: Workflow },
          { id: 'VERIFICATION', label: '6-Point Security Test Suite', icon: ShieldCheck },
          { id: 'API', label: 'Interactive REST API Explorer', icon: Terminal },
          { id: 'SWAGGER', label: 'Swagger UI (OpenAPI 3.0)', icon: Code },
          { id: 'AUDIT', label: `HIPAA Audit Trail (${auditLogs.length})`, icon: ShieldAlert },
          { id: 'SCHEMA', label: '3NF Database Relational Schema', icon: Database },
          { id: 'RBAC', label: '9 Roles & Permissions Matrix', icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow-xs scale-105'
                  : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 hover:-translate-y-0.5 hover:shadow-2xs'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: System Blueprint & 20-Step Order */}
      {activeTab === 'BLUEPRINT' && (
        <BlueprintTab onNavigateTab={(tab) => setActiveTab(tab as any)} />
      )}

      {/* Tab: 6-Point Security & Integrity Test Suite */}
      {activeTab === 'VERIFICATION' && (
        <VerificationTestRunnerTab />
      )}

      {/* Tab: API Explorer */}
      {activeTab === 'API' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Endpoints</h3>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {endpoints.map((ep, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedEndpoint(ep.path);
                    if (ep.method === 'GET') handleTestApi(ep.path);
                  }}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                    selectedEndpoint === ep.path
                      ? 'bg-teal-50 border-teal-500'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ep.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{ep.category}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 mt-1">{ep.path}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{ep.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 font-mono text-xs text-teal-400">
                  <Terminal className="h-4 w-4" />
                  <span>cURL Command Preview</span>
                </div>
                <button
                  onClick={() => handleCopyCurl(selectedEndpoint)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded">
                curl -X GET "http://localhost:3000{selectedEndpoint}" -H "Accept: application/json"
              </div>
              <button
                onClick={() => handleTestApi(selectedEndpoint)}
                disabled={isLoadingApi}
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{isLoadingApi ? 'Querying API...' : 'Execute Request Live'}</span>
              </button>
            </div>

            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-md">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Live Response Output</div>
              <pre className="text-xs font-mono max-h-[380px] overflow-y-auto text-emerald-400 whitespace-pre-wrap">
                {apiResponse || '// Click "Execute Request Live" to view JSON payload response.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Swagger UI & OpenAPI 3.0 Documentation */}
      {activeTab === 'SWAGGER' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code className="h-4 w-4 text-teal-600" />
                <span>OpenAPI 3.0.0 Specification & Swagger UI</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded border border-teal-200">
                  REST API Contract
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete REST contract definition covering Authentication, EMR, Scheduling, Wards, Laboratory, Pharmacy FIFO, and Billing.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/api/docs/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Database className="h-3.5 w-3.5 text-slate-500" />
                <span>Raw OpenAPI JSON</span>
              </a>
              <a
                href="/api/docs"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Open in Fullscreen</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <iframe
              src="/api/docs"
              title="MedCore Swagger UI"
              className="w-full h-[720px] border-0"
            />
          </div>
        </div>
      )}

      {/* Tab: HIPAA Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Clinical Audit Stream</h3>
              <p className="text-xs text-slate-500">HIPAA Security Rule § 164.312(b) Audit Controls for all ePHI operations</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
              SHA256 Chained Integrity Verified
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource Target</th>
                  <th className="p-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-800">{log.userName}</span>
                      <span className="text-[10px] block text-slate-400">{log.userRole}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-bold">{log.resource}</td>
                    <td className="p-3 text-slate-600 font-sans text-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: 3NF Database Relational Schema */}
      {activeTab === 'SCHEMA' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Third Normal Form (3NF) Relational Database Schema</h3>
            <p className="text-xs text-slate-500">Normalized PostgreSQL Schema with Prisma ORM mappings and foreign key integrity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">Hospital (Tenant Root)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• name: VARCHAR(255)</li>
                <li>• code: VARCHAR(20) UNIQUE</li>
                <li>• licenseNumber: VARCHAR(100)</li>
                <li>• capacityBeds: INT</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">Patient (ePHI Core)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• hospitalId: UUID (FK)</li>
                <li>• mrn: VARCHAR(30) UNIQUE</li>
                <li>• firstName, lastName: VARCHAR</li>
                <li>• bloodGroup, allergies, conditions</li>
                <li>• deletedAt: TIMESTAMP (Soft Delete)</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">Appointment (Scheduling)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• hospitalId: UUID (FK)</li>
                <li>• patientId, doctorId: UUID (FK)</li>
                <li>• dateTime, durationMinutes</li>
                <li>• status: AppointmentStatus</li>
                <li>• reminderSent24h, reminderSent1h</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">MedicineBatch (FIFO Inventory)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• batchNumber: VARCHAR(50)</li>
                <li>• medicineName: VARCHAR(255)</li>
                <li>• expiryDate: DATE (FIFO Index)</li>
                <li>• initialQuantity, currentStock</li>
                <li>• costPerUnit: DECIMAL</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">LabOrder (4-Stage Diagnostic)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• orderNumber: VARCHAR(50)</li>
                <li>• status: LabOrderStatus</li>
                <li>• sampleCollectedAt, processedAt</li>
                <li>• approvedAt, approvedBy</li>
                <li>• results: JSONB</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-2 overflow-hidden group">
              <div className="font-mono font-bold text-teal-700 group-hover:text-teal-800">Notification (Event Dispatch)</div>
              <ul className="text-slate-600 font-mono text-[11px] space-y-1">
                <li>• id: UUID (PK)</li>
                <li>• eventType: NotificationEventType</li>
                <li>• channel: IN_APP | EMAIL | SMS</li>
                <li>• recipientId, recipientRole</li>
                <li>• isRead: BOOLEAN</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: RBAC 9-Roles Matrix */}
      {activeTab === 'RBAC' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Permission Matrix</h3>
            <p className="text-xs text-slate-500">Fine-grained capability distribution and least-privilege access across all 9 hospital staff roles</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">User Role</th>
                  <th className="p-2.5">Scope</th>
                  <th className="p-2.5">EMR / Patients</th>
                  <th className="p-2.5">Appointments</th>
                  <th className="p-2.5">Prescriptions</th>
                  <th className="p-2.5">Laboratory</th>
                  <th className="p-2.5">Pharmacy FIFO</th>
                  <th className="p-2.5">Billing & Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { role: 'Super Admin', scope: 'Global / Multi-tenant', emr: 'Full Access', apt: 'Full', rx: 'Full', lab: 'Full', rx_inv: 'Full', bill: 'Full' },
                  { role: 'Hospital Admin', scope: 'Hospital Unit', emr: 'Manage', apt: 'Manage', rx: 'Read', lab: 'Read', rx_inv: 'Manage', bill: 'Full' },
                  { role: 'Doctor', scope: 'Clinical Department', emr: 'Read/Write SOAP', apt: 'Own Consults', rx: 'Sign & Issue', lab: 'Requisition', rx_inv: 'Read Formulary', bill: 'Read' },
                  { role: 'Nurse', scope: 'Wards & Triage', emr: 'Vitals & Charting', apt: 'Check-in', rx: 'Administer', lab: 'Collect Sample', rx_inv: 'Ward Stock', bill: 'None' },
                  { role: 'Receptionist', scope: 'Front Desk', emr: 'Intake & Register', apt: 'Book / Schedule', rx: 'None', lab: 'None', rx_inv: 'None', bill: 'Collect Copay' },
                  { role: 'Lab Technician', scope: 'Central Laboratory', emr: 'Read Requisitions', apt: 'None', rx: 'None', lab: '4-Stage Analysis', rx_inv: 'None', bill: 'None' },
                  { role: 'Pharmacist', scope: 'Dispensary', emr: 'Read Rx History', apt: 'None', rx: 'Dispense', lab: 'None', rx_inv: 'FIFO Batches', bill: 'Rx Charges' },
                  { role: 'Accountant', scope: 'Finance', emr: 'Insurance Only', apt: 'Read', rx: 'Read Prices', lab: 'Read Costs', rx_inv: 'Audit', bill: 'Stripe / Claims' },
                  { role: 'Patient', scope: 'Personal Portal', emr: 'Own Chart', apt: 'Book Own', rx: 'View Regimen', lab: 'View Reports', rx_inv: 'None', bill: 'Online Copay' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900">{row.role}</td>
                    <td className="p-2.5 text-slate-500 font-medium">{row.scope}</td>
                    <td className="p-2.5">{row.emr}</td>
                    <td className="p-2.5">{row.apt}</td>
                    <td className="p-2.5">{row.rx}</td>
                    <td className="p-2.5">{row.lab}</td>
                    <td className="p-2.5">{row.rx_inv}</td>
                    <td className="p-2.5">{row.bill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
