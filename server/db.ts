import { 
  Hospital,
  Patient, 
  Doctor, 
  Appointment, 
  MedicalRecord, 
  Bed, 
  Invoice, 
  AuditLog, 
  HospitalStats, 
  UserProfile,
  UserRole,
  LabOrder,
  MedicineBatch,
  Prescription,
  Notification
} from '../src/types';

export class HospitalDatabase {
  activeHospitalId: string = 'hosp-1';

  hospitals: Hospital[] = [
    {
      id: 'hosp-1',
      name: 'Metropolitan Medical Center',
      code: 'MMC',
      type: 'TERTIARY_CARE',
      capacityBeds: 450,
      city: 'New York',
      state: 'NY',
      departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency Medicine', 'Oncology', 'Intensive Care Unit', 'Pathology', 'Pharmacy'],
      activePatients: 642,
      phone: '+1 (212) 555-0199',
      email: 'contact@metropolitanmed.org'
    },
    {
      id: 'hosp-2',
      name: 'St. Jude Specialist Hospital',
      code: 'SJH',
      type: 'MULTI_SPECIALTY',
      capacityBeds: 180,
      city: 'Chicago',
      state: 'IL',
      departments: ['General Surgery', 'Cardiology', 'Pediatrics', 'Pathology', 'Radiology'],
      activePatients: 198,
      phone: '+1 (312) 555-0144',
      email: 'admin@stjudespecialist.org'
    },
    {
      id: 'hosp-3',
      name: 'Apex Children & General Health',
      code: 'ACG',
      type: 'CLINIC',
      capacityBeds: 50,
      city: 'Austin',
      state: 'TX',
      departments: ['Pediatrics', 'Family Medicine', 'Immunology'],
      activePatients: 74,
      phone: '+1 (512) 555-0182',
      email: 'care@apexchildrenclinic.com'
    }
  ];

  patients: Patient[] = [
    {
      id: 'p-1',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-0811',
      firstName: 'Eleanor',
      lastName: 'Vance',
      dob: '1968-04-12',
      gender: 'FEMALE',
      bloodGroup: 'O+',
      phone: '+1 (555) 234-5678',
      email: 'eleanor.vance@example.com',
      address: '742 Evergreen Terrace, Springfield, OR',
      emergencyContact: {
        name: 'Thomas Vance',
        relationship: 'Spouse',
        phone: '+1 (555) 234-5679'
      },
      allergies: ['Penicillin', 'Sulfa drugs'],
      chronicConditions: ['Type 2 Diabetes', 'Essential Hypertension'],
      insuranceProvider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS-9843210',
      status: 'INPATIENT',
      admittedAt: '2026-09-18T14:30:00Z',
      assignedWard: 'GENERAL_WARD_A',
      assignedBed: 'GW-A-102',
      primaryDoctorId: 'doc-1',
      deletedAt: null,
      createdAt: '2026-01-15T09:00:00Z'
    },
    {
      id: 'p-2',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-0945',
      firstName: 'Marcus',
      lastName: 'Chen',
      dob: '1984-11-03',
      gender: 'MALE',
      bloodGroup: 'A+',
      phone: '+1 (555) 345-6789',
      email: 'marcus.chen@example.com',
      address: '128 Silicon Parkway, Austin, TX',
      emergencyContact: {
        name: 'Li Wei Chen',
        relationship: 'Sister',
        phone: '+1 (555) 345-6780'
      },
      allergies: ['Aspirin'],
      chronicConditions: ['Atrial Fibrillation'],
      insuranceProvider: 'Aetna Premier Care',
      policyNumber: 'AET-445892',
      status: 'INPATIENT',
      admittedAt: '2026-09-19T08:15:00Z',
      assignedWard: 'ICU',
      assignedBed: 'ICU-04',
      primaryDoctorId: 'doc-1',
      deletedAt: null,
      createdAt: '2026-02-10T10:20:00Z'
    },
    {
      id: 'p-3',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-1022',
      firstName: 'Sophia',
      lastName: 'Rodriguez',
      dob: '2018-06-25',
      gender: 'FEMALE',
      bloodGroup: 'B+',
      phone: '+1 (555) 456-7890',
      email: 'parents.rodriguez@example.com',
      address: '55 Canyon Creek Blvd, Denver, CO',
      emergencyContact: {
        name: 'Carlos Rodriguez',
        relationship: 'Father',
        phone: '+1 (555) 456-7891'
      },
      allergies: ['Peanuts'],
      chronicConditions: ['Pediatric Asthma'],
      insuranceProvider: 'United Healthcare',
      policyNumber: 'UHC-871239',
      status: 'OUTPATIENT',
      primaryDoctorId: 'doc-3',
      deletedAt: null,
      createdAt: '2026-03-05T11:45:00Z'
    },
    {
      id: 'p-4',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-1180',
      firstName: 'James',
      lastName: 'O\'Connor',
      dob: '1975-09-18',
      gender: 'MALE',
      bloodGroup: 'AB-',
      phone: '+1 (555) 567-8901',
      email: 'j.oconnor@example.com',
      address: '14 Harbor View Lane, Boston, MA',
      emergencyContact: {
        name: 'Mary O\'Connor',
        relationship: 'Spouse',
        phone: '+1 (555) 567-8902'
      },
      allergies: [],
      chronicConditions: ['Lumbar Disc Herniation', 'Hyperlipidemia'],
      insuranceProvider: 'Cigna Health',
      policyNumber: 'CIG-129840',
      status: 'INPATIENT',
      admittedAt: '2026-09-17T11:00:00Z',
      assignedWard: 'SURGICAL_RECOVERY',
      assignedBed: 'SURG-02',
      primaryDoctorId: 'doc-4',
      deletedAt: null,
      createdAt: '2026-04-12T14:10:00Z'
    },
    {
      id: 'p-5',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-1244',
      firstName: 'Amina',
      lastName: 'Al-Mansoor',
      dob: '1992-02-28',
      gender: 'FEMALE',
      bloodGroup: 'O-',
      phone: '+1 (555) 678-9012',
      email: 'amina.mansoor@example.com',
      address: '890 Crescent Heights, Seattle, WA',
      emergencyContact: {
        name: 'Tariq Al-Mansoor',
        relationship: 'Brother',
        phone: '+1 (555) 678-9013'
      },
      allergies: ['Codeine', 'NSAIDs'],
      chronicConditions: ['Migraine with Aura'],
      insuranceProvider: 'Kaiser Permanente',
      policyNumber: 'KP-992384',
      status: 'OUTPATIENT',
      primaryDoctorId: 'doc-2',
      deletedAt: null,
      createdAt: '2026-05-20T08:30:00Z'
    },
    {
      id: 'p-6',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-1302',
      firstName: 'David',
      lastName: 'Kowalski',
      dob: '1961-07-14',
      gender: 'MALE',
      bloodGroup: 'B-',
      phone: '+1 (555) 789-0123',
      email: 'd.kowalski@example.com',
      address: '412 Industrial Parkway, Detroit, MI',
      emergencyContact: {
        name: 'Anna Kowalski',
        relationship: 'Daughter',
        phone: '+1 (555) 789-0124'
      },
      allergies: ['Contrast Dye'],
      chronicConditions: ['Coronary Artery Disease', 'Stage 3 CKD'],
      insuranceProvider: 'Medicare Part B',
      policyNumber: 'MED-7712903',
      status: 'EMERGENCY',
      admittedAt: '2026-09-20T02:15:00Z',
      assignedWard: 'EMERGENCY',
      assignedBed: 'ER-BAY-02',
      primaryDoctorId: 'doc-6',
      deletedAt: null,
      createdAt: '2026-09-20T02:00:00Z'
    },
    {
      id: 'p-7',
      hospitalId: 'hosp-1',
      mrn: 'MC-2026-1411',
      firstName: 'Zara',
      lastName: 'Patel',
      dob: '2001-12-09',
      gender: 'FEMALE',
      bloodGroup: 'A-',
      phone: '+1 (555) 890-1234',
      email: 'zara.patel@example.com',
      address: '22 University Square, Berkeley, CA',
      emergencyContact: {
        name: 'Meera Patel',
        relationship: 'Mother',
        phone: '+1 (555) 890-1235'
      },
      allergies: ['Latex'],
      chronicConditions: ['Iron Deficiency Anemia'],
      insuranceProvider: 'Anthem Blue Cross',
      policyNumber: 'ANT-554109',
      status: 'DISCHARGED',
      primaryDoctorId: 'doc-5',
      deletedAt: null,
      createdAt: '2026-08-14T16:00:00Z'
    },
    {
      id: 'p-8',
      hospitalId: 'hosp-2',
      mrn: 'SJ-2026-0042',
      firstName: 'Lucas',
      lastName: 'Chen',
      dob: '2019-04-12',
      gender: 'MALE',
      bloodGroup: 'O+',
      phone: '+1 (555) 912-3344',
      email: 'chen.family@example.com',
      address: '450 Childrens Way, Memphis, TN',
      emergencyContact: {
        name: 'Wei Chen',
        relationship: 'Father',
        phone: '+1 (555) 912-3345'
      },
      allergies: ['Peanuts'],
      chronicConditions: ['Pediatric Asthma'],
      insuranceProvider: 'Blue Cross Community',
      policyNumber: 'BCC-994821',
      status: 'INPATIENT',
      assignedWard: 'PEDIATRICS',
      assignedBed: 'PED-BAY-01',
      primaryDoctorId: 'doc-3',
      deletedAt: null,
      createdAt: '2026-09-10T08:00:00Z'
    },
    {
      id: 'p-9',
      hospitalId: 'hosp-2',
      mrn: 'SJ-2026-0055',
      firstName: 'Mia',
      lastName: 'Santoro',
      dob: '2021-08-25',
      gender: 'FEMALE',
      bloodGroup: 'B+',
      phone: '+1 (555) 912-7788',
      email: 'santoro.parents@example.com',
      address: '782 St. Jude Lane, Memphis, TN',
      emergencyContact: {
        name: 'Elena Santoro',
        relationship: 'Mother',
        phone: '+1 (555) 912-7789'
      },
      allergies: [],
      chronicConditions: [],
      insuranceProvider: 'UnitedHealthcare Community Plan',
      policyNumber: 'UHC-482019',
      status: 'OUTPATIENT',
      primaryDoctorId: 'doc-3',
      deletedAt: null,
      createdAt: '2026-09-12T10:30:00Z'
    }
  ];

  doctors: Doctor[] = [
    {
      id: 'doc-1',
      hospitalId: 'hosp-1',
      name: 'Dr. Priya Sharma, MD, FACC',
      specialization: 'Interventional Cardiology',
      department: 'Cardiology',
      qualification: 'Harvard Medical School • Board Certified in Cardiovascular Diseases',
      licenseNumber: 'MD-NY-84920',
      phone: '+1 (555) 100-2001',
      email: 'priya.sharma@medcore.hospital',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      workingHours: { start: '08:00', end: '16:00' },
      shift: 'MORNING',
      currentStatus: 'AVAILABLE',
      availability: 'ON_DUTY',
      consultationFee: 450,
      activePatientsCount: 24,
      deletedAt: null
    },
    {
      id: 'doc-2',
      hospitalId: 'hosp-1',
      name: 'Dr. Arthur Vance, MD, PhD',
      specialization: 'Neurology & Neurophysiology',
      department: 'Neurology',
      qualification: 'Johns Hopkins School of Medicine • Fellowship in Stroke Care',
      licenseNumber: 'MD-NY-77215',
      phone: '+1 (555) 100-2002',
      email: 'arthur.vance@medcore.hospital',
      availableDays: ['Tuesday', 'Wednesday', 'Friday'],
      workingHours: { start: '09:00', end: '17:00' },
      shift: 'MORNING',
      currentStatus: 'IN_CONSULTATION',
      availability: 'ON_DUTY',
      consultationFee: 400,
      activePatientsCount: 18,
      deletedAt: null
    },
    {
      id: 'doc-3',
      hospitalId: 'hosp-1',
      name: 'Dr. Maya Lin, MD, FAAP',
      specialization: 'Pediatric Pulmonology & Critical Care',
      department: 'Pediatrics',
      qualification: 'Stanford University School of Medicine • Pediatric Residency Lucile Packard',
      licenseNumber: 'MD-NY-91823',
      phone: '+1 (555) 100-2003',
      email: 'maya.lin@medcore.hospital',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      workingHours: { start: '08:30', end: '16:30' },
      shift: 'MORNING',
      currentStatus: 'AVAILABLE',
      availability: 'ON_DUTY',
      consultationFee: 320,
      activePatientsCount: 31,
      deletedAt: null
    },
    {
      id: 'doc-4',
      hospitalId: 'hosp-1',
      name: 'Dr. Gregory Thorne, MD, FACS',
      specialization: 'Orthopedic Spine Surgery',
      department: 'Orthopedics',
      qualification: 'Columbia University Vagelos College of Physicians and Surgeons',
      licenseNumber: 'MD-NY-63519',
      phone: '+1 (555) 100-2004',
      email: 'gregory.thorne@medcore.hospital',
      availableDays: ['Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '07:30', end: '15:30' },
      shift: 'MORNING',
      currentStatus: 'IN_SURGERY',
      availability: 'ON_DUTY',
      consultationFee: 550,
      activePatientsCount: 15,
      deletedAt: null
    },
    {
      id: 'doc-5',
      hospitalId: 'hosp-1',
      name: 'Dr. Sarah Jenkins, MD',
      specialization: 'Clinical Oncology & Hematology',
      department: 'Oncology',
      qualification: 'Mayo Clinic Alix School of Medicine • Fellowship in Hematologic Malignancies',
      licenseNumber: 'MD-NY-88341',
      phone: '+1 (555) 100-2005',
      email: 'sarah.jenkins@medcore.hospital',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      workingHours: { start: '09:00', end: '17:00' },
      shift: 'MORNING',
      currentStatus: 'AVAILABLE',
      availability: 'ON_CALL',
      consultationFee: 420,
      activePatientsCount: 22,
      deletedAt: null
    },
    {
      id: 'doc-6',
      hospitalId: 'hosp-1',
      name: 'Dr. Robert Torres, MD, FACEP',
      specialization: 'Emergency Medicine & Acute Trauma',
      department: 'Emergency Medicine',
      qualification: 'University of Pennsylvania Perelman School of Medicine',
      licenseNumber: 'MD-NY-55294',
      phone: '+1 (555) 100-2006',
      email: 'robert.torres@medcore.hospital',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      workingHours: { start: '19:00', end: '07:00' },
      shift: 'NIGHT',
      currentStatus: 'AVAILABLE',
      availability: 'ON_DUTY',
      consultationFee: 350,
      activePatientsCount: 9,
      deletedAt: null
    }
  ];

  appointments: Appointment[] = [
    {
      id: 'apt-1',
      hospitalId: 'hosp-1',
      patientId: 'p-1',
      patientName: 'Eleanor Vance',
      patientMrn: 'MC-2026-0811',
      doctorId: 'doc-1',
      doctorName: 'Dr. Evelyn Reed, MD, FACC',
      department: 'Cardiology',
      dateTime: '2026-09-20T09:30:00Z',
      durationMinutes: 30,
      reason: 'Post-admission hemodynamic evaluation and Holter monitoring review',
      type: 'IN_PERSON',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      room: 'Cardio Suite 3B',
      reminderSent24h: true,
      reminderSent1h: true,
      deletedAt: null,
      createdAt: '2026-09-18T10:00:00Z'
    },
    {
      id: 'apt-2',
      hospitalId: 'hosp-1',
      patientId: 'p-3',
      patientName: 'Sophia Rodriguez',
      patientMrn: 'MC-2026-1022',
      doctorId: 'doc-3',
      doctorName: 'Dr. Maya Lin, MD, FAAP',
      department: 'Pediatrics',
      dateTime: '2026-09-20T10:30:00Z',
      durationMinutes: 30,
      reason: 'Spirometry follow-up and seasonal asthma action plan revision',
      type: 'IN_PERSON',
      status: 'CONFIRMED',
      priority: 'NORMAL',
      room: 'Pediatrics Room 102',
      reminderSent24h: true,
      reminderSent1h: false,
      deletedAt: null,
      createdAt: '2026-09-15T14:20:00Z'
    },
    {
      id: 'apt-3',
      hospitalId: 'hosp-1',
      patientId: 'p-5',
      patientName: 'Amina Al-Mansoor',
      patientMrn: 'MC-2026-1244',
      doctorId: 'doc-2',
      doctorName: 'Dr. Arthur Vance, MD, PhD',
      department: 'Neurology',
      dateTime: '2026-09-20T11:30:00Z',
      durationMinutes: 45,
      reason: 'Follow-up on prophylactic CGRP inhibitor efficacy for migraine',
      type: 'TELEHEALTH',
      status: 'CONFIRMED',
      priority: 'NORMAL',
      room: 'Virtual Clinic Desk #4',
      reminderSent24h: true,
      reminderSent1h: false,
      deletedAt: null,
      createdAt: '2026-09-16T09:10:00Z'
    },
    {
      id: 'apt-4',
      hospitalId: 'hosp-1',
      patientId: 'p-6',
      patientName: 'David Kowalski',
      patientMrn: 'MC-2026-1302',
      doctorId: 'doc-6',
      doctorName: 'Dr. Robert Torres, MD, FACEP',
      department: 'Emergency Medicine',
      dateTime: '2026-09-20T03:00:00Z',
      durationMinutes: 60,
      reason: 'Acute crushing chest pain, diaphoresis, ST depression V3-V6',
      type: 'EMERGENCY',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      room: 'Resuscitation Bay 1',
      reminderSent24h: false,
      reminderSent1h: false,
      deletedAt: null,
      createdAt: '2026-09-20T02:10:00Z'
    },
    {
      id: 'apt-5',
      hospitalId: 'hosp-1',
      patientId: 'p-4',
      patientName: 'James O\'Connor',
      patientMrn: 'MC-2026-1180',
      doctorId: 'doc-4',
      doctorName: 'Dr. Gregory Thorne, MD, FACS',
      department: 'Orthopedics',
      dateTime: '2026-09-20T14:00:00Z',
      durationMinutes: 45,
      reason: 'Post-op L4-L5 disc decompression evaluation and wound check',
      type: 'IN_PERSON',
      status: 'CONFIRMED',
      priority: 'HIGH',
      room: 'Ortho Exam 204',
      reminderSent24h: true,
      reminderSent1h: false,
      deletedAt: null,
      createdAt: '2026-09-17T15:30:00Z'
    }
  ];

  medicalRecords: MedicalRecord[] = [
    {
      id: 'mr-1',
      hospitalId: 'hosp-1',
      patientId: 'p-1',
      patientMrn: 'MC-2026-0811',
      patientName: 'Eleanor Vance',
      doctorId: 'doc-1',
      doctorName: 'Dr. Evelyn Reed, MD, FACC',
      department: 'Cardiology',
      date: '2026-09-18T15:00:00Z',
      visitType: 'INPATIENT',
      chiefComplaint: 'Bilateral lower extremity edema, exertional dyspnea, elevated home BP 175/95',
      historyOfPresentIllness: '58 y/o female with known hypertension and diabetes presenting with 2-week progressive shortness of breath with mild orthopnea.',
      vitals: {
        bloodPressureSystolic: 158,
        bloodPressureDiastolic: 92,
        heartRate: 84,
        respiratoryRate: 18,
        temperatureCelsius: 36.8,
        oxygenSaturation: 97,
        weightKg: 78.5,
        heightCm: 165,
        bmi: 28.8,
        recordedAt: '2026-09-18T14:45:00Z'
      },
      diagnosisCodes: [
        { code: 'I10', description: 'Essential (primary) hypertension' },
        { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
        { code: 'I50.9', description: 'Heart failure, unspecified (mild diastolic dysfunction)' }
      ],
      treatmentPlan: 'Initiate loop diuretic challenge with Furosemide 40mg IV. Titrate Amlodipine to 10mg daily. Cardiac telemetry and strict fluid balance.',
      clinicalNotes: 'Cardiovascular exam revealed regular rhythm with S4 gallop. JVP normal. Lungs clear to auscultation bilaterally.',
      allergiesSnapshot: ['Penicillin', 'Sulfa drugs'],
      vaccinationHistory: ['COVID-19 Bivalent (2025)', 'Influenza (2025)', 'Pneumococcal PPSV23'],
      familyHistory: 'Father deceased at 62 from myocardial infarction; mother had hypertension and osteoporosis.',
      doctorDigitalSignature: 'Signed cryptographically by Dr. Evelyn Reed, MD (SHA256-RSA-84920)',
      prescriptions: [
        {
          id: 'rx-item-1',
          medicationName: 'Amlodipine Besylate',
          form: 'TABLET',
          dosage: '10mg',
          frequency: 'Once daily in morning',
          duration: '30 days',
          specialInstructions: 'Monitor blood pressure weekly; report peripheral edema',
          quantityPrescribed: 30,
          quantityDispensed: 30,
          status: 'DISPENSED'
        },
        {
          id: 'rx-item-2',
          medicationName: 'Metformin HCl ER',
          form: 'TABLET',
          dosage: '500mg',
          frequency: 'Twice daily with meals',
          duration: '60 days',
          specialInstructions: 'Take with food to minimize GI disturbance',
          quantityPrescribed: 60,
          quantityDispensed: 60,
          status: 'DISPENSED'
        }
      ],
      labOrderIds: ['lab-1', 'lab-2'],
      createdAt: '2026-09-18T16:00:00Z'
    },
    {
      id: 'mr-2',
      hospitalId: 'hosp-1',
      patientId: 'p-6',
      patientMrn: 'MC-2026-1302',
      patientName: 'David Kowalski',
      doctorId: 'doc-6',
      doctorName: 'Dr. Robert Torres, MD, FACEP',
      department: 'Emergency Medicine',
      date: '2026-09-20T02:30:00Z',
      visitType: 'EMERGENCY',
      chiefComplaint: 'Substernal chest pressure radiating to left jaw, diaphoresis, onset 45 min ago',
      historyOfPresentIllness: '65 y/o male with history of CAD presenting via ambulance with sudden crushing retrosternal pain while resting.',
      vitals: {
        bloodPressureSystolic: 142,
        bloodPressureDiastolic: 88,
        heartRate: 98,
        respiratoryRate: 22,
        temperatureCelsius: 37.1,
        oxygenSaturation: 94,
        weightKg: 89.0,
        heightCm: 178,
        bmi: 28.1,
        recordedAt: '2026-09-20T02:18:00Z'
      },
      diagnosisCodes: [
        { code: 'I21.4', description: 'Non-ST elevation (NSTEMI) myocardial infarction' },
        { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' }
      ],
      treatmentPlan: 'Dual antiplatelet therapy: Aspirin 325mg chewable administered. Atorvastatin 80mg oral. Sublingual nitroglycerin with pain relief. Emergent transfer to Cardiac Catheterization suite.',
      clinicalNotes: 'EKG demonstrates 2mm ST depression in V4-V6. Cardiac Troponin I markedly elevated at 1.82 ng/mL. Cardiology team notified.',
      allergiesSnapshot: ['Contrast Dye'],
      doctorDigitalSignature: 'Signed cryptographically by Dr. Robert Torres, MD (SHA256-RSA-55294)',
      prescriptions: [
        {
          id: 'rx-item-3',
          medicationName: 'Atorvastatin Calcium',
          form: 'TABLET',
          dosage: '80mg',
          frequency: 'Once daily at bedtime',
          duration: '30 days',
          quantityPrescribed: 30,
          quantityDispensed: 0,
          status: 'PRESCRIBED'
        }
      ],
      labOrderIds: ['lab-3'],
      createdAt: '2026-09-20T03:15:00Z'
    }
  ];

  prescriptions: Prescription[] = [
    {
      id: 'rx-doc-101',
      hospitalId: 'hosp-1',
      patientId: 'p-1',
      patientName: 'Eleanor Vance',
      patientMrn: 'MC-2026-0811',
      doctorId: 'doc-1',
      doctorName: 'Dr. Evelyn Reed, MD, FACC',
      doctorLicense: 'MD-NY-84920',
      items: [
        {
          id: 'rx-item-1',
          medicationName: 'Amlodipine Besylate',
          form: 'TABLET',
          dosage: '10mg',
          frequency: '1-0-0 (Morning)',
          duration: '30 days',
          specialInstructions: 'Take with full glass of water. Report ankle swelling.',
          quantityPrescribed: 30,
          quantityDispensed: 30,
          status: 'DISPENSED'
        },
        {
          id: 'rx-item-2',
          medicationName: 'Metformin HCl ER',
          form: 'TABLET',
          dosage: '500mg',
          frequency: '1-0-1 (With meals)',
          duration: '60 days',
          specialInstructions: 'Do not crush or chew extended-release tablets.',
          quantityPrescribed: 60,
          quantityDispensed: 60,
          status: 'DISPENSED'
        }
      ],
      digitalSignature: 'SIG-VERIFIED-EVELYN-REED-SHA256-492019A8',
      notes: 'Dispensed per hospital inpatient pharmacy standard protocol.',
      status: 'COMPLETED',
      createdAt: '2026-09-18T16:05:00Z',
      dispensedAt: '2026-09-18T16:45:00Z',
      dispensedBy: 'Pharmacist Sarah Jenkins, PharmD'
    },
    {
      id: 'rx-doc-102',
      hospitalId: 'hosp-1',
      patientId: 'p-3',
      patientName: 'Sophia Rodriguez',
      patientMrn: 'MC-2026-1022',
      doctorId: 'doc-3',
      doctorName: 'Dr. Maya Lin, MD, FAAP',
      doctorLicense: 'MD-NY-91823',
      items: [
        {
          id: 'rx-item-4',
          medicationName: 'Albuterol Sulfate Inhalation Aerosol',
          form: 'INHALER',
          dosage: '90mcg / puff',
          frequency: '2 puffs Q4-6H PRN wheeze',
          duration: 'As needed',
          specialInstructions: 'Use with pediatric spacer device. Rinse mouth after use.',
          quantityPrescribed: 1,
          quantityDispensed: 0,
          status: 'PRESCRIBED'
        },
        {
          id: 'rx-item-5',
          medicationName: 'Fluticasone Propionate Inhaler',
          form: 'INHALER',
          dosage: '44mcg / actuation',
          frequency: '1 puff BID',
          duration: '30 days',
          specialInstructions: 'Maintenance controller. Use daily morning and night.',
          quantityPrescribed: 1,
          quantityDispensed: 0,
          status: 'PRESCRIBED'
        }
      ],
      digitalSignature: 'SIG-VERIFIED-MAYA-LIN-SHA256-881290B3',
      notes: 'Patient father briefed on asthma action plan red zones.',
      status: 'PENDING_FULFILLMENT',
      createdAt: '2026-09-20T04:10:00Z'
    }
  ];

  labOrders: LabOrder[] = [
    {
      id: 'lab-1',
      orderNumber: 'LAB-2026-7701',
      hospitalId: 'hosp-1',
      patientId: 'p-1',
      patientName: 'Eleanor Vance',
      patientMrn: 'MC-2026-0811',
      doctorId: 'doc-1',
      doctorName: 'Dr. Evelyn Reed, MD, FACC',
      testCategory: 'CARDIOLOGY',
      testName: 'Comprehensive Cardiac Troponin & Biomarker Panel',
      priority: 'URGENT',
      status: 'APPROVED',
      sampleType: 'VENOUS_BLOOD',
      sampleCollectedAt: '2026-09-18T15:10:00Z',
      collectedBy: 'Nurse Jackson Vance, BSN',
      processedAt: '2026-09-18T15:45:00Z',
      processedBy: 'Lab Tech Jordan Kelly, MLS(ASCP)',
      results: [
        { parameter: 'High-Sensitivity Troponin I', resultValue: '0.012', unit: 'ng/mL', referenceRange: '0.000 - 0.034', flag: 'NORMAL' },
        { parameter: 'NT-proBNP', resultValue: '480', unit: 'pg/mL', referenceRange: '< 300', flag: 'HIGH' },
        { parameter: 'Creatine Kinase-MB', resultValue: '2.1', unit: 'ng/mL', referenceRange: '0.0 - 5.0', flag: 'NORMAL' }
      ],
      technicianNotes: 'Samples processed without hemolysis. High NT-proBNP consistent with mild congestive strain.',
      approvedAt: '2026-09-18T16:00:00Z',
      approvedBy: 'Dr. Harold Stone, MD (Pathologist)',
      approvalRemarks: 'Results reviewed and authorized for clinical release.',
      cost: 320,
      createdAt: '2026-09-18T15:00:00Z'
    },
    {
      id: 'lab-2',
      orderNumber: 'LAB-2026-7702',
      hospitalId: 'hosp-1',
      patientId: 'p-1',
      patientName: 'Eleanor Vance',
      patientMrn: 'MC-2026-0811',
      doctorId: 'doc-1',
      doctorName: 'Dr. Evelyn Reed, MD, FACC',
      testCategory: 'BIOCHEMISTRY',
      testName: 'Comprehensive Metabolic Panel (CMP) + HbA1c',
      priority: 'ROUTINE',
      status: 'APPROVED',
      sampleType: 'SERUM',
      sampleCollectedAt: '2026-09-18T15:12:00Z',
      collectedBy: 'Nurse Jackson Vance, BSN',
      processedAt: '2026-09-18T16:15:00Z',
      processedBy: 'Lab Tech Jordan Kelly, MLS(ASCP)',
      results: [
        { parameter: 'Serum Glucose (Fasting)', resultValue: '138', unit: 'mg/dL', referenceRange: '70 - 99', flag: 'HIGH' },
        { parameter: 'Hemoglobin A1c', resultValue: '7.4', unit: '%', referenceRange: '< 5.7', flag: 'HIGH' },
        { parameter: 'Serum Creatinine', resultValue: '0.94', unit: 'mg/dL', referenceRange: '0.59 - 1.04', flag: 'NORMAL' },
        { parameter: 'eGFR', resultValue: '72', unit: 'mL/min/1.73m2', referenceRange: '> 60', flag: 'NORMAL' },
        { parameter: 'Potassium', resultValue: '4.3', unit: 'mmol/L', referenceRange: '3.5 - 5.0', flag: 'NORMAL' }
      ],
      technicianNotes: 'Serum clear. Elevated glycohemoglobin noted.',
      approvedAt: '2026-09-18T16:30:00Z',
      approvedBy: 'Dr. Harold Stone, MD',
      cost: 180,
      createdAt: '2026-09-18T15:02:00Z'
    },
    {
      id: 'lab-3',
      orderNumber: 'LAB-2026-7703',
      hospitalId: 'hosp-1',
      patientId: 'p-6',
      patientMrn: 'MC-2026-1302',
      patientName: 'David Kowalski',
      doctorId: 'doc-6',
      doctorName: 'Dr. Robert Torres, MD, FACEP',
      testCategory: 'CARDIOLOGY',
      testName: 'STAT Cardiac Troponin I & Myoglobin Assay',
      priority: 'STAT',
      status: 'APPROVED',
      sampleType: 'VENOUS_BLOOD',
      sampleCollectedAt: '2026-09-20T02:22:00Z',
      collectedBy: 'Nurse Sarah Jenkins, RN',
      processedAt: '2026-09-20T02:40:00Z',
      processedBy: 'Lab Tech Elena Rostova, MLS',
      results: [
        { parameter: 'Troponin I (High Sens)', resultValue: '1.820', unit: 'ng/mL', referenceRange: '0.000 - 0.034', flag: 'CRITICAL' },
        { parameter: 'Myoglobin', resultValue: '142', unit: 'ng/mL', referenceRange: '28 - 72', flag: 'HIGH' },
        { parameter: 'Total CK', resultValue: '310', unit: 'U/L', referenceRange: '38 - 174', flag: 'HIGH' }
      ],
      technicianNotes: 'CRITICAL VALUE: Troponin I > 1.8 ng/mL phoned immediately to Dr. Torres at 02:42 AM.',
      approvedAt: '2026-09-20T02:45:00Z',
      approvedBy: 'Dr. Harold Stone, MD',
      approvalRemarks: 'Immediate clinical notification verified.',
      cost: 380,
      createdAt: '2026-09-20T02:20:00Z'
    },
    {
      id: 'lab-4',
      orderNumber: 'LAB-2026-7704',
      hospitalId: 'hosp-1',
      patientId: 'p-3',
      patientName: 'Sophia Rodriguez',
      patientMrn: 'MC-2026-1022',
      doctorId: 'doc-3',
      doctorName: 'Dr. Maya Lin, MD, FAAP',
      testCategory: 'HEMATOLOGY',
      testName: 'Complete Blood Count (CBC) with Automated Differential',
      priority: 'ROUTINE',
      status: 'SAMPLE_COLLECTED',
      sampleType: 'VENOUS_BLOOD',
      sampleCollectedAt: '2026-09-20T04:20:00Z',
      collectedBy: 'Nurse Jackson Vance, BSN',
      cost: 110,
      createdAt: '2026-09-20T04:05:00Z'
    },
    {
      id: 'lab-5',
      orderNumber: 'LAB-2026-7705',
      hospitalId: 'hosp-1',
      patientId: 'p-7',
      patientName: 'Zara Patel',
      patientMrn: 'MC-2026-1411',
      doctorId: 'doc-5',
      doctorName: 'Dr. Sarah Jenkins, MD',
      testCategory: 'HEMATOLOGY',
      testName: 'Iron Panel (Ferritin, TIBC, Serum Iron)',
      priority: 'ROUTINE',
      status: 'PENDING_APPROVAL',
      sampleType: 'SERUM',
      sampleCollectedAt: '2026-09-19T11:00:00Z',
      collectedBy: 'Phlebotomist Alan Wright',
      processedAt: '2026-09-19T13:30:00Z',
      processedBy: 'Lab Tech Jordan Kelly, MLS(ASCP)',
      results: [
        { parameter: 'Serum Ferritin', resultValue: '12', unit: 'ng/mL', referenceRange: '15 - 150', flag: 'LOW' },
        { parameter: 'Serum Iron', resultValue: '38', unit: 'ug/dL', referenceRange: '60 - 170', flag: 'LOW' },
        { parameter: 'Total Iron Binding Capacity (TIBC)', resultValue: '460', unit: 'ug/dL', referenceRange: '250 - 450', flag: 'HIGH' }
      ],
      technicianNotes: 'Microcytic hypochromic picture confirmed on peripheral smear.',
      cost: 190,
      createdAt: '2026-09-19T10:30:00Z'
    }
  ];

  medicineBatches: MedicineBatch[] = [
    {
      id: 'med-1',
      medicineId: 'm-amlodipine-10',
      medicineName: 'Amlodipine Besylate',
      category: 'ANTIHYPERTENSIVE',
      form: 'TABLET',
      strength: '10mg',
      batchNumber: 'BAT-AML-2025-01',
      manufacturingDate: '2025-01-10',
      expiryDate: '2027-01-10',
      quantityInStock: 480,
      reorderThreshold: 100,
      unitCost: 0.25,
      mrp: 1.50,
      rackLocation: 'A-04-R2',
      status: 'ACTIVE'
    },
    {
      id: 'med-2',
      medicineId: 'm-metformin-500',
      medicineName: 'Metformin HCl ER',
      category: 'ANTIDIABETIC',
      form: 'TABLET',
      strength: '500mg',
      batchNumber: 'BAT-MET-2024-09',
      manufacturingDate: '2024-09-15',
      expiryDate: '2026-11-15',
      quantityInStock: 620,
      reorderThreshold: 150,
      unitCost: 0.18,
      mrp: 1.20,
      rackLocation: 'B-02-R1',
      status: 'ACTIVE'
    },
    {
      id: 'med-3',
      medicineId: 'm-albuterol-inhaler',
      medicineName: 'Albuterol Sulfate Inhalation Aerosol',
      category: 'RESPIRATORY',
      form: 'INHALER',
      strength: '90mcg / actuation',
      batchNumber: 'BAT-ALB-2025-04',
      manufacturingDate: '2025-04-01',
      expiryDate: '2027-04-01',
      quantityInStock: 45,
      reorderThreshold: 20,
      unitCost: 12.00,
      mrp: 38.00,
      rackLocation: 'C-01-R3',
      status: 'ACTIVE'
    },
    {
      id: 'med-4',
      medicineId: 'm-atorvastatin-80',
      medicineName: 'Atorvastatin Calcium',
      category: 'CARDIOVASCULAR',
      form: 'TABLET',
      strength: '80mg',
      batchNumber: 'BAT-ATR-2025-02',
      manufacturingDate: '2025-02-18',
      expiryDate: '2027-02-18',
      quantityInStock: 210,
      reorderThreshold: 50,
      unitCost: 0.45,
      mrp: 2.80,
      rackLocation: 'A-06-R1',
      status: 'ACTIVE'
    },
    {
      id: 'med-5',
      medicineId: 'm-amoxicillin-500',
      medicineName: 'Amoxicillin Trihydrate',
      category: 'ANTIBIOTIC',
      form: 'CAPSULE',
      strength: '500mg',
      batchNumber: 'BAT-AMX-2023-11',
      manufacturingDate: '2023-11-05',
      expiryDate: '2025-11-05',
      quantityInStock: 12,
      reorderThreshold: 80,
      unitCost: 0.30,
      mrp: 1.95,
      rackLocation: 'D-03-R2',
      status: 'LOW_STOCK'
    },
    {
      id: 'med-6',
      medicineId: 'm-ceftriaxone-1g',
      medicineName: 'Ceftriaxone Sodium Injection',
      category: 'ANTIBIOTIC',
      form: 'INJECTION',
      strength: '1g vial',
      batchNumber: 'BAT-CFX-2024-03',
      manufacturingDate: '2024-03-10',
      expiryDate: '2026-03-10',
      quantityInStock: 85,
      reorderThreshold: 30,
      unitCost: 4.50,
      mrp: 18.00,
      rackLocation: 'Cold Storage Vault #2',
      status: 'ACTIVE'
    },
    {
      id: 'med-7',
      medicineId: 'm-paracetamol-500',
      medicineName: 'Acetaminophen / Paracetamol',
      category: 'ANALGESIC',
      form: 'TABLET',
      strength: '500mg',
      batchNumber: 'BAT-PCM-2024-06',
      manufacturingDate: '2024-06-01',
      expiryDate: '2026-06-01',
      quantityInStock: 1400,
      reorderThreshold: 200,
      unitCost: 0.05,
      mrp: 0.40,
      rackLocation: 'E-01-R1',
      status: 'ACTIVE'
    }
  ];

  beds: Bed[] = [
    { id: 'b-1', hospitalId: 'hosp-1', bedNumber: 'ICU-01', ward: 'ICU', floor: 3, dailyRate: 1500, status: 'AVAILABLE' },
    { id: 'b-2', hospitalId: 'hosp-1', bedNumber: 'ICU-02', ward: 'ICU', floor: 3, dailyRate: 1500, status: 'AVAILABLE' },
    { id: 'b-3', hospitalId: 'hosp-1', bedNumber: 'ICU-03', ward: 'ICU', floor: 3, dailyRate: 1500, status: 'CLEANING' },
    { 
      id: 'b-4', 
      hospitalId: 'hosp-1', 
      bedNumber: 'ICU-04', 
      ward: 'ICU', 
      floor: 3, 
      dailyRate: 1500,
      status: 'OCCUPIED', 
      patientId: 'p-2', 
      patientName: 'Marcus Chen', 
      patientMrn: 'MC-2026-0945', 
      admittedAt: '2026-09-19T08:15:00Z', 
      attendingDoctor: 'Dr. Evelyn Reed, MD, FACC' 
    },
    { id: 'b-5', hospitalId: 'hosp-1', bedNumber: 'GW-A-101', ward: 'GENERAL_WARD_A', floor: 2, dailyRate: 450, status: 'AVAILABLE' },
    { 
      id: 'b-6', 
      hospitalId: 'hosp-1', 
      bedNumber: 'GW-A-102', 
      ward: 'GENERAL_WARD_A', 
      floor: 2, 
      dailyRate: 450,
      status: 'OCCUPIED', 
      patientId: 'p-1', 
      patientName: 'Eleanor Vance', 
      patientMrn: 'MC-2026-0811', 
      admittedAt: '2026-09-18T14:30:00Z', 
      attendingDoctor: 'Dr. Evelyn Reed, MD, FACC' 
    },
    { id: 'b-7', hospitalId: 'hosp-1', bedNumber: 'GW-A-103', ward: 'GENERAL_WARD_A', floor: 2, dailyRate: 450, status: 'AVAILABLE' },
    { id: 'b-8', hospitalId: 'hosp-1', bedNumber: 'GW-A-104', ward: 'GENERAL_WARD_A', floor: 2, dailyRate: 450, status: 'MAINTENANCE' },
    { id: 'b-9', hospitalId: 'hosp-1', bedNumber: 'GW-B-201', ward: 'GENERAL_WARD_B', floor: 2, dailyRate: 450, status: 'AVAILABLE' },
    { id: 'b-10', hospitalId: 'hosp-1', bedNumber: 'GW-B-202', ward: 'GENERAL_WARD_B', floor: 2, dailyRate: 450, status: 'AVAILABLE' },
    { id: 'b-11', hospitalId: 'hosp-1', bedNumber: 'PED-01', ward: 'PEDIATRICS', floor: 4, dailyRate: 600, status: 'AVAILABLE' },
    { id: 'b-12', hospitalId: 'hosp-1', bedNumber: 'PED-02', ward: 'PEDIATRICS', floor: 4, dailyRate: 600, status: 'AVAILABLE' },
    { id: 'b-13', hospitalId: 'hosp-1', bedNumber: 'SURG-01', ward: 'SURGICAL_RECOVERY', floor: 5, dailyRate: 1200, status: 'AVAILABLE' },
    { 
      id: 'b-14', 
      hospitalId: 'hosp-1', 
      bedNumber: 'SURG-02', 
      ward: 'SURGICAL_RECOVERY', 
      floor: 5, 
      dailyRate: 1200,
      status: 'OCCUPIED', 
      patientId: 'p-4', 
      patientName: 'James O\'Connor', 
      patientMrn: 'MC-2026-1180', 
      admittedAt: '2026-09-17T11:00:00Z', 
      attendingDoctor: 'Dr. Gregory Thorne, MD, FACS' 
    },
    { id: 'b-15', hospitalId: 'hosp-1', bedNumber: 'SURG-03', ward: 'SURGICAL_RECOVERY', floor: 5, dailyRate: 1200, status: 'AVAILABLE' },
    { id: 'b-16', hospitalId: 'hosp-1', bedNumber: 'ER-BAY-01', ward: 'EMERGENCY', floor: 1, dailyRate: 850, status: 'AVAILABLE' },
    { 
      id: 'b-17', 
      hospitalId: 'hosp-1', 
      bedNumber: 'ER-BAY-02', 
      ward: 'EMERGENCY', 
      floor: 1, 
      dailyRate: 850,
      status: 'OCCUPIED', 
      patientId: 'p-6', 
      patientName: 'David Kowalski', 
      patientMrn: 'MC-2026-1302', 
      admittedAt: '2026-09-20T02:15:00Z', 
      attendingDoctor: 'Dr. Robert Torres, MD, FACEP' 
    },
    { id: 'b-18', hospitalId: 'hosp-1', bedNumber: 'ER-BAY-03', ward: 'EMERGENCY', floor: 1, dailyRate: 850, status: 'AVAILABLE' },
    { id: 'b-19', hospitalId: 'hosp-1', bedNumber: 'ER-BAY-04', ward: 'EMERGENCY', floor: 1, dailyRate: 850, status: 'AVAILABLE' },
    { id: 'b-20', hospitalId: 'hosp-1', bedNumber: 'CCU-01', ward: 'CARDIAC_CARE', floor: 4, dailyRate: 1650, status: 'AVAILABLE' }
  ];

  invoices: Invoice[] = [
    {
      id: 'inv-1',
      hospitalId: 'hosp-1',
      invoiceNumber: 'INV-2026-8801',
      patientId: 'p-1',
      patientName: 'Eleanor Vance',
      patientMrn: 'MC-2026-0811',
      items: [
        { id: 'item-1', description: 'Inpatient Room - General Ward (2 Nights)', category: 'ROOM_BED', quantity: 2, unitPrice: 450, amount: 900 },
        { id: 'item-2', description: 'Cardiology Specialist Comprehensive Consult', category: 'CONSULTATION', quantity: 1, unitPrice: 450, amount: 450 },
        { id: 'item-3', description: 'Transthoracic 2D Echocardiogram with Doppler', category: 'LAB_TEST', quantity: 1, unitPrice: 850, amount: 850 },
        { id: 'item-4', description: 'Cardiac Troponin & Biomarker Lab Panel', category: 'LAB_TEST', quantity: 1, unitPrice: 320, amount: 320 },
        { id: 'item-5', description: 'Inpatient Pharmacy Medications (Amlodipine, Metformin)', category: 'PHARMACY', quantity: 1, unitPrice: 115, amount: 115 }
      ],
      totalAmount: 2635,
      insuranceCoveredAmount: 2108,
      insuranceCoverageRate: 80,
      patientPayable: 527,
      status: 'CLAIM_SUBMITTED',
      insuranceProvider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS-9843210',
      dueDate: '2026-10-15',
      createdAt: '2026-09-19T18:00:00Z'
    },
    {
      id: 'inv-2',
      hospitalId: 'hosp-1',
      invoiceNumber: 'INV-2026-8802',
      patientId: 'p-4',
      patientName: 'James O\'Connor',
      patientMrn: 'MC-2026-1180',
      items: [
        { id: 'item-6', description: 'Lumbar Microdiscectomy Operating Suite & Anesthesia', category: 'SURGERY', quantity: 1, unitPrice: 8200, amount: 8200 },
        { id: 'item-7', description: 'Surgical Recovery Inpatient Care (3 Days)', category: 'ROOM_BED', quantity: 3, unitPrice: 1200, amount: 3600 },
        { id: 'item-8', description: 'Post-op Physical Therapy & Mobility Training', category: 'CONSULTATION', quantity: 1, unitPrice: 480, amount: 480 },
        { id: 'item-9', description: 'Surgical Dressings & Analgesic Infusion', category: 'PHARMACY', quantity: 1, unitPrice: 420, amount: 420 }
      ],
      totalAmount: 12700,
      insuranceCoveredAmount: 10800,
      insuranceCoverageRate: 85,
      patientPayable: 1900,
      status: 'PENDING',
      insuranceProvider: 'Cigna Health',
      policyNumber: 'CIG-129840',
      dueDate: '2026-10-20',
      createdAt: '2026-09-18T16:45:00Z'
    },
    {
      id: 'inv-3',
      hospitalId: 'hosp-1',
      invoiceNumber: 'INV-2026-8799',
      patientId: 'p-7',
      patientName: 'Zara Patel',
      patientMrn: 'MC-2026-1411',
      items: [
        { id: 'item-10', description: 'Outpatient Hematology Consultation', category: 'CONSULTATION', quantity: 1, unitPrice: 280, amount: 280 },
        { id: 'item-11', description: 'Ferritin & Iron Saturation Diagnostics', category: 'LAB_TEST', quantity: 1, unitPrice: 190, amount: 190 },
        { id: 'item-12', description: 'Intravenous Iron Infusion (Ferric Carboxymaltose)', category: 'PHARMACY', quantity: 1, unitPrice: 560, amount: 560 }
      ],
      totalAmount: 1030,
      insuranceCoveredAmount: 850,
      insuranceCoverageRate: 82,
      patientPayable: 180,
      status: 'PAID',
      insuranceProvider: 'Anthem Blue Cross',
      policyNumber: 'ANT-554109',
      paymentGateway: 'STRIPE',
      transactionId: 'pi_3MtwLwLkdIwHu7ix28aVLbkq',
      dueDate: '2026-09-15',
      createdAt: '2026-09-08T10:30:00Z',
      paidAt: '2026-09-12T14:15:00Z',
      paymentMethod: 'CREDIT_CARD'
    }
  ];

  notifications: Notification[] = [
    {
      id: 'notif-1',
      hospitalId: 'hosp-1',
      recipientId: 'p-1',
      recipientName: 'Eleanor Vance',
      recipientRole: 'PATIENT',
      channel: 'EMAIL',
      eventType: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: 'Your Cardiology consultation with Dr. Evelyn Reed is confirmed for Sep 20, 09:30 AM in Cardio Suite 3B.',
      isRead: true,
      status: 'DELIVERED',
      createdAt: '2026-09-18T10:05:00Z'
    },
    {
      id: 'notif-2',
      hospitalId: 'hosp-1',
      recipientId: 'doc-6',
      recipientName: 'Dr. Robert Torres, MD',
      recipientRole: 'DOCTOR',
      channel: 'SMS',
      eventType: 'EMERGENCY_ALERT',
      title: 'CRITICAL Emergency Admission',
      message: 'Trauma arrival: David Kowalski (MRN: MC-2026-1302) assigned to Resuscitation Bay 1 with acute chest pain.',
      isRead: true,
      status: 'DELIVERED',
      createdAt: '2026-09-20T02:16:00Z'
    },
    {
      id: 'notif-3',
      hospitalId: 'hosp-1',
      recipientId: 'doc-1',
      recipientName: 'Dr. Evelyn Reed, MD',
      recipientRole: 'DOCTOR',
      channel: 'IN_APP',
      eventType: 'LAB_APPROVED',
      title: 'Lab Report Authorized',
      message: 'Comprehensive Cardiac Troponin panel for Eleanor Vance has been finalized and signed by Dr. Harold Stone.',
      isRead: false,
      status: 'DELIVERED',
      createdAt: '2026-09-18T16:02:00Z'
    },
    {
      id: 'notif-4',
      hospitalId: 'hosp-1',
      recipientId: 'u-pharmacist',
      recipientName: 'Pharmacy Dispensary',
      recipientRole: 'PHARMACIST',
      channel: 'IN_APP',
      eventType: 'LOW_STOCK',
      title: 'Low Medicine Inventory Alert',
      message: 'Amoxicillin Trihydrate 500mg has reached critical threshold (12 units remaining). Immediate reorder required.',
      isRead: false,
      status: 'DELIVERED',
      createdAt: '2026-09-20T03:00:00Z'
    },
    {
      id: 'notif-5',
      hospitalId: 'hosp-1',
      recipientId: 'p-3',
      recipientName: 'Sophia Rodriguez (Parents)',
      recipientRole: 'PATIENT',
      channel: 'SMS',
      eventType: 'PRESCRIPTION_READY',
      title: 'Prescription Ready at Pharmacy',
      message: 'Prescription for Albuterol Sulfate Inhaler is ready for pick-up at MedCore Outpatient Dispensary.',
      isRead: false,
      status: 'DELIVERED',
      createdAt: '2026-09-20T04:15:00Z'
    }
  ];

  auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      hospitalId: 'hosp-1',
      timestamp: '2026-09-20T04:15:20Z',
      userName: 'Dr. Evelyn Reed, MD',
      userRole: 'DOCTOR',
      action: 'UPDATE',
      resourceType: 'MEDICAL_RECORD',
      details: 'Updated vitals and prescribed Amlodipine for Eleanor Vance (MRN: MC-2026-0811)',
      ipAddress: '10.240.12.84'
    },
    {
      id: 'log-2',
      hospitalId: 'hosp-1',
      timestamp: '2026-09-20T03:45:11Z',
      userName: 'Nurse Sarah Jenkins, RN',
      userRole: 'NURSE',
      action: 'UPDATE',
      resourceType: 'BED',
      details: 'Assigned bed ER-BAY-02 to emergency triage admission David Kowalski (MRN: MC-2026-1302)',
      ipAddress: '10.240.12.91'
    },
    {
      id: 'log-3',
      hospitalId: 'hosp-1',
      timestamp: '2026-09-20T02:45:00Z',
      userName: 'Dr. Harold Stone, MD',
      userRole: 'LAB_TECHNICIAN',
      action: 'APPROVE',
      resourceType: 'LAB_ORDER',
      details: 'Approved STAT cardiac troponin assay for David Kowalski (Critical flag notified)',
      ipAddress: '10.240.12.110'
    },
    {
      id: 'log-4',
      hospitalId: 'hosp-1',
      timestamp: '2026-09-20T02:20:05Z',
      userName: 'Dr. Robert Torres, MD',
      userRole: 'DOCTOR',
      action: 'CREATE',
      resourceType: 'MEDICAL_RECORD',
      details: 'Logged acute emergency admission consultation for David Kowalski',
      ipAddress: '10.240.12.105'
    },
    {
      id: 'log-5',
      hospitalId: 'hosp-1',
      timestamp: '2026-09-19T18:05:00Z',
      userName: 'Marcus Sterling, CPB',
      userRole: 'ACCOUNTANT',
      action: 'CREATE',
      resourceType: 'BILLING',
      details: 'Generated and submitted electronic claim INV-2026-8801 to BCBS for $2,635.00',
      ipAddress: '10.240.14.22'
    }
  ];

  currentUser: UserProfile = {
    id: 'usr-1',
    hospitalId: 'hosp-1',
    name: 'Dr. Priya Sharma, MD, FACC',
    email: 'priya.sharma@medcore.hospital',
    role: 'DOCTOR',
    title: 'Chief of Cardiology & Attending Physician',
    department: 'Cardiology',
    phone: '+1 (555) 100-2001'
  };

  // ----------------------------------------------------
  // Helper Methods & Multi-Tenancy
  // ----------------------------------------------------

  setActiveHospital(hospitalId: string) {
    const found = this.hospitals.find(h => h.id === hospitalId);
    if (found) {
      this.activeHospitalId = hospitalId;
      this.currentUser.hospitalId = hospitalId;
      return found;
    }
    return this.hospitals[0];
  }

  getStats(hospitalId?: string): HospitalStats {
    const targetHospId = hospitalId || this.activeHospitalId;
    const hosp = this.hospitals.find(h => h.id === targetHospId);

    const bedsInHosp = this.beds.filter(b => b.hospitalId === targetHospId);
    const occupied = bedsInHosp.filter(b => b.status === 'OCCUPIED').length;
    const totalBeds = bedsInHosp.length || 1;
    const occupancyRate = Math.round((occupied / totalBeds) * 100);

    const patientsInHosp = this.patients.filter(p => p.hospitalId === targetHospId && !p.deletedAt);
    const doctorsInHosp = this.doctors.filter(d => d.hospitalId === targetHospId && !d.deletedAt);
    const appointmentsInHosp = this.appointments.filter(a => a.hospitalId === targetHospId && !a.deletedAt);
    const invoicesInHosp = this.invoices.filter(i => i.hospitalId === targetHospId);
    const labsInHosp = this.labOrders.filter(l => l.hospitalId === targetHospId);

    const todayRev = invoicesInHosp
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const lowStockCount = this.medicineBatches.filter(m => m.quantityInStock <= m.reorderThreshold).length;
    const pendingLabs = labsInHosp.filter(l => l.status === 'ORDERED' || l.status === 'SAMPLE_COLLECTED' || l.status === 'PROCESSING' || l.status === 'PENDING_APPROVAL').length;

    return {
      hospitalName: hosp?.name || 'MedCore Metropolitan',
      totalPatients: patientsInHosp.length,
      activeInpatients: patientsInHosp.filter(p => p.status === 'INPATIENT').length,
      totalDoctors: doctorsInHosp.length,
      occupiedBeds: occupied,
      totalBeds: totalBeds,
      bedOccupancyRate: occupancyRate,
      todayAppointmentsCount: appointmentsInHosp.length,
      todayRevenue: todayRev || 3850,
      monthlyRevenue: 184500,
      pendingClaimsCount: invoicesInHosp.filter(i => i.status === 'CLAIM_SUBMITTED' || i.status === 'PENDING').length,
      criticalAlertsCount: 2,
      emergencyCount: patientsInHosp.filter(p => p.status === 'EMERGENCY').length,
      pendingLabOrdersCount: pendingLabs,
      lowStockMedicinesCount: lowStockCount
    };
  }

  // Double-booking conflict detector (Page 12 spec)
  checkAppointmentConflict(params: {
    doctorId: string;
    patientId: string;
    dateTime: string;
    durationMinutes: number;
    excludeId?: string;
  }): { hasConflict: boolean; reason?: string } {
    const newStart = new Date(params.dateTime).getTime();
    const newEnd = newStart + (params.durationMinutes || 30) * 60 * 1000;

    for (const apt of this.appointments) {
      if (apt.deletedAt || apt.status === 'CANCELLED') continue;
      if (params.excludeId && apt.id === params.excludeId) continue;

      const existingStart = new Date(apt.dateTime).getTime();
      const existingEnd = existingStart + (apt.durationMinutes || 30) * 60 * 1000;

      // Overlap formula: (startA < endB) and (endA > startB)
      const overlaps = newStart < existingEnd && newEnd > existingStart;

      if (overlaps) {
        if (apt.doctorId === params.doctorId) {
          return {
            hasConflict: true,
            reason: `Doctor ${apt.doctorName} already has an appointment (${apt.patientName}) at ${new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
          };
        }
        if (apt.patientId === params.patientId) {
          return {
            hasConflict: true,
            reason: `Patient ${apt.patientName} is already scheduled for an appointment at ${new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
          };
        }
      }
    }

    return { hasConflict: false };
  }

  // Notification Dispatcher (Page 15 spec: One event -> Multi-channel dispatch)
  dispatchNotification(event: {
    eventType: Notification['eventType'];
    title: string;
    message: string;
    recipientId: string;
    recipientName: string;
    recipientRole: UserRole;
    channels: Notification['channel'][];
  }) {
    const created: Notification[] = [];
    for (const ch of event.channels) {
      const notif: Notification = {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        hospitalId: this.activeHospitalId,
        recipientId: event.recipientId,
        recipientName: event.recipientName,
        recipientRole: event.recipientRole,
        channel: ch,
        eventType: event.eventType,
        title: event.title,
        message: event.message,
        isRead: false,
        status: 'DELIVERED',
        createdAt: new Date().toISOString()
      };
      this.notifications.unshift(notif);
      created.push(notif);
    }
    return created;
  }

  // Pharmacy FIFO Dispensing Logic (Page 14 spec)
  dispensePrescription(prescriptionId: string, pharmacistName: string): { success: boolean; message: string; dispensedItems: any[] } {
    const rx = this.prescriptions.find(p => p.id === prescriptionId);
    if (!rx) return { success: false, message: 'Prescription not found', dispensedItems: [] };

    const dispensedItems = [];
    for (const item of rx.items) {
      // Find matching medicine batch with FIFO (earliest expiry first)
      const batches = this.medicineBatches
        .filter(b => b.medicineName.toLowerCase().includes(item.medicationName.toLowerCase().split(' ')[0]))
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      if (batches.length === 0) {
        continue;
      }

      const activeBatch = batches.find(b => new Date(b.expiryDate).getTime() > Date.now() && b.quantityInStock > 0);
      if (!activeBatch) {
        continue;
      }

      const qtyPrescribed = item.quantityPrescribed ?? 10;
      const toDeduct = Math.min(activeBatch.quantityInStock, qtyPrescribed);
      activeBatch.quantityInStock -= toDeduct;
      item.quantityDispensed = (item.quantityDispensed || 0) + toDeduct;
      item.status = item.quantityDispensed >= qtyPrescribed ? 'DISPENSED' : 'PARTIALLY_DISPENSED';

      if (activeBatch.quantityInStock <= activeBatch.reorderThreshold) {
        activeBatch.status = 'LOW_STOCK';
        // Dispatch low stock notification
        this.dispatchNotification({
          eventType: 'LOW_STOCK',
          title: `Low Stock Alert: ${activeBatch.medicineName}`,
          message: `Batch ${activeBatch.batchNumber} has only ${activeBatch.quantityInStock} units remaining.`,
          recipientId: 'pharmacy-team',
          recipientName: 'Pharmacy Team',
          recipientRole: 'PHARMACIST',
          channels: ['IN_APP', 'EMAIL']
        });
      }

      dispensedItems.push({
        medicine: activeBatch.medicineName,
        batchNumber: activeBatch.batchNumber,
        qty: toDeduct,
        remainingInStock: activeBatch.quantityInStock
      });
    }

    const allDispensed = rx.items.every(i => i.status === 'DISPENSED');
    rx.status = allDispensed ? 'COMPLETED' : 'PARTIALLY_FULFILLED';
    rx.dispensedAt = new Date().toISOString();
    rx.dispensedBy = pharmacistName;

    // Dispatch notification to patient that prescription is fulfilled
    this.dispatchNotification({
      eventType: 'PRESCRIPTION_READY',
      title: 'Prescription Ready for Pick-up',
      message: `Your prescription #${rx.id} has been dispensed and is ready at the pharmacy desk.`,
      recipientId: rx.patientId,
      recipientName: rx.patientName,
      recipientRole: 'PATIENT',
      channels: ['SMS', 'IN_APP']
    });

    this.logAction(pharmacistName, 'PHARMACIST', 'DISPENSE', 'PHARMACY', `Dispensed prescription #${rx.id} for ${rx.patientName}`);

    return { success: true, message: 'Prescription dispensed successfully via FIFO', dispensedItems };
  }

  logAction(userName: string, userRole: UserRole, action: AuditLog['action'], resourceType: AuditLog['resourceType'], details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      hospitalId: this.activeHospitalId,
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      resourceType,
      details,
      ipAddress: '10.240.12.' + (10 + Math.floor(Math.random() * 80))
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }
    return log;
  }
}

export const db = new HospitalDatabase();
