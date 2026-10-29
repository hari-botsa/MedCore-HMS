export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'HOSPITAL_ADMIN' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'RECEPTIONIST' 
  | 'LAB_TECHNICIAN' 
  | 'PHARMACIST' 
  | 'ACCOUNTANT' 
  | 'PATIENT';

export interface Hospital {
  id: string;
  name: string;
  code: string;
  type: 'CLINIC' | 'COMMUNITY' | 'TERTIARY_CARE' | 'MULTI_SPECIALTY';
  capacityBeds: number;
  city: string;
  state: string;
  departments: string[];
  activePatients: number;
  phone: string;
  email: string;
}

export interface UserProfile {
  id: string;
  hospitalId: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatarUrl?: string;
  phone?: string;
}

export type TriageLevel = 'RESUSCITATION' | 'EMERGENT' | 'URGENT' | 'SEMI_URGENT' | 'NON_URGENT';

export interface Patient {
  id: string;
  hospitalId: string;
  mrn: string; // Medical Record Number (e.g., MC-9042)
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  insuranceProvider: string;
  policyNumber: string;
  status: 'INPATIENT' | 'OUTPATIENT' | 'DISCHARGED' | 'EMERGENCY';
  admittedAt?: string;
  assignedWard?: string;
  assignedBed?: string;
  primaryDoctorId?: string;
  deletedAt?: string | null;
  createdAt: string;
}

export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'IN_CONSULTATION'
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  dateTime: string;
  durationMinutes: number;
  reason: string;
  type: 'IN_PERSON' | 'TELEHEALTH' | 'EMERGENCY' | 'FOLLOW_UP';
  status: AppointmentStatus;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  notes?: string;
  room?: string;
  reminderSent24h?: boolean;
  reminderSent1h?: boolean;
  deletedAt?: string | null;
  createdAt: string;
}

export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperatureCelsius: number;
  oxygenSaturation: number; // SpO2 %
  weightKg: number;
  heightCm: number;
  bmi: number;
  recordedAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId?: string;
  medicationName: string;
  form?: 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'INHALER' | 'DROPS' | string;
  dosage: string;
  frequency: string; // e.g. "1-0-1", "TID", "Once daily"
  duration: string;
  instructions?: string;
  specialInstructions?: string;
  quantityPrescribed?: number;
  quantityDispensed?: number;
  status: 'PRESCRIBED' | 'DISPENSED' | 'PARTIALLY_DISPENSED' | 'CANCELLED' | 'ACTIVE';
}

export interface Prescription {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  doctorLicense: string;
  encounterId?: string;
  items: PrescriptionItem[];
  digitalSignature: string;
  notes?: string;
  status: 'PENDING_FULFILLMENT' | 'PARTIALLY_FULFILLED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
}

export interface MedicalRecord {
  id: string;
  hospitalId: string;
  patientId: string;
  patientMrn: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  visitType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY' | 'SURGICAL';
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: VitalSigns;
  diagnosisCodes: { code: string; description: string }[];
  treatmentPlan: string;
  clinicalNotes: string;
  allergiesSnapshot: string[];
  vaccinationHistory?: string[];
  familyHistory?: string;
  prescriptions: PrescriptionItem[];
  labOrderIds?: string[];
  labOrders?: any[];
  doctorDigitalSignature?: string;
  attachments?: { name: string; size: string; url: string; uploadedAt: string }[];
  followUpDate?: string;
  createdAt: string;
}

export type LabOrderStatus = 
  | 'ORDERED' 
  | 'SAMPLE_COLLECTED' 
  | 'PROCESSING' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED';

export interface LabResultItem {
  parameter: string;
  resultValue: string;
  value?: string;
  unit: string;
  referenceRange: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  isAbnormal?: boolean;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  testCategory: 'HEMATOLOGY' | 'BIOCHEMISTRY' | 'MICROBIOLOGY' | 'CARDIOLOGY' | 'IMMUNOLOGY' | 'URINALYSIS';
  testName: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  status: LabOrderStatus;
  sampleType: 'VENOUS_BLOOD' | 'SERUM' | 'PLASMA' | 'URINE' | 'SWAB' | 'CSF';
  sampleCollectedAt?: string;
  collectedBy?: string;
  processedAt?: string;
  processedBy?: string;
  results?: LabResultItem[];
  technicianNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvalRemarks?: string;
  cost: number;
  createdAt: string;
}

export interface MedicineBatch {
  id: string;
  medicineId: string;
  medicineName: string;
  category: 'ANTIBIOTIC' | 'ANALGESIC' | 'ANTIHYPERTENSIVE' | 'ANTIDIABETIC' | 'CARDIOVASCULAR' | 'RESPIRATORY' | 'VITAMIN';
  form: 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'INHALER';
  strength: string; // e.g., "500mg"
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantityInStock: number;
  initialQuantity?: number;
  currentStock?: number;
  reorderThreshold: number;
  unitCost: number;
  costPerUnit?: number;
  mrp: number; // Maximum Retail Price
  rackLocation: string;
  manufacturer?: string;
  storageConditions?: string;
  dosageForm?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'LOW_STOCK';
}

export interface Bed {
  id: string;
  hospitalId: string;
  bedNumber: string;
  ward: 'ICU' | 'CARDIAC_CARE' | 'GENERAL_WARD_A' | 'GENERAL_WARD_B' | 'EMERGENCY' | 'PEDIATRICS' | 'SURGICAL_RECOVERY';
  floor: number;
  dailyRate: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
  patientId?: string;
  patientName?: string;
  patientMrn?: string;
  admittedAt?: string;
  attendingDoctor?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'CONSULTATION' | 'PHARMACY' | 'LAB_TEST' | 'SURGERY' | 'ROOM_BED' | 'EQUIPMENT';
  quantity?: number;
  unitPrice?: number;
  amount: number;
}

export type PaymentGateway = 'STRIPE' | 'RAZORPAY' | 'CASH' | 'INSURANCE';

export interface Invoice {
  id: string;
  hospitalId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  items: InvoiceItem[];
  totalAmount: number;
  insuranceCoveredAmount: number;
  insuranceCoverageRate?: number;
  patientPayable: number;
  status: 'PAID' | 'PENDING' | 'CLAIM_SUBMITTED' | 'OVERDUE' | 'PARTIALLY_PAID';
  insuranceProvider: string;
  policyNumber?: string;
  paymentGateway?: PaymentGateway;
  transactionId?: string;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: 'INSURANCE' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH';
}

export type NotificationEventType = 
  | 'APPOINTMENT_CONFIRMED' 
  | 'APPOINTMENT_REMINDER' 
  | 'LAB_APPROVED' 
  | 'PRESCRIPTION_READY' 
  | 'INVOICE_GENERATED' 
  | 'PAYMENT_RECEIVED' 
  | 'LOW_STOCK' 
  | 'EMERGENCY_ALERT';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

export interface Notification {
  id: string;
  hospitalId: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  channel: NotificationChannel;
  eventType: NotificationEventType;
  title: string;
  message: string;
  isRead: boolean;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
  createdAt: string;
}

export interface HospitalStats {
  hospitalName?: string;
  totalPatients: number;
  activeInpatients: number;
  totalDoctors: number;
  occupiedBeds: number;
  totalBeds: number;
  bedOccupancyRate: number;
  todayAppointmentsCount: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingClaimsCount: number;
  criticalAlertsCount: number;
  emergencyCount: number;
  pendingLabOrdersCount: number;
  lowStockMedicinesCount: number;
}

export interface AuditLog {
  id: string;
  hospitalId?: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'AI_QUERY' | 'DISPENSE' | 'APPROVE' | 'PAYMENT';
  resourceType: 'PATIENT' | 'APPOINTMENT' | 'MEDICAL_RECORD' | 'BILLING' | 'BED' | 'AUTH' | 'LAB_ORDER' | 'PHARMACY';
  resource?: string;
  details: string;
  ipAddress: string;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  licenseNumber?: string;
  phone: string;
  email: string;
  availableDays: string[];
  workingHours: { start: string; end: string };
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'ROTATING';
  currentStatus: 'AVAILABLE' | 'IN_SURGERY' | 'IN_CONSULTATION' | 'OFF_DUTY';
  availability?: 'ON_DUTY' | 'ON_CALL' | 'OFF_DUTY';
  consultationFee?: number;
  activePatientsCount: number;
  deletedAt?: string | null;
}
