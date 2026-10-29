import { 
  Hospital,
  Patient, 
  Appointment, 
  MedicalRecord, 
  Bed, 
  Invoice, 
  HospitalStats, 
  Doctor, 
  AuditLog, 
  UserProfile,
  UserRole,
  LabOrder,
  Prescription,
  MedicineBatch,
  Notification
} from './types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchHospitals(): Promise<{ activeHospitalId: string; hospitals: Hospital[] }> {
  const res = await fetch(`${API_BASE}/hospitals`);
  if (!res.ok) throw new Error('Failed to fetch tenant hospitals');
  return res.json();
}

export async function switchHospital(hospitalId: string): Promise<{ success: boolean; hospital: Hospital }> {
  const res = await fetch(`${API_BASE}/hospitals/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hospitalId })
  });
  if (!res.ok) throw new Error('Failed to switch hospital tenant');
  return res.json();
}

export async function fetchStats(): Promise<HospitalStats> {
  const res = await fetch(`${API_BASE}/stats/overview`);
  if (!res.ok) throw new Error('Failed to fetch hospital stats');
  return res.json();
}

export async function fetchPatients(params?: { search?: string; status?: string; bloodGroup?: string }): Promise<Patient[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.bloodGroup) query.append('bloodGroup', params.bloodGroup);
  
  const res = await fetch(`${API_BASE}/patients?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function fetchPatientById(id: string): Promise<Patient & { 
  appointments: Appointment[]; 
  records: MedicalRecord[]; 
  invoices: Invoice[]; 
  labOrders: LabOrder[];
  prescriptions: Prescription[];
  assignedBedDetails?: Bed 
}> {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch patient details');
  return res.json();
}

export async function createPatient(patientData: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register patient');
  }
  return res.json();
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
}

export async function deletePatient(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete patient');
}

export async function checkAppointmentConflict(params: {
  doctorId: string;
  patientId: string;
  dateTime: string;
  durationMinutes?: number;
}): Promise<{ hasConflict: boolean; reason?: string }> {
  const res = await fetch(`${API_BASE}/appointments/check-conflict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to check scheduling conflict');
  return res.json();
}

export async function fetchAppointments(params?: { status?: string; doctorId?: string; patientId?: string }): Promise<Appointment[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.doctorId) query.append('doctorId', params.doctorId);
  if (params?.patientId) query.append('patientId', params.patientId);

  const res = await fetch(`${API_BASE}/appointments?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to book appointment');
  }
  return res.json();
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update appointment status');
  return res.json();
}

export async function fetchMedicalRecords(patientId?: string): Promise<MedicalRecord[]> {
  const url = patientId ? `${API_BASE}/records?patientId=${patientId}` : `${API_BASE}/records`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch medical records');
  return res.json();
}

export async function createMedicalRecord(recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
  const res = await fetch(`${API_BASE}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recordData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save medical record');
  }
  return res.json();
}

export async function fetchPrescriptions(patientId?: string): Promise<Prescription[]> {
  const url = patientId ? `${API_BASE}/prescriptions?patientId=${patientId}` : `${API_BASE}/prescriptions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch prescriptions');
  return res.json();
}

export async function createPrescription(data: Partial<Prescription>): Promise<Prescription> {
  const res = await fetch(`${API_BASE}/prescriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to issue prescription');
  }
  return res.json();
}

export async function fetchMedicineBatches(): Promise<MedicineBatch[]> {
  const res = await fetch(`${API_BASE}/pharmacy/batches`);
  if (!res.ok) throw new Error('Failed to fetch medicine batches');
  return res.json();
}

export async function dispensePrescription(
  prescriptionId: string,
  medicineName?: string,
  quantity?: number
): Promise<{ success: boolean; message: string; dispensedItems?: any[] }> {
  const res = await fetch(`${API_BASE}/pharmacy/dispense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prescriptionId, medicineName, quantity })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to dispense prescription');
  }
  return res.json();
}

export const dispensePrescriptionBatch = dispensePrescription;

export async function fetchLabOrders(params?: { status?: string; patientId?: string }): Promise<LabOrder[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.patientId) query.append('patientId', params.patientId);
  const res = await fetch(`${API_BASE}/lab-orders?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch lab orders');
  return res.json();
}

export async function createLabOrder(data: Partial<LabOrder>): Promise<LabOrder> {
  const res = await fetch(`${API_BASE}/lab-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create lab order');
  }
  return res.json();
}

export async function updateLabOrderStatus(
  id: string,
  updateData: string | {
    status: string;
    results?: any[];
    technicianNotes?: string;
    approvalRemarks?: string;
  },
  results?: any[]
): Promise<LabOrder> {
  const payload = typeof updateData === 'string'
    ? { status: updateData, results }
    : updateData;
  const res = await fetch(`${API_BASE}/lab-orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update lab order');
  }
  return res.json();
}

export async function fetchBeds(params?: { ward?: string; status?: string }): Promise<Bed[]> {
  const query = new URLSearchParams();
  if (params?.ward) query.append('ward', params.ward);
  if (params?.status) query.append('status', params.status);

  const res = await fetch(`${API_BASE}/beds?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch beds');
  return res.json();
}

export async function admitPatientToBed(
  bedIdOrData: string | { bedId: string; patientId: string; attendingDoctor?: string },
  patientIdArg?: string,
  attendingDoctorArg?: string
): Promise<{ bed: Bed; patient: Patient }> {
  const payload = typeof bedIdOrData === 'string'
    ? { bedId: bedIdOrData, patientId: patientIdArg!, attendingDoctor: attendingDoctorArg }
    : bedIdOrData;

  const res = await fetch(`${API_BASE}/beds/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to admit patient to bed');
  }
  return res.json();
}

export async function dischargeBed(bedId: string): Promise<Bed> {
  const res = await fetch(`${API_BASE}/beds/discharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bedId })
  });
  if (!res.ok) throw new Error('Failed to discharge bed');
  return res.json();
}

export async function fetchInvoices(params?: { status?: string; patientId?: string }): Promise<Invoice[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.patientId) query.append('patientId', params.patientId);

  const res = await fetch(`${API_BASE}/billing?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  const res = await fetch(`${API_BASE}/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create invoice');
  }
  return res.json();
}

export async function payInvoice(id: string, paymentMethod: string, paymentGateway: string = 'STRIPE'): Promise<Invoice> {
  const res = await fetch(`${API_BASE}/billing/${id}/pay`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod, paymentGateway })
  });
  if (!res.ok) throw new Error('Failed to process payment');
  return res.json();
}

export async function fetchNotifications(params?: { channel?: string; unreadOnly?: boolean }): Promise<Notification[]> {
  const query = new URLSearchParams();
  if (params?.channel) query.append('channel', params.channel);
  if (params?.unreadOnly) query.append('unreadOnly', 'true');
  const res = await fetch(`${API_BASE}/notifications?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${API_BASE}/doctors`);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/current`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function switchUserRole(role: UserRole): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/switch-role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error('Failed to switch role');
  return res.json();
}

export async function queryClinicalAssist(params: {
  symptoms: string;
  vitals?: any;
  patientHistory?: string;
  age?: number;
  gender?: string;
}) {
  const res = await fetch(`${API_BASE}/ai/clinical-assist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Clinical AI query failed');
  }
  return res.json();
}

export async function queryDrugSafety(params: {
  currentMedications: string[];
  newMedication: string;
  knownAllergies: string[];
}) {
  const res = await fetch(`${API_BASE}/ai/drug-safety`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Drug safety check failed');
  }
  return res.json();
}

export async function queryDischargeSummary(data: {
  patient?: any;
  patientName?: string;
  mrn?: string;
  admissionReason?: string;
  admissionDiagnosis?: string;
  hospitalCourse?: string;
  dischargeVitals?: any;
  diagnoses?: string[];
  treatmentSummary?: string;
  dischargeMedications?: string[];
  followUpInstructions?: string;
}) {
  const res = await fetch(`${API_BASE}/ai/discharge-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Discharge summary generation failed');
  }
  return res.json();
}

export async function resetSystemDemo() {
  const res = await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
  return res.json();
}

export const resetDatabase = resetSystemDemo;
