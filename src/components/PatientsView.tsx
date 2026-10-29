import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  AlertCircle, 
  FileText, 
  Calendar, 
  BedDouble, 
  X, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Pill, 
  Heart, 
  Stethoscope,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Patient, MedicalRecord, Appointment, Invoice, Bed } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient: (patientId: string) => void;
  onRegisterPatient: (data: Partial<Patient>) => Promise<void>;
  onNavigate: (tab: any) => void;
  onAdmitPatient?: (patientId: string) => void;
  onStartConsultationForPatient?: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onRegisterPatient,
  onNavigate,
  onAdmitPatient,
  onStartConsultationForPatient,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New patient form state
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'FEMALE' as 'MALE' | 'FEMALE' | 'OTHER',
    bloodGroup: 'O+' as any,
    phone: '',
    email: '',
    address: '',
    emergencyName: '',
    emergencyRel: 'Spouse',
    emergencyPhone: '',
    allergies: '',
    chronicConditions: '',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: '',
    status: 'OUTPATIENT' as 'INPATIENT' | 'OUTPATIENT' | 'DISCHARGED' | 'EMERGENCY'
  });

  const filteredPatients = patients.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = 
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesBlood = bloodFilter === 'ALL' || p.bloodGroup === bloodFilter;

    return matchesSearch && matchesStatus && matchesBlood;
  });

  const activePatient = patients.find(p => p.id === selectedPatientId);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.dob) {
      setRegisterError('Please fill in required fields: First Name, Last Name, and Date of Birth');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegisterPatient({
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        dob: newPatient.dob,
        gender: newPatient.gender,
        bloodGroup: newPatient.bloodGroup,
        phone: newPatient.phone || '+1 (555) 000-0000',
        email: newPatient.email,
        address: newPatient.address,
        emergencyContact: {
          name: newPatient.emergencyName || 'None',
          relationship: newPatient.emergencyRel || 'N/A',
          phone: newPatient.emergencyPhone || 'N/A'
        },
        allergies: newPatient.allergies ? newPatient.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        chronicConditions: newPatient.chronicConditions ? newPatient.chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        insuranceProvider: newPatient.insuranceProvider || 'Self-Pay',
        policyNumber: newPatient.policyNumber || 'N/A',
        status: newPatient.status
      });
      setShowRegisterModal(false);
      // Reset form
      setNewPatient({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'FEMALE',
        bloodGroup: 'O+',
        phone: '',
        email: '',
        address: '',
        emergencyName: '',
        emergencyRel: 'Spouse',
        emergencyPhone: '',
        allergies: '',
        chronicConditions: '',
        insuranceProvider: 'Blue Cross Blue Shield',
        policyNumber: '',
        status: 'OUTPATIENT'
      });
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Electronic Medical Records (EMR) & Patient Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">Centralized patient database, medical histories, and active inpatient admissions</p>
        </div>

        <button
          id="btn-register-patient"
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, MRN (MC-2026-...), phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="INPATIENT">Inpatients Only</option>
              <option value="OUTPATIENT">Outpatients</option>
              <option value="EMERGENCY">Emergency Triage</option>
              <option value="DISCHARGED">Discharged</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Blood:</span>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">All Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table & Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Table */}
        <div className={`${activePatient ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Patient & MRN</th>
                  <th className="px-4 py-3">Demographics</th>
                  <th className="px-4 py-3">Clinical Flags</th>
                  <th className="px-4 py-3">Status / Ward</th>
                  <th className="px-4 py-3">Insurance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No patients match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map(p => {
                    const isSelected = p.id === selectedPatientId;
                    return (
                      <tr 
                        key={p.id}
                        onClick={() => onSelectPatient(p.id)}
                        className={`hover:bg-teal-50/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-50/70' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{p.firstName} {p.lastName}</div>
                          <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-1 py-0.5 rounded border border-teal-200">
                            {p.mrn}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>{p.gender} • {p.dob}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                            Blood: {p.bloodGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {p.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {p.allergies.map(a => (
                                <span key={a} className="px-1.5 py-0.2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-[10px] font-semibold">
                                  ⚠️ {a}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">NKDA (No known allergies)</span>
                          )}
                          {p.chronicConditions.length > 0 && (
                            <p className="text-[10px] text-slate-500 mt-1 truncate">
                              {p.chronicConditions.join(', ')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'INPATIENT' ? 'bg-blue-100 text-blue-800' :
                            p.status === 'EMERGENCY' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                            p.status === 'DISCHARGED' ? 'bg-slate-100 text-slate-600' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.status}
                          </span>
                          {p.assignedBed && (
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                              <BedDouble className="h-3 w-3 text-teal-600" />
                              {p.assignedBed} ({p.assignedWard?.replace('_', ' ')})
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 font-medium">{p.insuranceProvider}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.policyNumber}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPatient(p.id);
                            }}
                            className="p-1.5 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                            title="Open EMR Chart"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Selected Patient Chart Drawer */}
        {activePatient && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-md p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{activePatient.firstName} {activePatient.lastName}</h3>
                  <span className="font-mono text-xs text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-semibold">
                    {activePatient.mrn}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  DOB: {activePatient.dob} ({activePatient.gender}) • Blood Group: <strong className="text-slate-800">{activePatient.bloodGroup}</strong>
                </p>
              </div>
              <button
                onClick={() => onSelectPatient('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions for this Patient */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onStartConsultationForPatient && onStartConsultationForPatient(activePatient)}
                className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Consultation</span>
              </button>
              {activePatient.status !== 'INPATIENT' ? (
                <button
                  onClick={() => onAdmitPatient && onAdmitPatient(activePatient.id)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <BedDouble className="h-3.5 w-3.5 text-teal-600" />
                  <span>Admit to Bed</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('wards')}
                  className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-amber-200 transition-colors"
                >
                  <BedDouble className="h-3.5 w-3.5 text-amber-600" />
                  <span>Bed: {activePatient.assignedBed}</span>
                </button>
              )}
            </div>

            {/* Clinical Alert Flags */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Documented Allergies:</span>
                {activePatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {activePatient.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-rose-100 border border-rose-300 text-rose-800 rounded-md font-bold text-[11px]">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500">No known allergies (NKDA)</span>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Chronic Conditions:</span>
                {activePatient.chronicConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {activePatient.chronicConditions.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500">None reported</span>
                )}
              </div>
            </div>

            {/* Contact & Demographics */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{activePatient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{activePatient.email || 'No email on file'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{activePatient.address || 'Address not listed'}</span>
              </div>
            </div>

            {/* Emergency Contact & Insurance */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Emergency Contact & Insurance</span>
              </div>
              <div>Contact: <strong>{activePatient.emergencyContact.name}</strong> ({activePatient.emergencyContact.relationship}) - {activePatient.emergencyContact.phone}</div>
              <div>Insurer: <strong>{activePatient.insuranceProvider}</strong> (Pol: {activePatient.policyNumber})</div>
            </div>

          </div>
        )}

      </div>

      {/* Register Patient Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Patient Intake & EMR Registration</h2>
                <p className="text-xs text-slate-500">Assigns permanent Medical Record Number (MRN) to new hospital intake</p>
              </div>
              <button 
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisterError(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {registerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={e => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    placeholder="e.g. William"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={e => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    placeholder="e.g. Harris"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newPatient.dob}
                    onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biological Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={e => setNewPatient({ ...newPatient, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={e => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={e => setNewPatient({ ...newPatient, address: e.target.value })}
                  placeholder="Street, City, State, ZIP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-800 block">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newPatient.emergencyName}
                    onChange={e => setNewPatient({ ...newPatient, emergencyName: e.target.value })}
                    className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    value={newPatient.emergencyRel}
                    onChange={e => setNewPatient({ ...newPatient, emergencyRel: e.target.value })}
                    className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Emergency Phone"
                    value={newPatient.emergencyPhone}
                    onChange={e => setNewPatient({ ...newPatient, emergencyPhone: e.target.value })}
                    className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Known Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={newPatient.allergies}
                    onChange={e => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Latex, Peanuts"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chronic Conditions (comma separated)</label>
                  <input
                    type="text"
                    value={newPatient.chronicConditions}
                    onChange={e => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                    placeholder="e.g. Hypertension, Asthma"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    value={newPatient.insuranceProvider}
                    onChange={e => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                    placeholder="e.g. Aetna, Blue Cross"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Policy / Member ID</label>
                  <input
                    type="text"
                    value={newPatient.policyNumber}
                    onChange={e => setNewPatient({ ...newPatient, policyNumber: e.target.value })}
                    placeholder="e.g. POL-99210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Admission Status</label>
                  <select
                    value={newPatient.status}
                    onChange={e => setNewPatient({ ...newPatient, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="OUTPATIENT">Outpatient</option>
                    <option value="INPATIENT">Inpatient (Ward)</option>
                    <option value="EMERGENCY">Emergency Triage</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration & Issue MRN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
