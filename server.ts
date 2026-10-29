import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { analyzeClinicalCase, checkDrugSafety, generateDischargeSummary } from './server/gemini';
import { openApiSpec, getSwaggerHtml } from './server/swagger';
import { systemBlueprintData } from './server/blueprint';
import { runSystemVerificationSuite } from './server/testRunner';
import { 
  Patient, 
  Appointment, 
  MedicalRecord, 
  Invoice, 
  LabOrder, 
  Prescription, 
  MedicineBatch,
  UserRole, 
  UserProfile 
} from './src/types';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger for HIPAA audit trail simulation
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') && req.method !== 'GET') {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // ==========================================
  // REST APIS
  // ==========================================

  // 1. Health & System Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      service: 'MedCore Hospital Management System API',
      database: 'Multi-Tenant PostgreSQL + Prisma Model (In-Memory Engine)',
      geminiAi: Boolean(process.env.GEMINI_API_KEY) ? 'configured' : 'fallback-active',
      activeHospital: db.hospitals.find(h => h.id === db.activeHospitalId)?.name
    });
  });

  // Swagger Documentation Endpoints (Page 17 Spec)
  app.get('/api/docs/openapi.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(openApiSpec);
  });

  app.get('/api/docs', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(getSwaggerHtml());
  });

  // System Architecture Blueprint & 20-Step Order Specification
  app.get('/api/system/blueprint', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: systemBlueprintData,
      message: 'MedCore HMS Enterprise Architecture & 20-Step Specification Blueprint'
    });
  });

  // 6-Point Security & Integrity Test Suite (Specification Step 17)
  app.all('/api/system/run-verification-tests', async (req: Request, res: Response) => {
    try {
      const suiteResults = await runSystemVerificationSuite();
      db.logAction(
        db.currentUser.name,
        db.currentUser.role,
        'READ',
        'AUTH',
        `Executed 6-Point System Verification Suite: ${suiteResults.overallStatus} (${suiteResults.passedTests}/${suiteResults.totalTests} passed)`
      );
      res.json({
        success: true,
        data: suiteResults,
        message: 'System Verification Suite completed'
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'TEST_SUITE_FAILURE',
          message: err.message || 'Error executing verification test suite'
        }
      });
    }
  });

  // 2. Multi-Tenant Hospitals
  app.get('/api/hospitals', (req: Request, res: Response) => {
    res.json({
      activeHospitalId: db.activeHospitalId,
      hospitals: db.hospitals
    });
  });

  app.post('/api/hospitals/switch', (req: Request, res: Response) => {
    const { hospitalId } = req.body;
    const switched = db.setActiveHospital(hospitalId);
    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'AUTH', `Switched tenant hospital to ${switched.name}`);
    res.json({ success: true, hospital: switched });
  });

  // 3. Overview Statistics
  app.get('/api/stats/overview', (req: Request, res: Response) => {
    const stats = db.getStats();
    res.json(stats);
  });

  // 4. Patients REST API (with soft delete support)
  app.get('/api/patients', (req: Request, res: Response) => {
    const { search, status, bloodGroup } = req.query;
    let list = db.patients.filter(p => !p.deletedAt && p.hospitalId === db.activeHospitalId);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(p => p.status === status);
    }

    if (bloodGroup && typeof bloodGroup === 'string' && bloodGroup !== 'ALL') {
      list = list.filter(p => p.bloodGroup === bloodGroup);
    }

    if (req.query.page || req.query.limit || req.headers['x-api-format'] === 'contract') {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginated = list.slice((page - 1) * limit, page * limit);
      return res.json({
        success: true,
        data: paginated,
        message: 'OK',
        page,
        limit,
        total,
        totalPages
      });
    }

    res.json(list);
  });

  app.get('/api/patients/:id', (req: Request, res: Response) => {
    const patient = db.patients.find(p => (p.id === req.params.id || p.mrn === req.params.id) && !p.deletedAt);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Attach related records and appointments
    const appointments = db.appointments.filter(a => a.patientId === patient.id && !a.deletedAt);
    const records = db.medicalRecords.filter(r => r.patientId === patient.id);
    const invoices = db.invoices.filter(i => i.patientId === patient.id);
    const labOrders = db.labOrders.filter(l => l.patientId === patient.id);
    const prescriptions = db.prescriptions.filter(rx => rx.patientId === patient.id);
    const assignedBedDetails = db.beds.find(b => b.patientId === patient.id);

    db.logAction(db.currentUser.name, db.currentUser.role, 'READ', 'PATIENT', `Viewed chart for patient ${patient.firstName} ${patient.lastName} (MRN: ${patient.mrn})`);

    res.json({
      ...patient,
      appointments,
      records,
      invoices,
      labOrders,
      prescriptions,
      assignedBedDetails
    });
  });

  app.post('/api/patients', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.firstName || !body.lastName || !body.phone) {
      return res.status(400).json({ error: 'firstName, lastName, and phone are mandatory' });
    }

    const count = db.patients.length + 1;
    const mrn = `MC-2026-${String(count).padStart(4, '0')}`;

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      mrn,
      firstName: body.firstName,
      lastName: body.lastName,
      dob: body.dob || '1990-01-01',
      gender: body.gender || 'OTHER',
      bloodGroup: body.bloodGroup || 'O+',
      phone: body.phone,
      email: body.email || `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}@example.com`,
      address: body.address || 'Standard Registered Address',
      emergencyContact: body.emergencyContact || {
        name: 'Emergency Contact',
        relationship: 'Guardian',
        phone: body.phone
      },
      allergies: body.allergies || [],
      chronicConditions: body.chronicConditions || [],
      insuranceProvider: body.insuranceProvider || 'Direct Self-Pay',
      policyNumber: body.policyNumber || 'SELF-PAY',
      status: body.status || 'OUTPATIENT',
      deletedAt: null,
      createdAt: new Date().toISOString()
    };

    db.patients.unshift(newPatient);
    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'PATIENT', `Registered new patient ${newPatient.firstName} ${newPatient.lastName} with MRN: ${newPatient.mrn}`);

    res.status(201).json(newPatient);
  });

  app.put('/api/patients/:id', (req: Request, res: Response) => {
    const idx = db.patients.findIndex(p => p.id === req.params.id && !p.deletedAt);
    if (idx === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    db.patients[idx] = { ...db.patients[idx], ...req.body };
    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'PATIENT', `Updated demographic/clinical profile for ${db.patients[idx].firstName} ${db.patients[idx].lastName}`);

    res.json(db.patients[idx]);
  });

  app.delete('/api/patients/:id', (req: Request, res: Response) => {
    const patient = db.patients.find(p => p.id === req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    // Soft delete (deletedAt) per specification Page 9
    patient.deletedAt = new Date().toISOString();
    db.logAction(db.currentUser.name, db.currentUser.role, 'DELETE', 'PATIENT', `Archived patient file ${patient.mrn} (Soft Deleted)`);
    res.json({ message: 'Patient archived successfully (soft deleted)', id: req.params.id });
  });

  // 5. Appointments & Conflict Detection (Page 12 spec)
  app.post('/api/appointments/check-conflict', (req: Request, res: Response) => {
    const { doctorId, patientId, dateTime, durationMinutes, excludeId } = req.body;
    if (!doctorId || !patientId || !dateTime) {
      return res.status(400).json({ error: 'doctorId, patientId, and dateTime are required' });
    }
    const conflict = db.checkAppointmentConflict({
      doctorId,
      patientId,
      dateTime,
      durationMinutes: durationMinutes || 30,
      excludeId
    });
    res.json(conflict);
  });

  app.get('/api/appointments', (req: Request, res: Response) => {
    const { status, doctorId, patientId } = req.query;
    let list = db.appointments.filter(a => !a.deletedAt && a.hospitalId === db.activeHospitalId);

    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(a => a.status === status);
    }
    if (doctorId && typeof doctorId === 'string') {
      list = list.filter(a => a.doctorId === doctorId);
    }
    if (patientId && typeof patientId === 'string') {
      list = list.filter(a => a.patientId === patientId);
    }

    res.json(list);
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.doctorId || !body.dateTime) {
      return res.status(400).json({ error: 'patientId, doctorId, and dateTime are required' });
    }

    // Run double-booking conflict detection
    const conflict = db.checkAppointmentConflict({
      doctorId: body.doctorId,
      patientId: body.patientId,
      dateTime: body.dateTime,
      durationMinutes: body.durationMinutes || 30
    });

    if (conflict.hasConflict) {
      return res.status(409).json({ 
        success: false,
        error: {
          code: 'SLOT_UNAVAILABLE',
          message: conflict.reason || 'This slot was just booked by another patient.'
        }
      });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    const doctor = db.doctors.find(d => d.id === body.doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ error: 'Referenced patient or doctor not found' });
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      dateTime: body.dateTime,
      durationMinutes: body.durationMinutes || 30,
      reason: body.reason || 'General Clinical Consultation',
      type: body.type || 'IN_PERSON',
      status: body.status || 'CONFIRMED',
      priority: body.priority || 'NORMAL',
      room: body.room || `${doctor.department} Room ${Math.floor(100 + Math.random() * 50)}`,
      notes: body.notes || '',
      reminderSent24h: true,
      reminderSent1h: false,
      deletedAt: null,
      createdAt: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);

    // Auto-dispatch confirmation notifications across channels (Email + SMS + In-App per Page 15)
    db.dispatchNotification({
      eventType: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: `Appointment with ${doctor.name} confirmed for ${new Date(body.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} in ${newAppointment.room}.`,
      recipientId: patient.id,
      recipientName: `${patient.firstName} ${patient.lastName}`,
      recipientRole: 'PATIENT',
      channels: ['EMAIL', 'SMS', 'IN_APP']
    });

    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'APPOINTMENT', `Booked appointment for ${patient.firstName} ${patient.lastName} with ${doctor.name} at ${newAppointment.dateTime}`);

    res.status(201).json(newAppointment);
  });

  app.patch('/api/appointments/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const apt = db.appointments.find(a => a.id === req.params.id);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    apt.status = status;
    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'APPOINTMENT', `Transitioned appointment #${apt.id} status to ${status}`);

    res.json(apt);
  });

  // 6. Medical Records (EMR)
  app.get('/api/records', (req: Request, res: Response) => {
    const { patientId } = req.query;
    let list = db.medicalRecords.filter(r => r.hospitalId === db.activeHospitalId);
    if (patientId && typeof patientId === 'string') {
      list = list.filter(r => r.patientId === patientId);
    }
    res.json(list);
  });

  app.post('/api/records', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.chiefComplaint) {
      return res.status(400).json({ error: 'patientId and chiefComplaint are required' });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const newRecord: MedicalRecord = {
      id: `mr-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      patientId: patient.id,
      patientMrn: patient.mrn,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: body.doctorId || db.currentUser.id,
      doctorName: body.doctorName || db.currentUser.name,
      department: body.department || db.currentUser.department,
      date: new Date().toISOString(),
      visitType: body.visitType || 'OUTPATIENT',
      chiefComplaint: body.chiefComplaint,
      historyOfPresentIllness: body.historyOfPresentIllness || '',
      vitals: body.vitals || {
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        heartRate: 72,
        respiratoryRate: 16,
        temperatureCelsius: 37.0,
        oxygenSaturation: 98,
        weightKg: 70,
        heightCm: 170,
        bmi: 24.2,
        recordedAt: new Date().toISOString()
      },
      diagnosisCodes: body.diagnosisCodes || [],
      treatmentPlan: body.treatmentPlan || '',
      clinicalNotes: body.clinicalNotes || '',
      allergiesSnapshot: patient.allergies || [],
      prescriptions: body.prescriptions || [],
      doctorDigitalSignature: `Signed cryptographically by ${body.doctorName || db.currentUser.name} (SHA256-RSA-${Math.floor(10000 + Math.random() * 90000)})`,
      followUpDate: body.followUpDate,
      createdAt: new Date().toISOString()
    };

    db.medicalRecords.unshift(newRecord);
    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'MEDICAL_RECORD', `Authored clinical consultation note for ${patient.firstName} ${patient.lastName}`);

    res.status(201).json(newRecord);
  });

  // 7. Prescriptions & Pharmacy (FIFO, Expiry, Batches - Page 14 spec)
  app.get('/api/prescriptions', (req: Request, res: Response) => {
    const { patientId } = req.query;
    let list = db.prescriptions.filter(p => p.hospitalId === db.activeHospitalId);
    if (patientId && typeof patientId === 'string') {
      list = list.filter(p => p.patientId === patientId);
    }
    res.json(list);
  });

  app.post('/api/prescriptions', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.items || body.items.length === 0) {
      return res.status(400).json({ error: 'patientId and items are required' });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      doctorId: body.doctorId || db.currentUser.id,
      doctorName: body.doctorName || db.currentUser.name,
      doctorLicense: 'MD-NY-84920',
      items: body.items.map((i: any, idx: number) => ({
        id: `rx-item-${Date.now()}-${idx}`,
        medicationName: i.medicationName,
        form: i.form || 'TABLET',
        dosage: i.dosage || '10mg',
        frequency: i.frequency || 'Once daily',
        duration: i.duration || '30 days',
        specialInstructions: i.specialInstructions || '',
        quantityPrescribed: i.quantityPrescribed || 30,
        quantityDispensed: 0,
        status: 'PRESCRIBED'
      })),
      digitalSignature: `SIG-${db.currentUser.name.toUpperCase().replace(/[^A-Z]/g, '')}-${Date.now().toString(16)}`,
      notes: body.notes || '',
      status: 'PENDING_FULFILLMENT',
      createdAt: new Date().toISOString()
    };

    db.prescriptions.unshift(newRx);
    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'PHARMACY', `Issued digitally signed prescription #${newRx.id} for ${patient.firstName} ${patient.lastName}`);

    res.status(201).json(newRx);
  });

  app.get('/api/pharmacy/batches', (req: Request, res: Response) => {
    res.json(db.medicineBatches);
  });

  // Page 17 Spec: Consolidated medicines catalog API
  app.get('/api/medicines', (req: Request, res: Response) => {
    const medicinesMap = new Map<string, any>();
    for (const batch of db.medicineBatches) {
      if (!medicinesMap.has(batch.medicineName)) {
        medicinesMap.set(batch.medicineName, {
          id: batch.medicineId,
          name: batch.medicineName,
          category: batch.category,
          form: batch.form,
          strength: batch.strength,
          totalStock: batch.quantityInStock,
          unitCost: batch.unitCost,
          mrp: batch.mrp,
          reorderThreshold: batch.reorderThreshold,
          batchesCount: 1,
          rackLocation: batch.rackLocation,
          status: batch.status
        });
      } else {
        const existing = medicinesMap.get(batch.medicineName);
        existing.totalStock += batch.quantityInStock;
        existing.batchesCount += 1;
      }
    }
    const medicines = Array.from(medicinesMap.values());
    res.json(medicines);
  });

  app.post('/api/pharmacy/dispense', (req: Request, res: Response) => {
    const { prescriptionId } = req.body;
    if (!prescriptionId) {
      return res.status(400).json({ error: 'prescriptionId is required' });
    }

    const result = db.dispensePrescription(prescriptionId, db.currentUser.name);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json(result);
  });

  // 8. Laboratory (4-Stage Workflow - Page 14 spec)
  app.get('/api/lab-orders', (req: Request, res: Response) => {
    const { status, patientId } = req.query;
    let list = db.labOrders.filter(l => l.hospitalId === db.activeHospitalId);
    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(l => l.status === status);
    }
    if (patientId && typeof patientId === 'string') {
      list = list.filter(l => l.patientId === patientId);
    }
    res.json(list);
  });

  app.post('/api/lab-orders', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.testName) {
      return res.status(400).json({ error: 'patientId and testName are required' });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const newOrder: LabOrder = {
      id: `lab-${Date.now()}`,
      orderNumber: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: db.activeHospitalId,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      doctorId: body.doctorId || db.currentUser.id,
      doctorName: body.doctorName || db.currentUser.name,
      testCategory: body.testCategory || 'BIOCHEMISTRY',
      testName: body.testName,
      priority: body.priority || 'ROUTINE',
      status: 'ORDERED',
      sampleType: body.sampleType || 'VENOUS_BLOOD',
      cost: body.cost || 180,
      createdAt: new Date().toISOString()
    };

    db.labOrders.unshift(newOrder);
    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'LAB_ORDER', `Ordered lab test ${newOrder.testName} for ${patient.firstName} ${patient.lastName}`);

    res.status(201).json(newOrder);
  });

  app.patch('/api/lab-orders/:id/status', (req: Request, res: Response) => {
    const { status, results, technicianNotes, approvalRemarks } = req.body;
    const order = db.labOrders.find(l => l.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Lab order not found' });

    order.status = status;
    const now = new Date().toISOString();

    if (status === 'SAMPLE_COLLECTED') {
      order.sampleCollectedAt = now;
      order.collectedBy = db.currentUser.name;
    } else if (status === 'PROCESSING') {
      order.processedAt = now;
      order.processedBy = db.currentUser.name;
    } else if (status === 'PENDING_APPROVAL') {
      order.results = results || order.results;
      order.technicianNotes = technicianNotes || order.technicianNotes;
    } else if (status === 'APPROVED') {
      order.approvedAt = now;
      order.approvedBy = db.currentUser.name;
      order.approvalRemarks = approvalRemarks || 'Verified and signed off by laboratory supervisor.';

      // Dispatch notification (Page 15: Lab approved -> Email + In-App to Doctor and Patient)
      db.dispatchNotification({
        eventType: 'LAB_APPROVED',
        title: `Lab Results Approved: ${order.testName}`,
        message: `Diagnostic results for ${order.patientName} (${order.orderNumber}) have been finalized and verified.`,
        recipientId: order.doctorId,
        recipientName: order.doctorName,
        recipientRole: 'DOCTOR',
        channels: ['IN_APP', 'EMAIL']
      });
    }

    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'LAB_ORDER', `Advanced lab order ${order.orderNumber} to stage ${status}`);

    res.json(order);
  });

  // Page 17 Spec: Update lab order quantitative results
  app.patch('/api/lab-orders/:id/result', (req: Request, res: Response) => {
    const { results, technicianNotes } = req.body;
    const order = db.labOrders.find(l => l.id === req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Lab order not found' }
      });
    }

    if (results && Array.isArray(results)) {
      order.results = results;
    }
    if (technicianNotes) {
      order.technicianNotes = technicianNotes;
    }
    order.status = 'PENDING_APPROVAL';
    order.processedAt = new Date().toISOString();
    order.processedBy = db.currentUser.name;

    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'LAB_ORDER', `Entered laboratory test results for order ${order.orderNumber}`);

    res.json({
      success: true,
      data: order,
      message: 'Lab order results recorded and submitted for clinical approval'
    });
  });

  // 9. Beds & Wards
  app.get('/api/beds', (req: Request, res: Response) => {
    const { ward, status } = req.query;
    let list = db.beds.filter(b => b.hospitalId === db.activeHospitalId);
    if (ward && typeof ward === 'string' && ward !== 'ALL') {
      list = list.filter(b => b.ward === ward);
    }
    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(b => b.status === status);
    }
    res.json(list);
  });

  app.post('/api/beds/admit', (req: Request, res: Response) => {
    const { bedId, patientId, attendingDoctor } = req.body;
    const bed = db.beds.find(b => b.id === bedId);
    const patient = db.patients.find(p => p.id === patientId);

    if (!bed || !patient) {
      return res.status(404).json({ error: 'Bed or Patient not found' });
    }
    if (bed.status === 'OCCUPIED') {
      return res.status(400).json({ error: 'Bed is already occupied' });
    }

    bed.status = 'OCCUPIED';
    bed.patientId = patient.id;
    bed.patientName = `${patient.firstName} ${patient.lastName}`;
    bed.patientMrn = patient.mrn;
    bed.admittedAt = new Date().toISOString();
    bed.attendingDoctor = attendingDoctor || db.currentUser.name;

    patient.status = 'INPATIENT';
    patient.assignedWard = bed.ward;
    patient.assignedBed = bed.bedNumber;
    patient.admittedAt = bed.admittedAt;

    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'BED', `Admitted patient ${patient.firstName} ${patient.lastName} to Bed ${bed.bedNumber} (${bed.ward})`);

    res.json({ bed, patient });
  });

  app.post('/api/beds/discharge', (req: Request, res: Response) => {
    const { bedId } = req.body;
    const bed = db.beds.find(b => b.id === bedId);
    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }

    const patientId = bed.patientId;
    if (patientId) {
      const patient = db.patients.find(p => p.id === patientId);
      if (patient) {
        patient.status = 'DISCHARGED';
        patient.assignedBed = undefined;
        patient.assignedWard = undefined;
      }
    }

    bed.status = 'CLEANING';
    bed.patientId = undefined;
    bed.patientName = undefined;
    bed.patientMrn = undefined;
    bed.admittedAt = undefined;
    bed.attendingDoctor = undefined;

    db.logAction(db.currentUser.name, db.currentUser.role, 'UPDATE', 'BED', `Discharged patient from Bed ${bed.bedNumber}. Initiating sanitizing cycle.`);

    res.json(bed);
  });

  // 10. Billing, Consolidated Invoices & Gateways (Stripe/Razorpay - Page 14 spec)
  app.get('/api/billing', (req: Request, res: Response) => {
    const { status, patientId } = req.query;
    let list = db.invoices.filter(i => i.hospitalId === db.activeHospitalId);
    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(i => i.status === status);
    }
    if (patientId && typeof patientId === 'string') {
      list = list.filter(i => i.patientId === patientId);
    }
    res.json(list);
  });

  app.post('/api/billing', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.items || body.items.length === 0) {
      return res.status(400).json({ error: 'patientId and items are required' });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const total = body.items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const coverageRate = body.insuranceCoverageRate ?? (patient.insuranceProvider !== 'Direct Self-Pay' ? 80 : 0);
    const covered = Math.round((total * coverageRate) / 100);
    const payable = total - covered;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      items: body.items.map((it: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        description: it.description,
        category: it.category || 'CONSULTATION',
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.amount,
        amount: Number(it.amount)
      })),
      totalAmount: total,
      insuranceCoveredAmount: covered,
      insuranceCoverageRate: coverageRate,
      patientPayable: payable,
      status: covered > 0 ? 'CLAIM_SUBMITTED' : 'PENDING',
      insuranceProvider: patient.insuranceProvider,
      policyNumber: patient.policyNumber,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    db.invoices.unshift(newInvoice);

    // Dispatch invoice notification
    db.dispatchNotification({
      eventType: 'INVOICE_GENERATED',
      title: 'Hospital Invoice Generated',
      message: `Consolidated invoice #${newInvoice.invoiceNumber} for $${newInvoice.totalAmount.toLocaleString()} has been prepared.`,
      recipientId: patient.id,
      recipientName: `${patient.firstName} ${patient.lastName}`,
      recipientRole: 'PATIENT',
      channels: ['EMAIL', 'IN_APP']
    });

    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'BILLING', `Generated invoice #${newInvoice.invoiceNumber} for ${patient.firstName} ${patient.lastName} (Total: $${total})`);

    res.status(201).json(newInvoice);
  });

  app.patch('/api/billing/:id/pay', (req: Request, res: Response) => {
    const { paymentMethod, paymentGateway } = req.body;
    const inv = db.invoices.find(i => i.id === req.params.id);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    inv.status = 'PAID';
    inv.paidAt = new Date().toISOString();
    inv.paymentMethod = paymentMethod || 'CREDIT_CARD';
    inv.paymentGateway = paymentGateway || 'STRIPE';
    inv.transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Dispatch payment received notification
    db.dispatchNotification({
      eventType: 'PAYMENT_RECEIVED',
      title: 'Payment Receipt Settled',
      message: `Payment of $${inv.patientPayable} for invoice #${inv.invoiceNumber} settled via ${inv.paymentGateway || 'gateway'}.`,
      recipientId: inv.patientId,
      recipientName: inv.patientName,
      recipientRole: 'PATIENT',
      channels: ['EMAIL', 'SMS']
    });

    db.logAction(db.currentUser.name, db.currentUser.role, 'PAYMENT', 'BILLING', `Settled payment of $${inv.patientPayable} on invoice #${inv.invoiceNumber} via ${inv.paymentGateway || paymentMethod}`);

    res.json(inv);
  });

  // Page 17 Spec: Invoices & Billing aliases
  app.get('/api/invoices', (req: Request, res: Response) => {
    const { status, patientId } = req.query;
    let list = db.invoices.filter(i => i.hospitalId === db.activeHospitalId);
    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter(i => i.status === status);
    }
    if (patientId && typeof patientId === 'string') {
      list = list.filter(i => i.patientId === patientId);
    }
    res.json(list);
  });

  app.post('/api/invoices', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.patientId || !body.items || body.items.length === 0) {
      return res.status(400).json({ error: 'patientId and items are required' });
    }

    const patient = db.patients.find(p => p.id === body.patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const total = body.items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const coverageRate = body.insuranceCoverageRate ?? (patient.insuranceProvider !== 'Direct Self-Pay' ? 80 : 0);
    const covered = Math.round((total * coverageRate) / 100);
    const payable = total - covered;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      hospitalId: db.activeHospitalId,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      items: body.items.map((it: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        description: it.description,
        category: it.category || 'CONSULTATION',
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.amount,
        amount: Number(it.amount)
      })),
      totalAmount: total,
      insuranceCoveredAmount: covered,
      insuranceCoverageRate: coverageRate,
      patientPayable: payable,
      status: covered > 0 ? 'CLAIM_SUBMITTED' : 'PENDING',
      insuranceProvider: patient.insuranceProvider,
      policyNumber: patient.policyNumber,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    db.invoices.unshift(newInvoice);
    db.logAction(db.currentUser.name, db.currentUser.role, 'CREATE', 'BILLING', `Generated invoice #${newInvoice.invoiceNumber} via /api/invoices`);
    res.status(201).json(newInvoice);
  });

  // Page 17 Spec: Stripe Payment Webhook
  app.post('/api/payments/webhook/stripe', (req: Request, res: Response) => {
    const event = req.body;
    const invoiceId = event?.data?.object?.metadata?.invoiceId || event?.invoiceId || (db.invoices.find(i => i.status !== 'PAID')?.id);
    
    if (invoiceId) {
      const inv = db.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
      if (inv) {
        inv.status = 'PAID';
        inv.paidAt = new Date().toISOString();
        inv.paymentMethod = 'CREDIT_CARD';
        inv.paymentGateway = 'STRIPE';
        inv.transactionId = `ch_stripe_wh_${Date.now()}`;
        
        db.dispatchNotification({
          eventType: 'PAYMENT_RECEIVED',
          title: 'Stripe Webhook: Payment Verified',
          message: `Stripe automated webhook confirmed payment of $${inv.patientPayable} for ${inv.invoiceNumber}`,
          recipientId: inv.patientId,
          recipientName: inv.patientName,
          recipientRole: 'PATIENT',
          channels: ['IN_APP', 'EMAIL']
        });

        db.logAction('Stripe Webhook Worker', 'SUPER_ADMIN', 'PAYMENT', 'BILLING', `Automated Stripe webhook reconciled payment for invoice ${inv.invoiceNumber}`);
      }
    }

    res.json({ received: true, event: event?.type || 'payment_intent.succeeded' });
  });

  // Page 17 Spec: Revenue Analytics
  app.get('/api/analytics/revenue', (req: Request, res: Response) => {
    const invoices = db.invoices.filter(i => i.hospitalId === db.activeHospitalId);
    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0);
    const pendingAmount = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.patientPayable, 0);
    const insuranceClaimsTotal = invoices.reduce((sum, i) => sum + i.insuranceCoveredAmount, 0);
    
    const byDepartment = [
      { department: 'Cardiology', revenue: 48200, patientCount: 38 },
      { department: 'Emergency & Trauma', revenue: 64100, patientCount: 52 },
      { department: 'Internal Medicine', revenue: 31900, patientCount: 44 },
      { department: 'Pediatrics', revenue: 22400, patientCount: 29 },
      { department: 'Diagnostic Lab', revenue: 19800, patientCount: 65 },
      { department: 'Inpatient Pharmacy', revenue: 27500, patientCount: 71 },
      { department: 'Orthopedics', revenue: 36200, patientCount: 21 }
    ];

    const monthlyTrends = [
      { month: 'Apr', revenue: 195000, target: 180000 },
      { month: 'May', revenue: 210000, target: 200000 },
      { month: 'Jun', revenue: 235000, target: 220000 },
      { month: 'Jul', revenue: 228000, target: 230000 },
      { month: 'Aug', revenue: 254000, target: 240000 },
      { month: 'Sep', revenue: 268000, target: 250000 }
    ];

    res.json({
      success: true,
      data: {
        totalRevenue,
        pendingAmount,
        insuranceClaimsTotal,
        collectionRate: 94.2,
        byDepartment,
        monthlyTrends,
        gateways: [
          { gateway: 'STRIPE', amount: 142800, percentage: 53.2 },
          { gateway: 'INSURANCE_DIRECT', amount: 98400, percentage: 36.7 },
          { gateway: 'RAZORPAY', amount: 26800, percentage: 10.1 }
        ]
      },
      message: 'OK'
    });
  });

  // 11. Notifications Center (Page 15 spec)
  app.get('/api/notifications', (req: Request, res: Response) => {
    const { channel, unreadOnly } = req.query;
    let list = db.notifications.filter(n => n.hospitalId === db.activeHospitalId);
    if (channel && typeof channel === 'string' && channel !== 'ALL') {
      list = list.filter(n => n.channel === channel);
    }
    if (unreadOnly === 'true') {
      list = list.filter(n => !n.isRead);
    }
    res.json(list);
  });

  // Page 17 Spec: Current user notifications
  app.get('/api/notifications/me', (req: Request, res: Response) => {
    const list = db.notifications.filter(n => n.hospitalId === db.activeHospitalId && (n.recipientRole === db.currentUser.role || n.recipientId === db.currentUser.id));
    res.json({
      success: true,
      data: list,
      message: 'OK',
      unreadCount: list.filter(n => !n.isRead).length
    });
  });

  app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true, notif });
  });

  // 12. Staff Directory
  app.get('/api/doctors', (req: Request, res: Response) => {
    res.json(db.doctors.filter(d => !d.deletedAt && d.hospitalId === db.activeHospitalId));
  });

  // 13. Audit Trail
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json(db.auditLogs);
  });

  // 14. 9 User Roles & Authentication Switching
  app.get('/api/auth/current', (req: Request, res: Response) => {
    res.json(db.currentUser);
  });

  app.post('/api/auth/switch-role', (req: Request, res: Response) => {
    const { role } = req.body as { role: UserRole };
    
    const roleRoster: Record<UserRole, UserProfile> = {
      SUPER_ADMIN: {
        id: 'usr-super-admin',
        hospitalId: db.activeHospitalId,
        name: 'Hari Srinivas (Admin)',
        email: 'hari.admin@medcore.global',
        role: 'SUPER_ADMIN',
        title: 'Enterprise Systems Super Admin',
        department: 'Executive Leadership & Multi-Tenancy'
      },
      HOSPITAL_ADMIN: {
        id: 'usr-hosp-admin',
        hospitalId: db.activeHospitalId,
        name: 'Teja Kumar (Hospital Admin)',
        email: 'teja.admin@medcore.hospital',
        role: 'HOSPITAL_ADMIN',
        title: 'Hospital Operations Administrator',
        department: 'Hospital Administration & Governance'
      },
      DOCTOR: {
        id: 'usr-doctor-priya',
        hospitalId: db.activeHospitalId,
        name: 'Dr. Priya Sharma, MD',
        email: 'priya.sharma@medcore.hospital',
        role: 'DOCTOR',
        title: 'Chief Consultant Physician & Cardiologist',
        department: 'Clinical Medicine & Outpatient'
      },
      NURSE: {
        id: 'usr-nurse-kavya',
        hospitalId: db.activeHospitalId,
        name: 'Kavya Reddy, RN',
        email: 'kavya.nurse@medcore.hospital',
        role: 'NURSE',
        title: 'Lead Charge Nurse & Triage Coordinator',
        department: 'Inpatient Wards & Critical Care'
      },
      RECEPTIONIST: {
        id: 'usr-receptionist-ananya',
        hospitalId: db.activeHospitalId,
        name: 'Ananya Verma',
        email: 'ananya.reception@medcore.hospital',
        role: 'RECEPTIONIST',
        title: 'Front Desk & Patient Intake Lead',
        department: 'Front Desk & Scheduling'
      },
      LAB_TECHNICIAN: {
        id: 'usr-lab-rahul',
        hospitalId: db.activeHospitalId,
        name: 'Rahul Nair',
        email: 'rahul.lab@medcore.hospital',
        role: 'LAB_TECHNICIAN',
        title: 'Senior Laboratory & Diagnostics Specialist',
        department: 'Diagnostic Pathology Laboratory'
      },
      PHARMACIST: {
        id: 'usr-pharmacist-vikram',
        hospitalId: db.activeHospitalId,
        name: 'Vikram Patel, PharmD',
        email: 'vikram.pharmacy@medcore.hospital',
        role: 'PHARMACIST',
        title: 'Chief Pharmacist & Dispensary Manager',
        department: 'Central Dispensary & FIFO Inventory'
      },
      ACCOUNTANT: {
        id: 'usr-accountant-suresh',
        hospitalId: db.activeHospitalId,
        name: 'Suresh Rao (Accountant)',
        email: 'suresh.billing@medcore.hospital',
        role: 'ACCOUNTANT',
        title: 'Revenue Cycle & Health Claims Specialist',
        department: 'Finance, Billing & Insurance Claims'
      },
      PATIENT: {
        id: 'p-1',
        hospitalId: db.activeHospitalId,
        name: 'Pooja Iyer',
        email: 'pooja.patient@example.com',
        role: 'PATIENT',
        title: 'Patient Portal Member (MRN: MC-2026-0811)',
        department: 'Cardiology Clinic Patient'
      }
    };

    if (roleRoster[role]) {
      db.currentUser = roleRoster[role];
      db.logAction(db.currentUser.name, role, 'UPDATE', 'AUTH', `Switched active role profile to ${role}`);
      res.json(db.currentUser);
    } else {
      res.status(400).json({ error: 'Invalid user role requested' });
    }
  });

  // 15. Server-side Gemini AI Clinical Copilot
  app.post('/api/ai/clinical-assist', async (req: Request, res: Response) => {
    try {
      const { symptoms, vitals, patientHistory, age, gender } = req.body;
      if (!symptoms) {
        return res.status(400).json({ error: 'Symptoms description is required' });
      }

      db.logAction(db.currentUser.name, db.currentUser.role, 'AI_QUERY', 'MEDICAL_RECORD', `Queried AI Clinical Decision Support for symptoms: "${symptoms.substring(0, 40)}..."`);
      const analysis = await analyzeClinicalCase({ symptoms, vitals, patientHistory, age, gender });
      res.json(analysis);
    } catch (err: any) {
      console.error('Error in /api/ai/clinical-assist:', err);
      res.status(500).json({ error: 'Clinical AI assistance failed', details: err.message });
    }
  });

  app.post('/api/ai/drug-safety', async (req: Request, res: Response) => {
    try {
      const { currentMedications, newMedication, knownAllergies } = req.body;
      if (!newMedication) {
        return res.status(400).json({ error: 'newMedication name required' });
      }

      db.logAction(db.currentUser.name, db.currentUser.role, 'AI_QUERY', 'MEDICAL_RECORD', `Checked drug safety for proposed Rx: ${newMedication}`);
      const safety = await checkDrugSafety({
        currentMedications: currentMedications || [],
        newMedication,
        knownAllergies: knownAllergies || []
      });
      res.json(safety);
    } catch (err: any) {
      console.error('Error in /api/ai/drug-safety:', err);
      res.status(500).json({ error: 'Drug safety check failed', details: err.message });
    }
  });

  app.post('/api/ai/discharge-summary', async (req: Request, res: Response) => {
    try {
      const { patient, admissionReason, diagnoses, treatmentSummary, dischargeMedications, followUpInstructions } = req.body;
      if (!patient || !admissionReason) {
        return res.status(400).json({ error: 'Patient details and admission reason required' });
      }

      db.logAction(db.currentUser.name, db.currentUser.role, 'AI_QUERY', 'MEDICAL_RECORD', `Generated automated Discharge Summary for ${patient.firstName} ${patient.lastName}`);
      const summary = await generateDischargeSummary({
        patient,
        admissionReason,
        diagnoses: diagnoses || [],
        treatmentSummary: treatmentSummary || '',
        dischargeMedications: dischargeMedications || [],
        followUpInstructions: followUpInstructions || ''
      });
      res.json({ summary });
    } catch (err: any) {
      console.error('Error in /api/ai/discharge-summary:', err);
      res.status(500).json({ error: 'Discharge summary generation failed', details: err.message });
    }
  });

  // 16. Reset Demo Data
  app.post('/api/system/reset', (req: Request, res: Response) => {
    const freshDb = new (db.constructor as any)();
    Object.assign(db, freshDb);
    db.logAction('Alexander Sterling', 'SUPER_ADMIN', 'UPDATE', 'AUTH', 'Reset hospital system demo data to baseline state');
    res.json({ message: 'Hospital database restored to standard enterprise seed state' });
  });

  // ==========================================
  // Vite Integration for Dev & Production
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MedCore HMS] Enterprise server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
