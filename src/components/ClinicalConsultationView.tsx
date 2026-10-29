import React, { useState } from 'react';
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Pill, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  User, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { Patient, MedicalRecord, VitalSigns, PrescriptionItem, Doctor } from '../types';
import { queryDrugSafety, queryClinicalAssist } from '../api';

interface ClinicalConsultationViewProps {
  patients: Patient[];
  doctors: Doctor[];
  selectedPatient?: Patient;
  onSaveRecord: (record: Partial<MedicalRecord>) => Promise<void>;
  medicalRecords: MedicalRecord[];
}

export const ClinicalConsultationView: React.FC<ClinicalConsultationViewProps> = ({
  patients,
  doctors,
  selectedPatient,
  onSaveRecord,
  medicalRecords,
}) => {
  const [activePatientId, setActivePatientId] = useState<string>(
    selectedPatient?.id || patients[0]?.id || ''
  );

  const patient = patients.find(p => p.id === activePatientId) || patients[0];

  // SOAP & Clinical fields
  const [chiefComplaint, setChiefComplaint] = useState('Substernal tightness and elevated blood pressure');
  const [hpi, setHpi] = useState('Patient notes discomfort ongoing for 48 hours, intermittent.');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosisList, setDiagnosisList] = useState<{ code: string; description: string }[]>([
    { code: 'I10', description: 'Essential (primary) hypertension' }
  ]);
  const [newDiagCode, setNewDiagCode] = useState('');
  const [newDiagDesc, setNewDiagDesc] = useState('');

  // Vitals
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressureSystolic: 148,
    bloodPressureDiastolic: 92,
    heartRate: 84,
    respiratoryRate: 18,
    temperatureCelsius: 37.1,
    oxygenSaturation: 98,
    weightKg: 78,
    heightCm: 170,
    bmi: 27.0,
    recordedAt: new Date().toISOString()
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-tmp-1',
      medicationName: 'Amlodipine Besylate',
      dosage: '5 mg',
      frequency: 'Once daily in morning',
      duration: '30 days',
      instructions: 'Take with water. Monitor ankle swelling.',
      status: 'ACTIVE'
    }
  ]);

  const [newRxName, setNewRxName] = useState('');
  const [newRxDosage, setNewRxDosage] = useState('');
  const [newRxFreq, setNewRxFreq] = useState('');
  const [newRxDuration, setNewRxDuration] = useState('30 days');
  const [newRxInstructions, setNewRxInstructions] = useState('');

  // Lab Orders
  const [labOrders, setLabOrders] = useState<{ testName: string; priority: string; status: 'PENDING' | 'COMPLETED' }[]>([
    { testName: 'Comprehensive Metabolic Panel (CMP)', priority: 'ROUTINE', status: 'PENDING' },
    { testName: 'High-Sensitivity Troponin-I', priority: 'STAT', status: 'PENDING' }
  ]);
  const [newLabTest, setNewLabTest] = useState('');
  const [newLabPriority, setNewLabPriority] = useState('ROUTINE');

  // AI Assistant States
  const [isCheckingDrug, setIsCheckingDrug] = useState(false);
  const [drugSafetyResult, setDrugSafetyResult] = useState<any>(null);
  const [isAiDiagnosing, setIsAiDiagnosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to add Rx
  const handleAddPrescription = () => {
    if (!newRxName) return;
    const item: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicationName: newRxName,
      dosage: newRxDosage || 'Standard',
      frequency: newRxFreq || 'Daily',
      duration: newRxDuration,
      instructions: newRxInstructions || 'As directed',
      status: 'ACTIVE'
    };
    setPrescriptions([...prescriptions, item]);
    setNewRxName('');
    setNewRxDosage('');
    setNewRxFreq('');
    setNewRxInstructions('');
    setDrugSafetyResult(null);
  };

  // Helper to check drug safety via AI
  const handleCheckDrugSafety = async () => {
    const medToCheck = newRxName || (prescriptions[0]?.medicationName ?? '');
    if (!medToCheck) {
      setErrorMsg('Please type or select a medication name to analyze.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setIsCheckingDrug(true);
    try {
      const existingMeds = prescriptions.map(p => p.medicationName);
      const res = await queryDrugSafety({
        currentMedications: existingMeds,
        newMedication: medToCheck,
        knownAllergies: patient?.allergies || []
      });
      setDrugSafetyResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Safety check failed');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsCheckingDrug(false);
    }
  };

  // Helper for AI Differential Diagnosis & ICD-10 suggestions
  const handleAiClinicalSuggest = async () => {
    if (!chiefComplaint) {
      setErrorMsg('Please enter symptoms or chief complaint first.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setIsAiDiagnosing(true);
    try {
      const res = await queryClinicalAssist({
        symptoms: chiefComplaint,
        vitals,
        patientHistory: patient?.chronicConditions?.join(', '),
        gender: patient?.gender
      });

      if (res.differentialDiagnosis && res.differentialDiagnosis.length > 0) {
        const top = res.differentialDiagnosis.slice(0, 2).map((d: any) => ({
          code: d.icd10,
          description: d.condition
        }));
        setDiagnosisList(prev => [...prev, ...top]);
      }
      if (res.suggestedLabWork) {
        const labs = res.suggestedLabWork.slice(0, 2).map((l: any) => ({
          testName: l.test,
          priority: l.priority,
          status: 'PENDING' as const
        }));
        setLabOrders(prev => [...prev, ...labs]);
      }
      setSuccessMsg('Clinical decision support populated differential diagnoses and priority lab orders!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Clinical decision assistant query failed');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsAiDiagnosing(false);
    }
  };

  // Save clinical note
  const handleSaveConsultation = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      await onSaveRecord({
        patientId: patient.id,
        chiefComplaint,
        historyOfPresentIllness: hpi,
        vitals,
        diagnosisCodes: diagnosisList,
        clinicalNotes: clinicalNotes || 'Patient evaluated and stabilized. Plan outlined and explained.',
        prescriptions,
        labOrders
      });
      setSuccessMsg('Clinical consultation signed and committed to permanent EMR!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign record');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Physician Consultation Desk & SOAP EHR</h1>
          <p className="text-xs text-slate-500 mt-0.5">Clinical notes, vital signs logging, ICD-10 diagnostic coding, and medication ordering</p>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Active Patient:</span>
          <select
            value={activePatientId}
            onChange={e => {
              setActivePatientId(e.target.value);
              setDrugSafetyResult(null);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.mrn}) - {p.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Patient Clinical Banner */}
      {patient && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-base">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{patient.firstName} {patient.lastName}</span>
                <span className="font-mono text-xs text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800">
                  {patient.mrn}
                </span>
                <span className="text-xs text-slate-400">
                  {patient.gender} • DOB: {patient.dob}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
                <span>Blood: <strong className="text-white">{patient.bloodGroup}</strong></span>
                <span>Ward: <strong className="text-white">{patient.assignedWard || 'Outpatient'}</strong></span>
                <span>Insurer: <strong className="text-white">{patient.insuranceProvider}</strong></span>
              </div>
            </div>
          </div>

          {/* Allergy Alert Badges */}
          <div className="flex items-center gap-2">
            {patient.allergies.length > 0 ? (
              <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-600/60 px-3 py-1.5 rounded-lg text-rose-300 text-xs font-bold animate-pulse">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>ALLERGIES: {patient.allergies.join(', ')}</span>
              </div>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold">NKDA (No Allergies)</span>
            )}
          </div>
        </div>
      )}

      {/* Main Clinical Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: SOAP Notes, Diagnoses, Vitals */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Vitals Recording Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Activity className="h-4 w-4 text-teal-600" />
                <span>Clinical Vital Signs Recorder</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Recorded: Just now</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block">Blood Pressure (mmHg)</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number"
                    value={vitals.bloodPressureSystolic}
                    onChange={e => setVitals({ ...vitals, bloodPressureSystolic: Number(e.target.value) })}
                    className="w-12 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded px-1"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    value={vitals.bloodPressureDiastolic}
                    onChange={e => setVitals({ ...vitals, bloodPressureDiastolic: Number(e.target.value) })}
                    className="w-12 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded px-1"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block">Heart Rate (BPM)</span>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={e => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="w-14 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded px-1"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block">Oxygen Saturation (SpO2)</span>
                <div className="flex items-center gap-1 mt-1">
                  <Wind className="h-3.5 w-3.5 text-cyan-600" />
                  <input
                    type="number"
                    value={vitals.oxygenSaturation}
                    onChange={e => setVitals({ ...vitals, oxygenSaturation: Number(e.target.value) })}
                    className="w-14 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded px-1"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block">Temperature (°C)</span>
                <div className="flex items-center gap-1 mt-1">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperatureCelsius}
                    onChange={e => setVitals({ ...vitals, temperatureCelsius: Number(e.target.value) })}
                    className="w-14 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded px-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SOAP Clinical Note Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                <span>SOAP Consultation Notes</span>
              </h3>
              <button
                type="button"
                onClick={handleAiClinicalSuggest}
                disabled={isAiDiagnosing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-bold border border-cyan-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                <span>{isAiDiagnosing ? 'Analyzing...' : 'Differential Assist'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  [S] Chief Complaint & Subjective Symptoms *
                </label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={e => setChiefComplaint(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  [O] History of Present Illness (HPI) & Physical Examination
                </label>
                <textarea
                  rows={2}
                  value={hpi}
                  onChange={e => setHpi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  [A] Diagnoses & ICD-10 Coding
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {diagnosisList.map((d, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg font-medium text-xs">
                        <strong className="font-mono text-teal-700">{d.code}</strong>: {d.description}
                        <button
                          type="button"
                          onClick={() => setDiagnosisList(diagnosisList.filter((_, idx) => idx !== i))}
                          className="hover:text-rose-600 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ICD-10 Code (e.g. I21.4)"
                      value={newDiagCode}
                      onChange={e => setNewDiagCode(e.target.value)}
                      className="w-32 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase"
                    />
                    <input
                      type="text"
                      placeholder="Condition description (e.g. Acute subendocardial myocardial infarction)"
                      value={newDiagDesc}
                      onChange={e => setNewDiagDesc(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDiagCode && newDiagDesc) {
                          setDiagnosisList([...diagnosisList, { code: newDiagCode, description: newDiagDesc }]);
                          setNewDiagCode('');
                          setNewDiagDesc('');
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700"
                    >
                      Add Dx
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  [P] Treatment Plan & Physician Orders
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Outline plan, diagnostic monitoring, diet restrictions, follow-up timeline..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action to Sign & Finalize */}
          <div className="flex items-center justify-end gap-3">
            <button
              id="btn-sign-clinical-record"
              onClick={handleSaveConsultation}
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <FileCheck className="h-4 w-4" />
              <span>{isSaving ? 'Signing & Encrypting...' : 'Sign & Finalize Medical Consultation'}</span>
            </button>
          </div>

        </div>

        {/* Right 1 Col: Prescription Builder & Drug Safety AI */}
        <div className="space-y-5">
          
          {/* Medication Orders */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="h-4 w-4 text-teal-600" />
                <span>Pharmacy Prescriptions</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">{prescriptions.length} items</span>
            </div>

            {/* Active Prescription items */}
            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={rx.id || idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{rx.medicationName}</span>
                      <span className="ml-2 text-slate-600 font-mono">({rx.dosage})</span>
                    </div>
                    <button
                      onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {rx.frequency} • {rx.duration}
                  </div>
                  {rx.instructions && (
                    <div className="text-[10px] text-slate-400 italic mt-0.5">
                      "{rx.instructions}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Rx */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Add New Medication:</span>
              <input
                type="text"
                placeholder="Medication Name (e.g. Amoxicillin, Metformin)"
                value={newRxName}
                onChange={e => setNewRxName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={newRxDosage}
                  onChange={e => setNewRxDosage(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g. BID)"
                  value={newRxFreq}
                  onChange={e => setNewRxFreq(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              {/* AI Drug Safety Checker Trigger */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckDrugSafety}
                  disabled={isCheckingDrug}
                  className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>{isCheckingDrug ? 'Auditing...' : 'Interaction & Safety Check'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddPrescription}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-xs"
                >
                  + Add Rx
                </button>
              </div>

              {/* Drug Safety Alert Display */}
              {drugSafetyResult && (
                <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  drugSafetyResult.severity === 'HIGH_CONTRAINDICATION' 
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : drugSafetyResult.severity === 'MODERATE'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <div className="font-bold flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Safety Audit: {drugSafetyResult.severity}</span>
                  </div>

                  {drugSafetyResult.allergyWarnings?.length > 0 && (
                    <div className="text-[11px] font-semibold text-rose-800">
                      🚨 {drugSafetyResult.allergyWarnings.join(', ')}
                    </div>
                  )}

                  {drugSafetyResult.interactionWarnings?.length > 0 && (
                    <div className="text-[11px]">
                      • {drugSafetyResult.interactionWarnings.join(' • ')}
                    </div>
                  )}

                  <div className="text-[10px] italic pt-1 border-t border-slate-200">
                    {drugSafetyResult.recommendation}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic Lab Orders */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>Laboratory & Diagnostic Orders</span>
            </h3>

            <div className="space-y-1.5">
              {labOrders.map((lab, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{lab.testName}</span>
                    <span className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      lab.priority === 'STAT' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {lab.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => setLabOrders(labOrders.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 text-xs pt-1">
              <input
                type="text"
                placeholder="New Lab Order (e.g. Serum Creatinine)"
                value={newLabTest}
                onChange={e => setNewLabTest(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded"
              />
              <select
                value={newLabPriority}
                onChange={e => setNewLabPriority(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded bg-white text-xs"
              >
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="STAT">STAT</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (newLabTest) {
                    setLabOrders([...labOrders, { testName: newLabTest, priority: newLabPriority, status: 'PENDING' }]);
                    setNewLabTest('');
                  }
                }}
                className="px-2.5 py-1 bg-slate-800 text-white rounded font-bold"
              >
                +
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
