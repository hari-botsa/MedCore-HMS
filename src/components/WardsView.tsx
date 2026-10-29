import React, { useState } from 'react';
import { 
  BedDouble, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  UserPlus, 
  LogOut, 
  Clock, 
  X, 
  ShieldCheck, 
  RefreshCw,
  Building,
  Activity
} from 'lucide-react';
import { Bed, Patient, Doctor } from '../types';

interface WardsViewProps {
  beds: Bed[];
  patients: Patient[];
  doctors: Doctor[];
  onAdmitPatient: (data: { bedId: string; patientId: string; attendingDoctor?: string }) => Promise<void>;
  onDischargeBed: (bedId: string) => Promise<void>;
  onSelectPatient: (patientId: string) => void;
}

export const WardsView: React.FC<WardsViewProps> = ({
  beds,
  patients,
  doctors,
  onAdmitPatient,
  onDischargeBed,
  onSelectPatient,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [targetBedId, setTargetBedId] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [attendingDoctor, setAttendingDoctor] = useState<string>(doctors[0]?.name || 'Dr. Evelyn Reed, MD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eligible patients for admission (outpatients or emergency patients not currently assigned to a bed)
  const unadmittedPatients = patients.filter(p => p.status !== 'INPATIENT' || !p.assignedBed);

  const wardTabs = [
    { id: 'ALL', label: 'All Hospital Wings' },
    { id: 'ICU', label: 'Intensive Care Unit (ICU)' },
    { id: 'CARDIAC_CARE', label: 'Cardiac Care (CCU)' },
    { id: 'GENERAL_WARD_A', label: 'General Ward A' },
    { id: 'GENERAL_WARD_B', label: 'General Ward B' },
    { id: 'EMERGENCY', label: 'Emergency Bays' },
    { id: 'SURGICAL_RECOVERY', label: 'Surgical Recovery' },
    { id: 'PEDIATRICS', label: 'Pediatrics Wing' }
  ];

  const filteredBeds = selectedWard === 'ALL' 
    ? beds 
    : beds.filter(b => b.ward === selectedWard);

  const occupiedCount = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableCount = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaningCount = beds.filter(b => b.status === 'CLEANING').length;

  const handleOpenAdmitModal = (bedId?: string) => {
    if (bedId) setTargetBedId(bedId);
    else {
      const firstAvail = beds.find(b => b.status === 'AVAILABLE');
      if (firstAvail) setTargetBedId(firstAvail.id);
    }
    if (unadmittedPatients[0]) setSelectedPatientId(unadmittedPatients[0].id);
    setShowAdmitModal(true);
  };

  const [admitError, setAdmitError] = useState<string | null>(null);
  const [wardNotice, setWardNotice] = useState<string | null>(null);

  const handleAdmitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdmitError(null);
    if (!targetBedId || !selectedPatientId) {
      setAdmitError('Please select an available bed and a patient.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdmitPatient({
        bedId: targetBedId,
        patientId: selectedPatientId,
        attendingDoctor
      });
      setShowAdmitModal(false);
      setWardNotice('Patient admitted to bed successfully.');
      setTimeout(() => setWardNotice(null), 3500);
    } catch (err: any) {
      setAdmitError(err.message || 'Admission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDischarge = async (bedId: string) => {
    try {
      await onDischargeBed(bedId);
      setWardNotice('Patient discharged. Bed transitioned to sanitization.');
      setTimeout(() => setWardNotice(null), 3500);
    } catch (err: any) {
      setWardNotice(err.message || 'Failed to discharge patient');
      setTimeout(() => setWardNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inpatient Bed Management & Ward Census</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time floorplan, clinical bed assignments, and sanitization tracking</p>
        </div>

        <button
          onClick={() => handleOpenAdmitModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 hover:shadow-md hover:-translate-y-0.5 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Admit Patient to Bed</span>
        </button>
      </div>

      {/* Ward Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
            <BedDouble className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Hospital Beds</div>
            <div className="text-lg font-black text-slate-900">{beds.length} Units</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Available Beds</div>
            <div className="text-lg font-black text-emerald-600">{availableCount} Ready</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Occupied Inpatient Beds</div>
            <div className="text-lg font-black text-teal-700">{occupiedCount} Inpatients</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Sanitizing / Cleaning</div>
            <div className="text-lg font-black text-amber-600">{cleaningCount} Units</div>
          </div>
        </div>
      </div>

      {/* Wing / Ward selector tabs */}
      <div className="flex flex-wrap gap-2">
        {wardTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedWard(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedWard === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          const isAvailable = bed.status === 'AVAILABLE';
          const isCleaning = bed.status === 'CLEANING';

          return (
            <div
              key={bed.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                isOccupied ? 'bg-white border-teal-200 shadow-xs ring-1 ring-teal-500/20' :
                isAvailable ? 'bg-white border-emerald-200 hover:border-emerald-400' :
                isCleaning ? 'bg-amber-50/50 border-amber-200' :
                'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">{bed.bedNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Fl {bed.floor}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isOccupied ? 'bg-teal-100 text-teal-800' :
                    isAvailable ? 'bg-emerald-100 text-emerald-800' :
                    isCleaning ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium mb-3">
                  Ward: <strong className="text-slate-700">{bed.ward.replace(/_/g, ' ')}</strong>
                </div>

                {isOccupied ? (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Admitted Patient:</span>
                      <button
                        onClick={() => bed.patientId && onSelectPatient(bed.patientId)}
                        className="font-bold text-slate-900 hover:text-teal-600 hover:underline text-left block"
                      >
                        {bed.patientName}
                      </button>
                      <span className="font-mono text-[10px] text-teal-700">{bed.patientMrn}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      Attending: <span className="font-medium text-slate-700">{bed.attendingDoctor}</span>
                    </div>

                    {bed.admittedAt && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Admitted {new Date(bed.admittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                ) : isAvailable ? (
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-center text-xs text-emerald-800">
                    <span className="font-semibold block">Bed Ready for Intake</span>
                    <span className="text-[10px] text-emerald-600">Sanitized & Telemetry Active</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-center text-xs text-amber-800">
                    <span className="font-semibold block">Sanitizing Protocol</span>
                    <span className="text-[10px] text-amber-600">Environmental services clearing room</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {isOccupied ? (
                  <button
                    onClick={() => handleDischarge(bed.id)}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Discharge / Transfer</span>
                  </button>
                ) : isAvailable ? (
                  <button
                    onClick={() => handleOpenAdmitModal(bed.id)}
                    className="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Admit Patient</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-1.5 px-3 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed"
                  >
                    In Cleaning Cycle
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Admit Patient Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Inpatient Bed Admission</h2>
                <p className="text-xs text-slate-500">Assign patient to ward bed & attending physician</p>
              </div>
              <button onClick={() => setShowAdmitModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {unadmittedPatients.length === 0 ? (
                    <option value="">No unadmitted patients found</option>
                  ) : (
                    unadmittedPatients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} (MRN: {p.mrn}) - {p.status}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Bed Target *</label>
                <select
                  required
                  value={targetBedId}
                  onChange={e => setTargetBedId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                >
                  {beds.filter(b => b.status === 'AVAILABLE').map(b => (
                    <option key={b.id} value={b.id}>
                      {b.bedNumber} — {b.ward.replace(/_/g, ' ')} (Floor {b.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Physician *</label>
                <select
                  required
                  value={attendingDoctor}
                  onChange={e => setAttendingDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !targetBedId || !selectedPatientId}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Admitting...' : 'Confirm Ward Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
