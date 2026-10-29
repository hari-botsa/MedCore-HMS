import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Filter, 
  Search, 
  ChevronRight, 
  FileText, 
  ShieldCheck,
  User,
  ArrowRight,
  TestTube2
} from 'lucide-react';
import { LabOrder, LabOrderStatus, Patient, UserProfile } from '../types';

interface LaboratoryViewProps {
  orders?: LabOrder[];
  labOrders?: LabOrder[];
  patients: Patient[];
  currentUser?: UserProfile;
  onAdvanceStatus?: (id: string, updateData: { status: LabOrderStatus; results?: any[]; technicianNotes?: string; approvalRemarks?: string }) => Promise<void>;
  onUpdateStatus?: (id: string, status: LabOrderStatus, results?: any[]) => Promise<void>;
  onCreateOrder?: (data: Partial<LabOrder>) => Promise<void>;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  orders,
  labOrders,
  patients,
  currentUser,
  onAdvanceStatus,
  onUpdateStatus,
  onCreateOrder
}) => {
  const effectiveOrders = orders || labOrders || [];
  const effectiveUser = currentUser || {
    id: 'u-lab',
    hospitalId: 'hosp-1',
    name: 'Julian Hayes, MLS (ASCP)',
    email: 'julian.hayes@medcore.hospital',
    role: 'LAB_TECHNICIAN' as const,
    title: 'Senior Clinical Pathologist',
    department: 'Diagnostic Laboratory'
  };

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(effectiveOrders[0] || null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Order Form
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [testName, setTestName] = useState('Comprehensive Metabolic Panel (CMP)');
  const [testCategory, setTestCategory] = useState<'HEMATOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | 'IMMUNOLOGY' | 'CARDIOLOGY' | 'URINALYSIS'>('BIOCHEMISTRY');
  const [sampleType, setSampleType] = useState<'VENOUS_BLOOD' | 'SERUM' | 'PLASMA' | 'URINE' | 'SWAB' | 'CSF'>('VENOUS_BLOOD');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');

  // Technician input state
  const [techNotes, setTechNotes] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  const filteredOrders = effectiveOrders.filter(o => {
    const matchesFilter = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch = 
      o.testName.toLowerCase().includes(search.toLowerCase()) ||
      o.patientName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.patientMrn.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateOrder) {
      await onCreateOrder({
        patientId: newPatientId,
        testName,
        testCategory,
        sampleType,
        priority,
        doctorId: effectiveUser.id,
        doctorName: effectiveUser.name
      });
    }
    setShowNewModal(false);
  };

  const advanceOrder = async (id: string, updateData: { status: LabOrderStatus; results?: any[]; technicianNotes?: string; approvalRemarks?: string }) => {
    if (onAdvanceStatus) {
      await onAdvanceStatus(id, updateData);
    } else if (onUpdateStatus) {
      await onUpdateStatus(id, updateData.status, updateData.results);
    }
  };

  const getStatusBadge = (status: LabOrderStatus) => {
    switch (status) {
      case 'ORDERED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Stage 1: Ordered</span>;
      case 'SAMPLE_COLLECTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">Stage 2: Sample In Lab</span>;
      case 'PROCESSING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">Stage 3: Testing / Running</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800">Stage 4: Pending Sign-off</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">Verified & Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Rejected / Redraw</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header & Metric Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900">Laboratory & Diagnostic Testing Workflow</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4-Stage Laboratory Life Cycle: Doctor Order → Specimen Intake → Bench Analysis → Pathologist Approval
          </p>
        </div>

        <button
          id="new-lab-order-btn"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 hover:shadow-md hover:-translate-y-0.5 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Laboratory Requisition</span>
        </button>
      </div>

      {/* Stage Flow Indicator Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-3 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
          <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">1</div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700">Requisition</div>
            <div className="text-xs font-bold text-slate-900">{effectiveOrders.filter(o => o.status === 'ORDERED').length} Ordered</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-3 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
          <div className="h-8 w-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">2</div>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-700">Specimen</div>
            <div className="text-xs font-bold text-slate-900">{effectiveOrders.filter(o => o.status === 'SAMPLE_COLLECTED').length} Collected</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center gap-3 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
          <div className="h-8 w-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">3</div>
          <div>
            <div className="text-[10px] uppercase font-bold text-purple-700">Bench Analysis</div>
            <div className="text-xs font-bold text-slate-900">{effectiveOrders.filter(o => o.status === 'PROCESSING').length} In Analyzer</div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-3 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">4</div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-700">Approved</div>
            <div className="text-xs font-bold text-slate-900">{effectiveOrders.filter(o => o.status === 'APPROVED').length} Finalized</div>
          </div>
        </div>
      </div>

      {/* Main Content: Split Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Orders List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2 items-center justify-between">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders, MRN, test name..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="ALL">All Stages</option>
                <option value="ORDERED">1. Ordered</option>
                <option value="SAMPLE_COLLECTED">2. Sample In Lab</option>
                <option value="PROCESSING">3. Processing</option>
                <option value="PENDING_APPROVAL">4. Pending Sign-off</option>
                <option value="APPROVED">5. Approved & Final</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No laboratory orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/60 border-teal-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="mt-2 flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{order.testName}</h4>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                          <span>{order.patientName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-mono text-[11px]">{order.patientMrn}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        order.priority === 'STAT' ? 'bg-rose-100 text-rose-800' :
                        order.priority === 'URGENT' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.priority}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Ordered by {order.doctorName}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Order Detail & 4-Stage Action Desk */}
        <div className="lg:col-span-6">
          {selectedOrder ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{selectedOrder.orderNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">{selectedOrder.testCategory}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedOrder.testName}</h2>
                </div>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Patient & Sample Header */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
                  <span className="font-bold text-slate-800">{selectedOrder.patientName}</span>
                  <span className="text-slate-500 block font-mono text-[11px]">{selectedOrder.patientMrn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Specimen Spec</span>
                  <span className="font-bold text-slate-800">{selectedOrder.sampleType}</span>
                  <span className="text-slate-500 block text-[11px]">Requisition Priority: {selectedOrder.priority}</span>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">4-Stage Diagnostic Lifecycle</h3>
                
                <div className="space-y-2 text-xs">
                  {/* Stage 1 */}
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">1. Physician Requisition Placed</div>
                      <div className="text-[11px] text-slate-500">Ordered by {selectedOrder.doctorName} on {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                    selectedOrder.sampleCollectedAt ? 'border-slate-200 bg-slate-50' : 'border-blue-200 bg-blue-50/50'
                  }`}>
                    {selectedOrder.sampleCollectedAt ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">2. Specimen Collection & Barcode Tagging</div>
                      <div className="text-[11px] text-slate-500">
                        {selectedOrder.sampleCollectedAt 
                          ? `Collected by ${selectedOrder.collectedBy || 'Phlebotomist'} on ${new Date(selectedOrder.sampleCollectedAt).toLocaleString()}`
                          : 'Pending phlebotomy sample collection and accessioning barcode.'}
                      </div>
                    </div>
                    {selectedOrder.status === 'ORDERED' && (
                      <button
                        onClick={() => advanceOrder(selectedOrder.id, { status: 'SAMPLE_COLLECTED' })}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                      >
                        Confirm Sample Collected
                      </button>
                    )}
                  </div>

                  {/* Stage 3 */}
                  <div className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                    selectedOrder.processedAt ? 'border-slate-200 bg-slate-50' : 'border-purple-200 bg-purple-50/50'
                  }`}>
                    {selectedOrder.processedAt ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-purple-600 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">3. Diagnostic Analyzer Run</div>
                      <div className="text-[11px] text-slate-500">
                        {selectedOrder.processedAt 
                          ? `Analyzed by ${selectedOrder.processedBy} on ${new Date(selectedOrder.processedAt).toLocaleString()}`
                          : 'Pending automated bench analyzer run.'}
                      </div>
                    </div>
                    {selectedOrder.status === 'SAMPLE_COLLECTED' && (
                      <button
                        onClick={() => advanceOrder(selectedOrder.id, { status: 'PROCESSING' })}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs"
                      >
                        Load Into Analyzer
                      </button>
                    )}
                  </div>

                  {/* Stage 4: Results Entry & Signoff */}
                  <div className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                    selectedOrder.status === 'APPROVED' ? 'border-slate-200 bg-slate-50' : 'border-emerald-200 bg-emerald-50/50'
                  }`}>
                    {selectedOrder.status === 'APPROVED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">4. Pathologist Review & Formal Sign-off</div>
                      <div className="text-[11px] text-slate-500">
                        {selectedOrder.approvedAt 
                          ? `Digitally verified by ${selectedOrder.approvedBy} on ${new Date(selectedOrder.approvedAt).toLocaleString()}`
                          : 'Requires review of measured quantitative values against reference ranges.'}
                      </div>
                    </div>
                    {selectedOrder.status === 'PROCESSING' && (
                      <button
                        onClick={() => advanceOrder(selectedOrder.id, { 
                          status: 'PENDING_APPROVAL',
                          results: [
                            { parameter: 'Target Measured Assay', value: '14.2', unit: 'mg/dL', referenceRange: '10.0 - 16.5', isAbnormal: false, flag: 'NORMAL' as const, resultValue: '14.2' },
                            { parameter: 'Secondary Index', value: '98', unit: 'U/L', referenceRange: '45 - 115', isAbnormal: false, flag: 'NORMAL' as const, resultValue: '98' }
                          ]
                        })}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs"
                      >
                        Submit for Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Lab Results Table */}
              {selectedOrder.results && selectedOrder.results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">Quantitative Assay Parameters</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-[11px] text-slate-600 uppercase font-bold">
                        <tr>
                          <th className="p-2.5">Parameter</th>
                          <th className="p-2.5">Measured Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.results.map((r, idx) => {
                          const abnormal = r.flag !== 'NORMAL' || Boolean(r.isAbnormal);
                          const displayVal = r.resultValue || r.value || '';
                          return (
                            <tr key={idx} className={abnormal ? 'bg-rose-50/70' : 'bg-white'}>
                              <td className="p-2.5 font-medium text-slate-900">{r.parameter}</td>
                              <td className="p-2.5 font-mono font-bold text-slate-900">{displayVal} {r.unit}</td>
                              <td className="p-2.5 text-slate-500 font-mono text-[11px]">{r.referenceRange}</td>
                              <td className="p-2.5">
                                {abnormal ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">{r.flag || 'ABNORMAL'}</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">NORMAL</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pathologist Final Approval Button */}
              {selectedOrder.status === 'PENDING_APPROVAL' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="text-xs font-bold text-emerald-900">Pathologist Verification Required</div>
                  <p className="text-[11px] text-emerald-800">
                    Approving this order will lock the lab results, trigger automated In-App and Email notifications to the attending physician and patient, and update the medical record.
                  </p>
                  <button
                    onClick={() => advanceOrder(selectedOrder.id, { 
                      status: 'APPROVED',
                      approvalRemarks: 'Clinical findings consistent with patient history; verified and digitally signed.'
                    })}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Approve & Issue Final Laboratory Report</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
              Select a laboratory requisition on the left to review results or advance testing stages.
            </div>
          )}
        </div>

      </div>

      {/* Modal: New Requisition */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Laboratory Requisition</h3>
            
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient</label>
                <select
                  value={newPatientId}
                  onChange={e => setNewPatientId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (MRN: {p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="e.g. Troponin-I Quantitative, Lipid Panel, HbA1c"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={testCategory}
                    onChange={e => setTestCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="BIOCHEMISTRY">Biochemistry</option>
                    <option value="HEMATOLOGY">Hematology</option>
                    <option value="MICROBIOLOGY">Microbiology</option>
                    <option value="IMMUNOLOGY">Immunology</option>
                    <option value="PATHOLOGY">Pathology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specimen Type</label>
                  <input
                    type="text"
                    value={sampleType}
                    onChange={e => setSampleType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ROUTINE">Routine (24-48 Hours)</option>
                  <option value="URGENT">Urgent (4-6 Hours)</option>
                  <option value="STAT">STAT Emergency (&lt; 1 Hour)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700"
                >
                  Place Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
