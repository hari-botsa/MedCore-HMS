import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { 
  Header 
} from './components/Header';
import { 
  Sidebar, 
  NavTab,
  ROLE_ALLOWED_TABS,
  ROLE_DEFAULT_TABS
} from './components/Sidebar';
import { 
  DashboardView 
} from './components/DashboardView';
import { 
  PatientsView 
} from './components/PatientsView';
import { 
  AppointmentsView 
} from './components/AppointmentsView';
import { 
  ClinicalConsultationView 
} from './components/ClinicalConsultationView';
import { 
  LaboratoryView 
} from './components/LaboratoryView';
import { 
  PharmacyView 
} from './components/PharmacyView';
import { 
  WardsView 
} from './components/WardsView';
import { 
  BillingView 
} from './components/BillingView';
import { 
  NotificationsView 
} from './components/NotificationsView';
import { 
  PatientPortalView 
} from './components/PatientPortalView';
import { 
  StaffView 
} from './components/StaffView';
import { 
  AiAssistantView 
} from './components/AiAssistantView';
import { 
  AuditAndApiView 
} from './components/AuditAndApiView';
import { 
  BlueprintTab 
} from './components/BlueprintTab';
import { 
  LandingPage 
} from './components/LandingPage';

import { 
  Patient, 
  Doctor, 
  Appointment, 
  Bed, 
  Invoice, 
  MedicalRecord, 
  AuditLog, 
  HospitalStats, 
  UserProfile, 
  UserRole,
  AppointmentStatus,
  LabOrder,
  MedicineBatch,
  Notification,
  Hospital
} from './types';

import { 
  fetchStats, 
  fetchPatients, 
  createPatient, 
  fetchDoctors, 
  fetchAppointments, 
  createAppointment, 
  updateAppointmentStatus, 
  fetchBeds, 
  admitPatientToBed, 
  dischargeBed, 
  fetchInvoices, 
  createInvoice, 
  payInvoice, 
  fetchMedicalRecords, 
  createMedicalRecord, 
  fetchAuditLogs,
  fetchHospitals,
  switchHospital,
  fetchLabOrders,
  updateLabOrderStatus,
  fetchMedicineBatches,
  dispensePrescriptionBatch,
  fetchNotifications,
  markNotificationRead
} from './api';

export default function App() {
  // Authentication & Landing Page State (defaults to false to present landing page on visit)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('DOCTOR');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [activeHospitalId, setActiveHospitalId] = useState<string>('hosp-1');

  const ROLE_DEFAULT_TABS: Record<UserRole, NavTab> = {
    SUPER_ADMIN: 'dashboard',
    HOSPITAL_ADMIN: 'dashboard',
    DOCTOR: 'consultation',
    NURSE: 'wards',
    RECEPTIONIST: 'appointments',
    LAB_TECHNICIAN: 'laboratory',
    PHARMACIST: 'pharmacy',
    ACCOUNTANT: 'billing',
    PATIENT: 'patient-portal'
  };

  const mainContentRef = useRef<HTMLElement | null>(null);
  const [showPanelScrollTop, setShowPanelScrollTop] = useState(false);

  // Scroll to top whenever tab or authentication changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    setShowPanelScrollTop(false);
  }, [currentTab, isAuthenticated]);

  // Monitor panel scroll position to display floating back-to-top button with hover
  useEffect(() => {
    const el = mainContentRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowPanelScrollTop(el.scrollTop > 220);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

  // Enforce role-based access to tabs: automatically redirect if tab is not permitted for the user's role
  useEffect(() => {
    if (ROLE_ALLOWED_TABS[userRole] && !ROLE_ALLOWED_TABS[userRole].includes(currentTab)) {
      setCurrentTab(ROLE_DEFAULT_TABS[userRole] || 'dashboard');
    }
  }, [userRole, currentTab]);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'u-1',
    hospitalId: 'hosp-1',
    name: 'Dr. Priya Sharma, MD',
    email: 'priya.sharma@medcore.hospital',
    role: 'DOCTOR',
    title: 'Chief Consultant Physician & Cardiologist',
    department: 'Cardiology'
  });

  // Data Store State
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [medicineBatches, setMedicineBatches] = useState<MedicineBatch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Selection & UI helpers
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all data from backend API
  const refreshAllData = async () => {
    try {
      const [
        hospitalsData,
        statsData,
        patientsData,
        doctorsData,
        appointmentsData,
        bedsData,
        invoicesData,
        recordsData,
        logsData,
        labData,
        batchesData,
        notifData
      ] = await Promise.all([
        fetchHospitals(),
        fetchStats(),
        fetchPatients(),
        fetchDoctors(),
        fetchAppointments(),
        fetchBeds(),
        fetchInvoices(),
        fetchMedicalRecords(),
        fetchAuditLogs(),
        fetchLabOrders(),
        fetchMedicineBatches(),
        fetchNotifications()
      ]);

      setHospitals(hospitalsData.hospitals);
      if (hospitalsData.activeHospitalId) {
        setActiveHospitalId(hospitalsData.activeHospitalId);
      }
      setStats(statsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setBeds(bedsData);
      setInvoices(invoicesData);
      setRecords(recordsData);
      setAuditLogs(logsData);
      setLabOrders(labData);
      setMedicineBatches(batchesData);
      setNotifications(notifData);

      if (!selectedPatientId && patientsData.length > 0) {
        setSelectedPatientId(patientsData[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load MedCore HMS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleRefreshData = async () => {
    await refreshAllData();
    showToast('Hospital records synchronized with central database');
  };

  // Multi-tenant Hospital Switcher Handler
  const handleSwitchHospital = async (hospitalId: string) => {
    try {
      await switchHospital(hospitalId);
      setActiveHospitalId(hospitalId);
      const chosen = hospitals.find(h => h.id === hospitalId);
      showToast(`Switched hospital tenant to ${chosen?.name || hospitalId}`);
      await refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to switch hospital tenant', 'error');
    }
  };

  // Role Switcher Handler for all 9 roles
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    const profiles: Record<UserRole, UserProfile> = {
      SUPER_ADMIN: {
        id: 'u-super',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Hari Srinivas (Admin)',
        email: 'hari.admin@medcore.global',
        role: 'SUPER_ADMIN',
        title: 'Enterprise Systems Super Admin',
        department: 'Global Health Infrastructure & Multi-Tenancy'
      },
      HOSPITAL_ADMIN: {
        id: 'u-admin',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Teja Kumar (Hospital Admin)',
        email: 'teja.admin@medcore.hospital',
        role: 'HOSPITAL_ADMIN',
        title: 'Hospital Operations Administrator',
        department: 'Hospital Administration & Governance'
      },
      DOCTOR: {
        id: 'u-doc',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Dr. Priya Sharma, MD',
        email: 'priya.sharma@medcore.hospital',
        role: 'DOCTOR',
        title: 'Chief Consultant Physician & Cardiologist',
        department: 'Clinical Medicine & Outpatient'
      },
      NURSE: {
        id: 'u-nurse',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Kavya Reddy, RN',
        email: 'kavya.nurse@medcore.hospital',
        role: 'NURSE',
        title: 'Lead Inpatient Charge Nurse & Triage Coordinator',
        department: 'Inpatient Wards & Critical Care'
      },
      RECEPTIONIST: {
        id: 'u-rec',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Ananya Verma',
        email: 'ananya.reception@medcore.hospital',
        role: 'RECEPTIONIST',
        title: 'Front Desk & Patient Intake Lead',
        department: 'Front Desk & Scheduling'
      },
      LAB_TECHNICIAN: {
        id: 'u-lab',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Rahul Nair',
        email: 'rahul.lab@medcore.hospital',
        role: 'LAB_TECHNICIAN',
        title: 'Senior Laboratory & Diagnostics Specialist',
        department: 'Diagnostic Pathology Laboratory'
      },
      PHARMACIST: {
        id: 'u-pharm',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Vikram Patel, PharmD',
        email: 'vikram.pharmacy@medcore.hospital',
        role: 'PHARMACIST',
        title: 'Chief Pharmacist & Dispensary Manager',
        department: 'Hospital Dispensary & Inventory'
      },
      ACCOUNTANT: {
        id: 'u-bill',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Suresh Rao (Accountant)',
        email: 'suresh.billing@medcore.hospital',
        role: 'ACCOUNTANT',
        title: 'Revenue Cycle & Claims Specialist',
        department: 'Finance, Billing & Claims'
      },
      PATIENT: {
        id: 'u-pat',
        hospitalId: activeHospitalId || 'hosp-1',
        name: 'Pooja Iyer',
        email: 'pooja.patient@example.com',
        role: 'PATIENT',
        title: 'Patient Portal Member (MRN: MC-2026-0811)',
        department: 'Cardiology Clinic Patient'
      }
    };
    setCurrentUser(profiles[role]);
    showToast(`Role switched to ${profiles[role].name} (${role.replace('_', ' ')})`);

    // Auto-navigate to role's primary dedicated dashboard
    const targetTab = ROLE_DEFAULT_TABS[role] || 'dashboard';
    setCurrentTab(targetTab);
  };

  // Dedicated Login Handler with Auto-Navigation to the Role's Target Dashboard
  const handleLogin = (role: UserRole, hospitalId: string, email?: string) => {
    if (hospitalId && hospitalId !== activeHospitalId) {
      handleSwitchHospital(hospitalId);
    }
    setUserRole(role);
    const profiles: Record<UserRole, UserProfile> = {
      SUPER_ADMIN: {
        id: 'u-super',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Hari Srinivas (Admin)',
        email: email || 'hari.admin@medcore.global',
        role: 'SUPER_ADMIN',
        title: 'Enterprise Systems Super Admin',
        department: 'Global Health Infrastructure & Multi-Tenancy'
      },
      HOSPITAL_ADMIN: {
        id: 'u-admin',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Teja Kumar (Hospital Admin)',
        email: email || 'teja.admin@medcore.hospital',
        role: 'HOSPITAL_ADMIN',
        title: 'Hospital Operations Administrator',
        department: 'Hospital Administration & Governance'
      },
      DOCTOR: {
        id: 'u-doc',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Dr. Priya Sharma, MD',
        email: email || 'priya.sharma@medcore.hospital',
        role: 'DOCTOR',
        title: 'Chief Consultant Physician & Cardiologist',
        department: 'Clinical Medicine & Outpatient'
      },
      NURSE: {
        id: 'u-nurse',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Kavya Reddy, RN',
        email: email || 'kavya.nurse@medcore.hospital',
        role: 'NURSE',
        title: 'Lead Inpatient Charge Nurse & Triage Coordinator',
        department: 'Inpatient Wards & Critical Care'
      },
      RECEPTIONIST: {
        id: 'u-rec',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Ananya Verma',
        email: email || 'ananya.reception@medcore.hospital',
        role: 'RECEPTIONIST',
        title: 'Front Desk & Patient Intake Lead',
        department: 'Front Desk & Scheduling'
      },
      LAB_TECHNICIAN: {
        id: 'u-lab',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Rahul Nair',
        email: email || 'rahul.lab@medcore.hospital',
        role: 'LAB_TECHNICIAN',
        title: 'Senior Laboratory & Diagnostics Specialist',
        department: 'Diagnostic Pathology Laboratory'
      },
      PHARMACIST: {
        id: 'u-pharm',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Vikram Patel, PharmD',
        email: email || 'vikram.pharmacy@medcore.hospital',
        role: 'PHARMACIST',
        title: 'Chief Pharmacist & Dispensary Manager',
        department: 'Hospital Dispensary & Inventory'
      },
      ACCOUNTANT: {
        id: 'u-bill',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Suresh Rao (Accountant)',
        email: email || 'suresh.billing@medcore.hospital',
        role: 'ACCOUNTANT',
        title: 'Revenue Cycle & Claims Specialist',
        department: 'Finance, Billing & Claims'
      },
      PATIENT: {
        id: 'u-pat',
        hospitalId: hospitalId || activeHospitalId || 'hosp-1',
        name: 'Pooja Iyer',
        email: email || 'pooja.patient@example.com',
        role: 'PATIENT',
        title: 'Patient Portal Member (MRN: MC-2026-0811)',
        department: 'Cardiology Clinic Patient'
      }
    };
    setCurrentUser(profiles[role]);
    const targetTab = ROLE_DEFAULT_TABS[role] || 'dashboard';
    setCurrentTab(targetTab);
    setIsAuthenticated(true);
    showToast(`Authenticated as ${profiles[role].name} (${role.replace('_', ' ')}) • Launching ${targetTab.toUpperCase()}`);
  };

  // Sign out / Exit to Landing Page
  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of MedCore HMS. Returned to Landing Page.');
  };

  // Action: Register Patient
  const handleRegisterPatient = async (patientData: Partial<Patient>) => {
    try {
      const newPt = await createPatient(patientData);
      setPatients(prev => [newPt, ...prev]);
      setSelectedPatientId(newPt.id);
      showToast(`Patient ${newPt.firstName} ${newPt.lastName} registered (MRN: ${newPt.mrn})`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to register patient', 'error');
    }
  };

  // Action: Book Appointment
  const handleBookAppointment = async (aptData: Partial<Appointment>) => {
    try {
      const newApt = await createAppointment(aptData);
      setAppointments(prev => [newApt, ...prev]);
      showToast(`Appointment scheduled for ${newApt.patientName}`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (err: any) {
      showToast(err.message || 'Failed to book appointment', 'error');
    }
  };

  // Action: Update Appointment Status
  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
      showToast(`Appointment status updated to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update appointment', 'error');
    }
  };

  // Action: Admit Patient
  const handleAdmitPatient = async (data: { bedId: string; patientId: string; attendingDoctor?: string } | string, patientId?: string, doctorId?: string) => {
    try {
      const payload = typeof data === 'string'
        ? { bedId: data, patientId: patientId || '', attendingDoctor: doctorId }
        : data;
      const res = await admitPatientToBed(payload);
      setBeds(prev => prev.map(b => b.id === payload.bedId ? res.bed : b));
      if (res.patient) {
        setPatients(prev => prev.map(p => p.id === res.patient.id ? res.patient : p));
      }
      showToast(`Patient admitted to bed ${res.bed.bedNumber} (${res.bed.ward})`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to admit patient', 'error');
    }
  };

  // Action: Discharge Bed
  const handleDischargeBed = async (bedId: string) => {
    try {
      const updatedBed = await dischargeBed(bedId);
      setBeds(prev => prev.map(b => b.id === bedId ? updatedBed : b));
      showToast(`Patient discharged from bed ${updatedBed.bedNumber}. Sanitization queued.`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to discharge bed', 'error');
    }
  };

  // Action: Create Invoice
  const handleCreateInvoice = async (invData: Partial<Invoice>) => {
    try {
      const newInv = await createInvoice(invData);
      setInvoices(prev => [newInv, ...prev]);
      showToast(`Consolidated Invoice ${newInv.invoiceNumber} created`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to generate invoice', 'error');
    }
  };

  // Action: Pay Invoice
  const handlePayInvoice = async (id: string, method: string, gateway?: string) => {
    try {
      const updated = await payInvoice(id, method, gateway);
      setInvoices(prev => prev.map(i => i.id === id ? updated : i));
      showToast(`Invoice ${updated.invoiceNumber} settled via ${gateway || method}`);
      const updatedStats = await fetchStats();
      setStats(updatedStats);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Payment processing failed', 'error');
    }
  };

  // Action: Save Medical Record
  const handleSaveMedicalRecord = async (recData: Partial<MedicalRecord>) => {
    try {
      const saved = await createMedicalRecord(recData);
      setRecords(prev => [saved, ...prev]);
      showToast(`Clinical encounter finalized & digitally signed for ${saved.patientName}`);
      const updatedLogs = await fetchAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to sign and save encounter', 'error');
    }
  };

  // Action: Update Lab Order Status
  const handleUpdateLabOrderStatus = async (orderId: string, status: any, results?: any) => {
    try {
      const updated = await updateLabOrderStatus(orderId, status, results);
      setLabOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Lab Order ${updated.orderNumber} updated to ${status}`);
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (err: any) {
      showToast(err.message || 'Failed to update lab order', 'error');
    }
  };

  // Action: Dispense Medicine
  const handleDispenseMedicine = async (prescriptionId: string, medicineName: string, quantity: number) => {
    try {
      const res = await dispensePrescriptionBatch(prescriptionId, medicineName, quantity);
      showToast(res.message);
      const batches = await fetchMedicineBatches();
      setMedicineBatches(batches);
      const notifs = await fetchNotifications();
      setNotifications(notifs);
    } catch (err: any) {
      showToast(err.message || 'Dispensing failed', 'error');
    }
  };

  // Action: Mark Notification Read
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err: any) {
      console.error(err);
    }
  };

  // Helper shortcuts
  const handleStartConsultationForPatient = (pt: Patient) => {
    setSelectedPatientId(pt.id);
    setCurrentTab('consultation');
  };

  const handleBookWithDoctor = (docOrId: Doctor | string) => {
    setCurrentTab('appointments');
    const docName = typeof docOrId === 'string'
      ? doctors.find(d => d.id === docOrId)?.name || 'Doctor'
      : docOrId.name;
    showToast(`Select appointment slot for ${docName}`);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const activeHospital = hospitals.find(h => h.id === activeHospitalId);

  const pendingLabsCount = labOrders.filter(l => l.status !== 'APPROVED').length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  // If user is not yet logged in, render the MedCore HMS Enterprise Landing Page
  if (!isAuthenticated) {
    return (
      <>
        {toast && (
          <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <span className={`h-2 w-2 rounded-full shrink-0 ${
              toast.type === 'error' ? 'bg-rose-400 animate-pulse' : 'bg-teal-400'
            }`}></span>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)} 
              className="ml-2 text-slate-400 hover:text-white cursor-pointer p-0.5 text-sm leading-none"
              aria-label="Dismiss toast"
            >
              &times;
            </button>
          </div>
        )}
        <LandingPage
          onLogin={handleLogin}
          hospitals={hospitals}
          activeHospitalId={activeHospitalId}
        />
      </>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* Top Global Navigation Bar */}
      <Header
        currentUser={currentUser}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        notificationsCount={unreadNotifsCount}
        hospitals={hospitals}
        activeHospitalId={activeHospitalId}
        onSwitchHospital={handleSwitchHospital}
        onLogout={handleLogout}
        onResetDemo={handleRefreshData}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Navigation Sidebar (Supports docked desktop and slide-out mobile drawer) */}
        <Sidebar
          currentTab={currentTab}
          onTabSelect={(tab) => {
            setCurrentTab(tab);
            setIsMobileNavOpen(false);
          }}
          userRole={userRole}
          currentUser={currentUser}
          hospitalName={activeHospital?.name || 'Metropolitan Medical Center'}
          onLogout={handleLogout}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          counts={{
            patients: patients.length,
            appointments: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length,
            inpatients: beds.filter(b => b.status === 'OCCUPIED').length,
            unpaidBills: invoices.filter(i => i.status !== 'PAID').length,
            pendingLabs: pendingLabsCount,
            unreadNotifs: unreadNotifsCount
          }}
        />

        {/* Content View Area */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-8 min-h-0 min-w-0">
          <div className="max-w-7xl w-full mx-auto space-y-6 min-w-0">
            
            {/* Real-time notification toast */}
            {toast && (
              <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-2 ${
                toast.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-800'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}>
                <span className={`h-2 w-2 rounded-full shrink-0 ${
                  toast.type === 'error' ? 'bg-rose-400 animate-pulse' : 'bg-teal-400'
                }`}></span>
                <span>{toast.message}</span>
                <button 
                  onClick={() => setToast(null)} 
                  className="ml-2 text-slate-400 hover:text-white cursor-pointer p-0.5 text-sm leading-none"
                  aria-label="Dismiss toast"
                >
                  &times;
                </button>
              </div>
            )}

            {/* View Switching */}
            {currentTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                appointments={appointments}
                patients={patients}
                beds={beds}
                doctors={doctors}
                onNavigate={setCurrentTab}
                onSelectPatient={(pId) => {
                  setSelectedPatientId(pId);
                  setCurrentTab('patients');
                }}
              />
            )}

            {currentTab === 'patients' && (
              <PatientsView
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
                onRegisterPatient={handleRegisterPatient}
                onNavigate={setCurrentTab}
                onAdmitPatient={(pId) => {
                  setSelectedPatientId(pId);
                  setCurrentTab('wards');
                }}
                onStartConsultationForPatient={handleStartConsultationForPatient}
              />
            )}

            {currentTab === 'appointments' && (
              <AppointmentsView
                appointments={appointments}
                doctors={doctors}
                patients={patients}
                onBookAppointment={handleBookAppointment}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onStartConsultation={handleStartConsultationForPatient}
              />
            )}

            {currentTab === 'consultation' && (
              <ClinicalConsultationView
                patients={patients}
                doctors={doctors}
                selectedPatient={selectedPatient}
                onSaveRecord={handleSaveMedicalRecord}
                medicalRecords={records}
              />
            )}

            {currentTab === 'laboratory' && (
              <LaboratoryView
                labOrders={labOrders}
                patients={patients}
                onUpdateStatus={handleUpdateLabOrderStatus}
              />
            )}

            {currentTab === 'pharmacy' && (
              <PharmacyView
                batches={medicineBatches}
                onDispenseMedicine={handleDispenseMedicine}
              />
            )}

            {currentTab === 'wards' && (
              <WardsView
                beds={beds}
                patients={patients}
                doctors={doctors}
                onAdmitPatient={handleAdmitPatient}
                onDischargeBed={handleDischargeBed}
                onSelectPatient={(pId) => {
                  setSelectedPatientId(pId);
                  setCurrentTab('patients');
                }}
              />
            )}

            {currentTab === 'billing' && (
              <BillingView
                invoices={invoices}
                patients={patients}
                onCreateInvoice={handleCreateInvoice}
                onPayInvoice={handlePayInvoice}
              />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationRead}
              />
            )}

            {currentTab === 'patient-portal' && (
              <PatientPortalView
                patient={selectedPatient}
                appointments={appointments}
                records={records}
                labOrders={labOrders}
                invoices={invoices}
                onPayInvoice={(invId) => handlePayInvoice(invId, 'CREDIT_CARD', 'STRIPE')}
              />
            )}

            {currentTab === 'staff' && (
              <StaffView
                doctors={doctors}
                onBookWithDoctor={handleBookWithDoctor}
              />
            )}

            {currentTab === 'ai-assist' && (
              <AiAssistantView
                patients={patients}
                onSelectPatient={(pId) => {
                  setSelectedPatientId(pId);
                  setCurrentTab('patients');
                }}
              />
            )}

            {currentTab === 'blueprint' && (
              <BlueprintTab
                onNavigateTab={(tab) => {
                  if (tab === 'VERIFICATION') {
                    setCurrentTab('audit-api');
                  } else {
                    setCurrentTab(tab as NavTab);
                  }
                }}
                onSwitchRole={(role) => {
                  handleRoleChange(role);
                }}
              />
            )}

            {currentTab === 'audit-api' && (
              <AuditAndApiView
                auditLogs={auditLogs}
              />
            )}

          </div>

          {/* Floating Scroll-to-Top Button for all panel views with responsive hover elevation & glow */}
          {showPanelScrollTop && (
            <button
              onClick={() => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 z-50 p-3 sm:px-4 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
              aria-label="Scroll to top"
              title="Back to Top"
            >
              <ChevronUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline-block pr-1">Back to Top</span>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
