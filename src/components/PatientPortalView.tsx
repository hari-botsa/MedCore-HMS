import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  FlaskConical, 
  Pill, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Patient, Appointment, MedicalRecord, LabOrder, Prescription, Invoice } from '../types';

interface PatientPortalViewProps {
  patient: Patient;
  appointments: Appointment[];
  records: MedicalRecord[];
  labOrders: LabOrder[];
  prescriptions?: Prescription[];
  invoices: Invoice[];
  onBookAppointment?: (data: any) => Promise<void>;
  onPayInvoice: (invoiceId: string, gateway: string) => Promise<void>;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  appointments,
  records,
  labOrders,
  prescriptions = [],
  invoices,
  onBookAppointment,
  onPayInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPOINTMENTS' | 'LABS' | 'PRESCRIPTIONS' | 'BILLING'>('OVERVIEW');
  const [payingId, setPayingId] = useState<string | null>(null);

  const pendingInvoices = invoices.filter(i => i.status !== 'PAID');
  const totalPayable = pendingInvoices.reduce((sum, i) => sum + i.patientPayable, 0);

  const handlePay = async (invoiceId: string, gateway: string) => {
    try {
      setPayingId(invoiceId);
      await onPayInvoice(invoiceId, gateway);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Patient Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-teal-600/20">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{patient.firstName} {patient.lastName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                PATIENT PORTAL
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span>MRN: <strong className="font-mono text-slate-800">{patient.mrn}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-slate-800">{patient.bloodGroup}</strong></span>
              <span>•</span>
              <span>Insurance: <strong className="text-slate-800">{patient.insuranceProvider}</strong></span>
            </div>
          </div>
        </div>

        {totalPayable > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-700">Outstanding Copay / Bills</div>
              <div className="text-xl font-extrabold text-amber-900">${totalPayable.toLocaleString()}</div>
            </div>
            <button
              onClick={() => setActiveTab('BILLING')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 hover:shadow-sm text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Pay Now
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'My Health Overview' },
          { id: 'APPOINTMENTS', label: `Appointments (${appointments.length})` },
          { id: 'LABS', label: `Laboratory Results (${labOrders.length})` },
          { id: 'PRESCRIPTIONS', label: `My Prescriptions (${prescriptions.length})` },
          { id: 'BILLING', label: `Billing & Copay (${invoices.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-teal-700 hover:border-teal-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Allergies & Medical Flags</span>
            </h3>
            <div className="space-y-2">
              <div className="text-xs text-slate-500">Documented Drug Allergies:</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((al, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      {al}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No known allergies documented</span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">Chronic Health Conditions:</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.chronicConditions.map((ch, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span>Next Upcoming Consultation</span>
            </h3>
            {appointments.length > 0 ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">{appointments[0].reason}</div>
                <div className="text-slate-600">With {appointments[0].doctorName} ({appointments[0].department})</div>
                <div className="text-slate-500 font-mono">{new Date(appointments[0].dateTime).toLocaleString()} • {appointments[0].room}</div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">{appointments[0].status}</span>
                  <span className="text-[11px] text-slate-400">Reminders active (24h & 1h)</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">No upcoming appointments scheduled.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Appointments */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Appointment History & Schedules</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {appointments.map(apt => (
              <div key={apt.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{apt.reason}</div>
                  <div className="text-slate-500">Dr. {apt.doctorName} • {apt.department} • {apt.room}</div>
                  <div className="font-mono text-[11px] text-slate-400 mt-0.5">{new Date(apt.dateTime).toLocaleString()}</div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Laboratory Results */}
      {activeTab === 'LABS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Diagnostic & Pathology Reports</h3>
          <div className="space-y-3 text-xs">
            {labOrders.map(lo => (
              <div key={lo.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{lo.orderNumber}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{lo.testName}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    lo.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lo.status === 'APPROVED' ? 'Verified Report' : lo.status}
                  </span>
                </div>

                {lo.results && lo.results.length > 0 && (
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                        <tr>
                          <th className="p-2">Assay Parameter</th>
                          <th className="p-2">Result</th>
                          <th className="p-2">Reference Normal Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lo.results.map((r, i) => (
                          <tr key={i}>
                            <td className="p-2 font-medium">{r.parameter}</td>
                            <td className="p-2 font-mono font-bold text-slate-900">{r.resultValue || r.value} {r.unit}</td>
                            <td className="p-2 font-mono text-slate-500">{r.referenceRange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Prescriptions */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Active Prescriptions & Medication Regimen</h3>
          <div className="space-y-3 text-xs">
            {prescriptions.map(rx => (
              <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-slate-400 text-[10px]">{rx.id}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">{rx.status}</span>
                </div>

                <div className="space-y-2">
                  {rx.items.map((it, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{it.medicationName} ({it.dosage})</div>
                        <div className="text-slate-500 text-[11px]">{it.frequency} • {it.duration}</div>
                      </div>
                      <div className="font-mono font-bold text-teal-700">Qty: {it.quantityPrescribed}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500">
                  Prescribed by <strong>{rx.doctorName}</strong> • Digital Signature: {rx.digitalSignature}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Billing & Online Copay */}
      {activeTab === 'BILLING' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Hospital Billing & Online Payment</h3>
          <div className="space-y-3 text-xs">
            {invoices.map(inv => (
              <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-400 text-[11px]">{inv.invoiceNumber}</span>
                    <div className="font-bold text-slate-900 mt-0.5">Total: ${inv.totalAmount.toLocaleString()}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                  <div>Insurance Covered: <strong className="text-emerald-700">${inv.insuranceCoveredAmount}</strong></div>
                  <div>Coverage Rate: <strong>{inv.insuranceCoverageRate}%</strong></div>
                  <div>Patient Due: <strong className="text-slate-900 font-bold">${inv.patientPayable}</strong></div>
                </div>

                {inv.status !== 'PAID' && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handlePay(inv.id, 'STRIPE')}
                      disabled={payingId === inv.id}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{payingId === inv.id ? 'Processing...' : 'Pay with Stripe ($' + inv.patientPayable + ')'}</span>
                    </button>
                    <button
                      onClick={() => handlePay(inv.id, 'RAZORPAY')}
                      disabled={payingId === inv.id}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                    >
                      Pay with Razorpay
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
