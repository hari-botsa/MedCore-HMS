import React, { useState } from 'react';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Printer, 
  X, 
  Trash2,
  Building,
  CreditCard as CardIcon,
  Smartphone,
  Layers
} from 'lucide-react';
import { Invoice, Patient, InvoiceItem } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  patients: Patient[];
  onCreateInvoice: (data: Partial<Invoice>) => Promise<void>;
  onPayInvoice: (id: string, method: string, gateway?: string) => Promise<void>;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  patients,
  onCreateInvoice,
  onPayInvoice,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingGateway, setPayingGateway] = useState<string | null>(null);

  // New Invoice form state
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [coverageRate, setCoverageRate] = useState<number>(80);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Physician Clinical Consultation', category: 'CONSULTATION', quantity: 1, unitPrice: 250, amount: 250 },
    { id: '2', description: 'Laboratory Comprehensive Metabolic Panel', category: 'LAB_TEST', quantity: 1, unitPrice: 180, amount: 180 },
    { id: '3', description: 'Pharmacy Dispensed Medication (Atorvastatin 20mg)', category: 'PHARMACY', quantity: 1, unitPrice: 65, amount: 65 },
    { id: '4', description: 'Inpatient Ward Accommodation (General Medical)', category: 'ROOM_BED', quantity: 2, unitPrice: 400, amount: 800 }
  ]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCat, setNewItemCat] = useState<any>('CONSULTATION');
  const [newItemAmount, setNewItemAmount] = useState<number>(120);

  const filteredInvoices = filterStatus === 'ALL'
    ? invoices
    : invoices.filter(i => i.status === filterStatus);

  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingClaims = invoices.filter(i => i.status === 'CLAIM_SUBMITTED').reduce((sum, i) => sum + i.insuranceCoveredAmount, 0);
  const patientReceivables = invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + i.patientPayable, 0);

  const handleAddItem = () => {
    if (!newItemDesc || !newItemAmount) return;
    setItems([
      ...items,
      {
        id: `it-${Date.now()}`,
        description: newItemDesc,
        category: newItemCat,
        quantity: 1,
        unitPrice: Number(newItemAmount),
        amount: Number(newItemAmount)
      }
    ]);
    setNewItemDesc('');
    setNewItemAmount(100);
  };

  const [modalError, setModalError] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!selectedPatientId || items.length === 0) {
      setModalError('Please select a patient and add at least one billable item.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateInvoice({
        patientId: selectedPatientId,
        items,
        insuranceCoverageRate: coverageRate,
        status: coverageRate > 0 ? 'CLAIM_SUBMITTED' : 'PENDING'
      });
      setShowCreateModal(false);
      setFeedbackNotice('Consolidated invoice generated successfully.');
      setTimeout(() => setFeedbackNotice(null), 3500);
    } catch (err: any) {
      setModalError(err.message || 'Failed to generate invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPayment = async (invId: string, method: string, gateway: string = 'STRIPE') => {
    try {
      setPayingGateway(gateway);
      await onPayInvoice(invId, method, gateway);
      if (selectedInvoice && selectedInvoice.id === invId) {
        setSelectedInvoice({
          ...selectedInvoice,
          status: 'PAID',
          paymentMethod: method as any,
          paymentGateway: gateway as any,
          paidAt: new Date().toISOString()
        });
      }
      setFeedbackNotice(`Payment settled via ${gateway}.`);
      setTimeout(() => setFeedbackNotice(null), 3500);
    } catch (err: any) {
      setFeedbackNotice(err.message || 'Payment failed');
      setTimeout(() => setFeedbackNotice(null), 4000);
    } finally {
      setPayingGateway(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Revenue Cycle & Consolidated Billing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Itemized inpatient and outpatient billing (Bed Stay + Diagnostics + Pharmacy + Clinician Fees) with TPA insurance adjudication
          </p>
        </div>

        <button
          id="btn-create-invoice"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 hover:shadow-md hover:-translate-y-0.5 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Consolidated Bill</span>
        </button>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Total Billed Gross</div>
            <div className="text-lg font-black text-slate-900 group-hover:text-teal-800 transition-colors">${totalBilled.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-emerald-700">Settled & Collected</div>
            <div className="text-lg font-black text-emerald-700">${totalPaid.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-blue-700">Pending Insurance Claims</div>
            <div className="text-lg font-black text-blue-800">${pendingClaims.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-amber-700">Patient Copay Due</div>
            <div className="text-lg font-black text-amber-900">${patientReceivables.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Master List & Detail Invoice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Invoice Master Table */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Invoices Ledger</span>
            <div className="flex gap-1.5 text-xs">
              {['ALL', 'PENDING', 'CLAIM_SUBMITTED', 'PAID'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    filterStatus === st ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredInvoices.map(inv => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700">{inv.invoiceNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'CLAIM_SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{inv.patientName}</div>
                      <div className="text-[11px] text-slate-500">{inv.insuranceProvider} • Due {inv.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 font-mono">${inv.totalAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-teal-700 font-bold">Copay: ${inv.patientPayable}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Invoice Detail & Payment Gateway */}
        <div className="lg:col-span-5">
          {selectedInvoice ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">{selectedInvoice.invoiceNumber}</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedInvoice.patientName}</h3>
                  <div className="text-xs text-slate-500">MRN: {selectedInvoice.patientMrn}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedInvoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Itemized breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">Consolidated Itemization</div>
                <div className="space-y-1.5 text-xs">
                  {selectedInvoice.items.map((it, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{it.description}</div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{it.category}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">${it.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Table */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Hospital Charges:</span>
                  <span className="font-mono">${selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Insurance Adjudication ({selectedInvoice.insuranceCoverageRate}%):</span>
                  <span className="font-mono">-${selectedInvoice.insuranceCoveredAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black pt-1.5 border-t border-slate-200 text-sm">
                  <span>Patient Due:</span>
                  <span className="font-mono text-teal-700">${selectedInvoice.patientPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Gateways (Stripe / Razorpay) */}
              {selectedInvoice.status !== 'PAID' ? (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block">Instant Payment Gateways:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleProcessPayment(selectedInvoice.id, 'CREDIT_CARD', 'STRIPE')}
                      disabled={Boolean(payingGateway)}
                      className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{payingGateway === 'STRIPE' ? 'Processing...' : 'Pay via Stripe'}</span>
                    </button>
                    <button
                      onClick={() => handleProcessPayment(selectedInvoice.id, 'NETBANKING', 'RAZORPAY')}
                      disabled={Boolean(payingGateway)}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>{payingGateway === 'RAZORPAY' ? 'Processing...' : 'Razorpay / UPI'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Settled via {selectedInvoice.paymentGateway || selectedInvoice.paymentMethod}</span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="p-1 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer"
                    title="Print Receipt"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Select an invoice on the left to review breakdown and payments.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Generate Consolidated Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Generate Consolidated Bill</h2>
                <p className="text-xs text-slate-500">Consultation + Lab Tests + Pharmacy + Ward Accommodation</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient *</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (MRN: {p.mrn}) — {p.insuranceProvider}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Insurance Adjudication Coverage Rate</label>
                <select
                  value={coverageRate}
                  onChange={e => setCoverageRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value={100}>100% Comprehensive Coverage (Tier 1)</option>
                  <option value={80}>80% Standard Inpatient (20% Patient Copay)</option>
                  <option value={70}>70% Out-of-Network (30% Patient Copay)</option>
                  <option value={0}>0% Self-Pay / Uninsured</option>
                </select>
              </div>

              {/* Line Items */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Billable Line Items:</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2 pr-1">
                  {items.map((it, idx) => (
                    <div key={it.id || idx} className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800">{it.description}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{it.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">${it.amount}</span>
                        <button
                          type="button"
                          onClick={() => setItems(items.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 font-bold"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Description (e.g. ICU Night Fee)"
                    value={newItemDesc}
                    onChange={e => setNewItemDesc(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={newItemAmount}
                    onChange={e => setNewItemAmount(Number(e.target.value))}
                    className="w-24 px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded font-bold"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Generating Bill...' : 'Create Consolidated Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
