import React, { useState } from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  ShieldAlert, 
  FileText, 
  Send, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  ClipboardList, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Patient } from '../types';
import { queryClinicalAssist, queryDrugSafety, queryDischargeSummary } from '../api';

interface AiAssistantViewProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  patients,
  onSelectPatient,
}) => {
  const [activeTab, setActiveTab] = useState<'DIFFERENTIAL' | 'DRUG_SAFETY' | 'DISCHARGE'>('DIFFERENTIAL');

  // Differential Diagnosis States
  const [diffSymptoms, setDiffSymptoms] = useState('Acute crushing substernal chest pressure radiating to the left jaw, accompanied by diaphoresis and mild shortness of breath.');
  const [diffHistory, setDiffHistory] = useState('Type 2 Diabetes, Hypertension, 30 pack-year smoking history');
  const [diffVitals, setDiffVitals] = useState({ bp: '162/98', hr: '98', spo2: '94%', temp: '37.2' });
  const [diffResult, setDiffResult] = useState<any>(null);
  const [isDiffLoading, setIsDiffLoading] = useState(false);

  // Drug Safety States
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [currentMeds, setCurrentMeds] = useState('Lisinopril 20mg, Metformin 1000mg, Warfarin 5mg');
  const [newMed, setNewMed] = useState('Aspirin 81mg Daily');
  const [allergies, setAllergies] = useState('Penicillin, Sulfa drugs');
  const [safetyResult, setSafetyResult] = useState<any>(null);
  const [isSafetyLoading, setIsSafetyLoading] = useState(false);

  // Discharge Summary States
  const [dischargePatientId, setDischargePatientId] = useState(patients[1]?.id || patients[0]?.id || '');
  const [hospitalCourse, setHospitalCourse] = useState(
    'Patient admitted for 48 hours following acute exacerbation of heart failure. Stabilized with IV furosemide and transitioned to oral torsemide. Daily weights trending down 2.4kg. EKG normalized.'
  );
  const [dischargeResult, setDischargeResult] = useState<any>(null);
  const [isDischargeLoading, setIsDischargeLoading] = useState(false);

  // Quick Preset Scenarios
  const handleLoadScenario = (scenario: 'CARDIAC' | 'ALLERGY_WARFARIN' | 'PEDIATRIC') => {
    if (scenario === 'CARDIAC') {
      setActiveTab('DIFFERENTIAL');
      setDiffSymptoms('Sudden onset acute sharp pleuritic chest pain, dyspnea at rest, right calf swelling and tenderness following 14-hour international flight.');
      setDiffHistory('Oral contraceptive therapy, no prior cardiac disease');
      setDiffVitals({ bp: '138/86', hr: '112', spo2: '91%', temp: '37.5' });
    } else if (scenario === 'ALLERGY_WARFARIN') {
      setActiveTab('DRUG_SAFETY');
      setCurrentMeds('Warfarin 5mg, Atorvastatin 40mg');
      setNewMed('Ciprofloxacin 500mg BID');
      setAllergies('Penicillin, NSAIDs');
    } else if (scenario === 'PEDIATRIC') {
      setActiveTab('DISCHARGE');
      setHospitalCourse('7-year-old child admitted for severe dehydration secondary to viral gastroenteritis. Rehydrated with IV Normal Saline boluses, tolerated oral clear fluids, afebrile x 24h.');
    }
  };

  const [panelError, setPanelError] = useState<string | null>(null);

  const handleRunDifferential = async () => {
    setPanelError(null);
    setIsDiffLoading(true);
    try {
      const res = await queryClinicalAssist({
        symptoms: diffSymptoms,
        patientHistory: diffHistory,
        vitals: {
          bloodPressureSystolic: parseInt(diffVitals.bp?.split('/')[0]) || 120,
          bloodPressureDiastolic: parseInt(diffVitals.bp?.split('/')[1]) || 80,
          heartRate: parseInt(diffVitals.hr) || 72,
          oxygenSaturation: parseInt(diffVitals.spo2) || 98,
          temperatureCelsius: parseFloat(diffVitals.temp) || 37.0,
          respiratoryRate: 18,
          recordedAt: new Date().toISOString()
        }
      });
      setDiffResult(res);
    } catch (err: any) {
      setPanelError(err.message || 'Clinical decision query failed');
      setTimeout(() => setPanelError(null), 4000);
    } finally {
      setIsDiffLoading(false);
    }
  };

  const handleRunSafety = async () => {
    setPanelError(null);
    setIsSafetyLoading(true);
    try {
      const medsArray = currentMeds.split(',').map(s => s.trim()).filter(Boolean);
      const allergiesArray = allergies.split(',').map(s => s.trim()).filter(Boolean);
      const res = await queryDrugSafety({
        currentMedications: medsArray,
        newMedication: newMed,
        knownAllergies: allergiesArray
      });
      setSafetyResult(res);
    } catch (err: any) {
      setPanelError(err.message || 'Drug safety verification failed');
      setTimeout(() => setPanelError(null), 4000);
    } finally {
      setIsSafetyLoading(false);
    }
  };

  const handleRunDischarge = async () => {
    setPanelError(null);
    const pt = patients.find(p => p.id === dischargePatientId) || patients[0];
    setIsDischargeLoading(true);
    try {
      const res = await queryDischargeSummary({
        patientName: `${pt?.firstName} ${pt?.lastName}`,
        mrn: pt?.mrn || 'MC-2026-0001',
        admissionDiagnosis: 'Acute Heart Failure Exacerbation',
        hospitalCourse,
        dischargeVitals: { bp: '122/76', hr: '68', spo2: '98%' }
      });
      setDischargeResult(res);
    } catch (err: any) {
      setPanelError(err.message || 'Discharge summary generation failed');
      setTimeout(() => setPanelError(null), 4000);
    } finally {
      setIsDischargeLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Decision Support System (CDSS)</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
              CDSS Engine v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time differential diagnosis ranking, drug-drug contraindication audit, and automated discharge narrative synthesis
          </p>
        </div>

        {/* Quick Scenario Fill Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Clinical Demos:</span>
          <button
            onClick={() => handleLoadScenario('CARDIAC')}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 hover:shadow-xs hover:-translate-y-0.5 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            Pulmonary Embolism Case
          </button>
          <button
            onClick={() => handleLoadScenario('ALLERGY_WARFARIN')}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 hover:shadow-xs hover:-translate-y-0.5 text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            Warfarin Drug Interaction
          </button>
        </div>
      </div>

      {panelError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{panelError}</span>
          <button onClick={() => setPanelError(null)} className="text-rose-600 hover:text-rose-900 ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 pt-2 rounded-t-xl gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('DIFFERENTIAL')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'DIFFERENTIAL'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          <span>Differential Diagnosis & ICD-10</span>
        </button>

        <button
          onClick={() => setActiveTab('DRUG_SAFETY')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'DRUG_SAFETY'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Drug Safety & Contraindication Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('DISCHARGE')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'DISCHARGE'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Automated Discharge Summary Synthesizer</span>
        </button>
      </div>

      {/* Tab 1: Differential Diagnosis */}
      {activeTab === 'DIFFERENTIAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white p-5 rounded-b-xl lg:rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-teal-600" />
              <span>Patient Presentation & Clinical Symptoms</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Complaint & Symptoms *</label>
                <textarea
                  rows={3}
                  value={diffSymptoms}
                  onChange={e => setDiffSymptoms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relevant Past Medical History / Risk Factors</label>
                <input
                  type="text"
                  value={diffHistory}
                  onChange={e => setDiffHistory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vitals Signs at Presentation</label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">BP (mmHg)</span>
                    <input
                      type="text"
                      value={diffVitals.bp}
                      onChange={e => setDiffVitals({ ...diffVitals, bp: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">HR (BPM)</span>
                    <input
                      type="text"
                      value={diffVitals.hr}
                      onChange={e => setDiffVitals({ ...diffVitals, hr: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <input
                      type="text"
                      value={diffVitals.spo2}
                      onChange={e => setDiffVitals({ ...diffVitals, spo2: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temp (°C)</span>
                    <input
                      type="text"
                      value={diffVitals.temp}
                      onChange={e => setDiffVitals({ ...diffVitals, temp: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-run-ai-differential"
                  onClick={handleRunDifferential}
                  disabled={isDiffLoading}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isDiffLoading ? 'Querying Gemini Clinical Model...' : 'Generate Differential & ICD-10 Codes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="bg-white p-5 rounded-b-xl lg:rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>Clinical Decision Analysis</span>
            </h3>

            {!diffResult ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                <Sparkles className="h-8 w-8 mx-auto text-teal-500/40" />
                <p>Run clinical presentation analysis to evaluate ranked diagnostic hypotheses.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Triage Urgency */}
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  diffResult.triageUrgency === 'EMERGENCY' ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' :
                  diffResult.triageUrgency === 'URGENT' ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' :
                  'bg-blue-50 border-blue-300 text-blue-900'
                }`}>
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Triage Urgency: {diffResult.triageUrgency}</span>
                  </span>
                  <span className="text-[11px] font-normal uppercase tracking-wider">{diffResult.differentialDiagnosis?.length || 0} Conditions Ranked</span>
                </div>

                {/* Ranked Conditions */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Ranked Differential Diagnoses:</span>
                  {diffResult.differentialDiagnosis?.map((d: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span className="font-bold text-slate-900">{d.condition}</span>
                          <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            ICD-10: {d.icd10}
                          </span>
                        </div>
                        <span className="font-bold text-teal-600 font-mono">{d.likelihood}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-7">{d.rationale}</p>
                    </div>
                  ))}
                </div>

                {/* Suggested Labs */}
                {diffResult.suggestedLabWork && (
                  <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-200/60 space-y-1.5">
                    <span className="font-bold text-teal-900 block">Recommended Confirmatory Workup:</span>
                    <div className="space-y-1 text-[11px] text-teal-950">
                      {diffResult.suggestedLabWork.map((l: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>• <strong>{l.test}</strong>: {l.reason}</span>
                          <span className="font-mono font-bold text-[10px] text-teal-700 uppercase">{l.priority}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Drug Safety & Contraindications */}
      {activeTab === 'DRUG_SAFETY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill className="h-4 w-4 text-teal-600" />
              <span>Prescription Safety & Interaction Audit</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Active Medications (comma separated)</label>
                <textarea
                  rows={2}
                  value={currentMeds}
                  onChange={e => setCurrentMeds(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposed New Prescription *</label>
                <input
                  type="text"
                  value={newMed}
                  onChange={e => setNewMed(e.target.value)}
                  placeholder="e.g. Clopidogrel 75mg daily"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Documented Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-run-ai-drug-safety"
                  onClick={handleRunSafety}
                  disabled={isSafetyLoading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>{isSafetyLoading ? 'Checking Pharmacology Engine...' : 'Perform Drug-Drug & Allergy Audit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Safety Result */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-600" />
              <span>Pharmacovigilance Audit Report</span>
            </h3>

            {!safetyResult ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                <ShieldAlert className="h-8 w-8 mx-auto text-amber-500/40" />
                <p>Auditing detects cytochrome P450 interactions, bleeding risks, and allergy cross-sensitivities.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${
                  safetyResult.severity === 'HIGH_CONTRAINDICATION' ? 'bg-rose-50 border-rose-300 text-rose-950' :
                  safetyResult.severity === 'MODERATE' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                  'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Severity Assessment:</span>
                    <span className="font-mono uppercase">{safetyResult.severity}</span>
                  </div>

                  {safetyResult.allergyWarnings?.length > 0 && (
                    <div className="p-2 bg-rose-100 border border-rose-300 text-rose-900 rounded-lg font-bold">
                      ⚠️ Allergy Warning: {safetyResult.allergyWarnings.join(' • ')}
                    </div>
                  )}

                  {safetyResult.interactionWarnings?.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-semibold block">Identified Drug Interactions:</span>
                      {safetyResult.interactionWarnings.map((w: string, i: number) => (
                        <div key={i} className="text-[11px]">• {w}</div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-300/60">
                    <span className="font-bold block">Pharmacist Recommendation:</span>
                    <p className="text-[11px] mt-0.5">{safetyResult.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Automated Discharge Summary */}
      {activeTab === 'DISCHARGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              <span>Hospital Course & Discharge Input</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Inpatient *</label>
                <select
                  value={dischargePatientId}
                  onChange={e => setDischargePatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn}) — {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Hospital Course Notes *</label>
                <textarea
                  rows={5}
                  value={hospitalCourse}
                  onChange={e => setHospitalCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-run-ai-discharge"
                  onClick={handleRunDischarge}
                  disabled={isDischargeLoading}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isDischargeLoading ? 'Synthesizing Formal Discharge Note...' : 'Generate Official Discharge Summary'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Discharge Output */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              <span>Formal Medical Discharge Record</span>
            </h3>

            {!dischargeResult ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                <FileText className="h-8 w-8 mx-auto text-teal-500/40" />
                <p>Generates patient instructions, red-flag emergency symptoms, and outpatient follow-ups.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Hospital Course Summary:</span>
                  <p className="text-slate-700 mt-0.5">{dischargeResult.hospitalCourseSummary}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900 block">Discharge Instructions & Activity:</span>
                  <p className="text-slate-700 mt-0.5">{dischargeResult.patientInstructions}</p>
                </div>

                {dischargeResult.warningRedFlags?.length > 0 && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      <span>Return to Emergency Room if:</span>
                    </span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                      {dischargeResult.warningRedFlags.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                  <span>Follow-up: <strong>{dischargeResult.followUpTimeline || '7-10 Days with Primary Care'}</strong></span>
                  <span className="font-mono text-teal-700 font-bold">Signed: Attending Physician</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
