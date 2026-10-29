import React, { useState } from 'react';
import { 
  Activity, 
  Shield, 
  Building2, 
  Stethoscope, 
  HeartPulse, 
  Calendar, 
  FlaskConical, 
  Pill, 
  Receipt, 
  Bell, 
  UserCheck, 
  Lock, 
  Key, 
  Mail, 
  ArrowRight, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Award, 
  ShieldCheck, 
  Heart, 
  Users, 
  MapPin, 
  Ambulance, 
  Search,
  ChevronDown,
  Star,
  HelpCircle,
  FileText,
  ChevronUp
} from 'lucide-react';
import { UserRole, Hospital } from '../types';

export interface RoleCredential {
  role: UserRole;
  label: string;
  name: string;
  title: string;
  department: string;
  email: string;
  password: string;
  targetDashboard: string;
  targetDashboardName: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const ROLE_CREDENTIALS: RoleCredential[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin (Hari)',
    name: 'Hari Srinivas (Admin)',
    title: 'Enterprise Systems Super Admin & Medical Director',
    department: 'Hospital Board & Multi-Branch Governance',
    email: 'hari.admin@medcore.global',
    password: 'Admin@2026',
    targetDashboard: 'dashboard',
    targetDashboardName: 'Executive Hospital Overview & Multi-Branch Governance',
    badge: 'Super Admin',
    color: 'border-indigo-200 bg-indigo-50/70 hover:border-indigo-400 text-indigo-950',
    icon: Shield,
    description: 'Oversees hospital network operations, facility capacity, medical staff credentials, and enterprise healthcare policies.'
  },
  {
    role: 'HOSPITAL_ADMIN',
    label: 'Hospital Admin (Teja)',
    name: 'Teja Kumar (Hospital Admin)',
    title: 'Hospital Operations Administrator',
    department: 'Hospital Administration & Governance',
    email: 'teja.admin@medcore.hospital',
    password: 'Admin@2026',
    targetDashboard: 'dashboard',
    targetDashboardName: 'Facility Operations & Bed Census Dashboard',
    badge: 'Hospital Admin',
    color: 'border-teal-200 bg-teal-50/70 hover:border-teal-400 text-teal-950',
    icon: Building2,
    description: 'Manages day-to-day hospital operations, inpatient bed capacity, duty rosters, department coordination, and compliance.'
  },
  {
    role: 'DOCTOR',
    label: 'Doctor (Dr. Priya)',
    name: 'Dr. Priya Sharma, MD',
    title: 'Chief Consultant Physician & Cardiologist',
    department: 'Cardiology & Outpatient Medicine (OPD)',
    email: 'priya.sharma@medcore.hospital',
    password: 'Doctor@2026',
    targetDashboard: 'consultation',
    targetDashboardName: 'Clinical Consultation, SOAP Notes & Prescriptions',
    badge: 'Doctor (MD)',
    color: 'border-sky-200 bg-sky-50/70 hover:border-sky-400 text-sky-950',
    icon: Stethoscope,
    description: 'Examines patients, reviews diagnostic reports, records clinical notes, and prescribes verified medications.'
  },
  {
    role: 'NURSE',
    label: 'Nurse (Kavya)',
    name: 'Kavya Reddy, RN',
    title: 'Lead Inpatient Charge Nurse & Triage Coordinator',
    department: 'Inpatient Wards & Critical Care (ICU)',
    email: 'kavya.nurse@medcore.hospital',
    password: 'Nurse@2026',
    targetDashboard: 'wards',
    targetDashboardName: 'Inpatient Wards, Bed Census & Patient Vitals',
    badge: 'Charge Nurse',
    color: 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-400 text-emerald-950',
    icon: HeartPulse,
    description: 'Performs patient vitals checkups (BP, pulse, temp, SpO2), administers prescribed medicines, and monitors ward beds.'
  },
  {
    role: 'RECEPTIONIST',
    label: 'Receptionist (Ananya)',
    name: 'Ananya Verma',
    title: 'Front Desk & Patient Intake Lead',
    department: 'Patient Registration & OPD Desk',
    email: 'ananya.reception@medcore.hospital',
    password: 'FrontDesk@2026',
    targetDashboard: 'appointments',
    targetDashboardName: 'Patient Appointments & OPD Reception Desk',
    badge: 'Front Desk',
    color: 'border-amber-200 bg-amber-50/70 hover:border-amber-400 text-amber-950',
    icon: Calendar,
    description: 'Registers new walk-in patients, issues OPD tokens, books doctor appointments, and guides visitors.'
  },
  {
    role: 'LAB_TECHNICIAN',
    label: 'Lab Technician (Rahul)',
    name: 'Rahul Nair',
    title: 'Senior Laboratory & Diagnostics Specialist',
    department: 'Diagnostic Pathology & Hematology',
    email: 'rahul.lab@medcore.hospital',
    password: 'Lab@2026',
    targetDashboard: 'laboratory',
    targetDashboardName: 'Clinical Diagnostic Laboratory & Pathology Reports',
    badge: 'Pathology Lab',
    color: 'border-purple-200 bg-purple-50/70 hover:border-purple-400 text-purple-950',
    icon: FlaskConical,
    description: 'Collects test specimens, runs blood and biochemistry tests, enters diagnostic values, and generates validated lab reports.'
  },
  {
    role: 'PHARMACIST',
    label: 'Pharmacist (Vikram)',
    name: 'Vikram Patel, PharmD',
    title: 'Chief Pharmacist & Dispensary Manager',
    department: 'Hospital Pharmacy & Dispensary',
    email: 'vikram.pharmacy@medcore.hospital',
    password: 'Pharmacy@2026',
    targetDashboard: 'pharmacy',
    targetDashboardName: 'Hospital Dispensary & Medicine Inventory',
    badge: 'Hospital Pharmacy',
    color: 'border-rose-200 bg-rose-50/70 hover:border-rose-400 text-rose-950',
    icon: Pill,
    description: 'Reviews doctor prescriptions, dispenses medications safely with usage instructions, and tracks medicine batch stock.'
  },
  {
    role: 'ACCOUNTANT',
    label: 'Accountant (Suresh)',
    name: 'Suresh Rao (Accountant)',
    title: 'Billing, Insurance & Claims Manager',
    department: 'Finance & Patient Accounts Desk',
    email: 'suresh.billing@medcore.hospital',
    password: 'Billing@2026',
    targetDashboard: 'billing',
    targetDashboardName: 'Cashier Counter, Patient Billing & Invoices',
    badge: 'Accounts & Billing',
    color: 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-400 text-emerald-950',
    icon: Receipt,
    description: 'Prepares patient hospital bills, collects payments (cash, card, UPI), coordinates insurance pre-auth, and issues receipts.'
  },
  {
    role: 'PATIENT',
    label: 'Patient Portal (Pooja)',
    name: 'Pooja Iyer',
    title: 'Patient Member (MRN: MC-2026-0811)',
    department: 'Cardiology Clinic Patient',
    email: 'pooja.patient@example.com',
    password: 'Patient@2026',
    targetDashboard: 'patient-portal',
    targetDashboardName: 'Personal Health Portal, Reports & Online Pay',
    badge: 'Patient Portal',
    color: 'border-teal-200 bg-teal-50/70 hover:border-teal-400 text-teal-950',
    icon: UserCheck,
    description: 'Self-service portal for patients to book consultations, view doctor prescriptions, download lab test reports, and pay bills.'
  }
];

interface LandingPageProps {
  onLogin: (role: UserRole, hospitalId: string, email?: string) => void;
  hospitals: Hospital[];
  activeHospitalId: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  hospitals,
  activeHospitalId
}) => {
  const [selectedHospital, setSelectedHospital] = useState(activeHospitalId || 'hosp-1');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CREDENTIALS' | 'DIRECT_FORM'>('CREDENTIALS');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ADMIN' | 'CLINICAL' | 'DIAGNOSTIC' | 'FRONT' | 'PATIENT'>('ALL');
  const [formError, setFormError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleQuickLogin = (cred: RoleCredential) => {
    onLogin(cred.role, selectedHospital, cred.email);
  };

  const handleDirectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const email = emailInput.trim().toLowerCase();
    if (!email) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const matched = ROLE_CREDENTIALS.find(c => c.email.toLowerCase() === email);
    if (matched) {
      onLogin(matched.role, selectedHospital, matched.email);
      return;
    }

    if (email.includes('super') || email.includes('hari')) {
      onLogin('SUPER_ADMIN', selectedHospital, email);
    } else if (email.includes('teja') || email.includes('admin')) {
      onLogin('HOSPITAL_ADMIN', selectedHospital, email);
    } else if (email.includes('priya') || email.includes('doc') || email.includes('reed')) {
      onLogin('DOCTOR', selectedHospital, email);
    } else if (email.includes('kavya') || email.includes('nurse') || email.includes('vance')) {
      onLogin('NURSE', selectedHospital, email);
    } else if (email.includes('ananya') || email.includes('rec') || email.includes('front')) {
      onLogin('RECEPTIONIST', selectedHospital, email);
    } else if (email.includes('rahul') || email.includes('lab')) {
      onLogin('LAB_TECHNICIAN', selectedHospital, email);
    } else if (email.includes('vikram') || email.includes('pharm')) {
      onLogin('PHARMACIST', selectedHospital, email);
    } else if (email.includes('suresh') || email.includes('bill') || email.includes('account')) {
      onLogin('ACCOUNTANT', selectedHospital, email);
    } else if (email.includes('pooja') || email.includes('patient')) {
      onLogin('PATIENT', selectedHospital, email);
    } else {
      onLogin('DOCTOR', selectedHospital, email);
    }
  };

  const filteredCredentials = ROLE_CREDENTIALS.filter(c => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'ADMIN') return c.role === 'SUPER_ADMIN' || c.role === 'HOSPITAL_ADMIN';
    if (selectedCategory === 'CLINICAL') return c.role === 'DOCTOR' || c.role === 'NURSE';
    if (selectedCategory === 'DIAGNOSTIC') return c.role === 'LAB_TECHNICIAN' || c.role === 'PHARMACIST';
    if (selectedCategory === 'FRONT') return c.role === 'RECEPTIONIST' || c.role === 'ACCOUNTANT';
    if (selectedCategory === 'PATIENT') return c.role === 'PATIENT';
    return true;
  });

  const activeHospital = hospitals.find(h => h.id === selectedHospital) || hospitals[0] || {
    id: 'hosp-1',
    name: 'Metropolitan Medical Center',
    city: 'Metro City',
    state: 'NY',
    capacityBeds: 350
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Emergency & Info Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <Ambulance className="h-3.5 w-3.5 animate-pulse" />
              <span>24/7 Emergency Ambulance: 108 / +1 (800) 432-CARE</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3 text-teal-400" />
              <span>OPD Timings: Mon - Sat (8:00 AM - 8:00 PM)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 hidden md:inline">Current Hospital Branch:</span>
            <div className="flex items-center gap-1 bg-slate-800 text-teal-300 px-2.5 py-0.5 rounded border border-slate-700 font-medium">
              <Building2 className="h-3 w-3" />
              <span>{activeHospital.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hospital Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-md shadow-teal-600/20">
              <div className="h-full w-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Heart className="h-5 w-5 text-teal-400 fill-teal-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">MedCore</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  Hospital Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">Compassionate Healthcare & Multi-Speciality Medical Center</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#services" className="hover:text-teal-600 transition-colors">Medical Services</a>
            <a href="#doctors" className="hover:text-teal-600 transition-colors">Doctors & Faculty</a>
            <a href="#testimonials" className="hover:text-teal-600 transition-colors">Patient Stories</a>
            <a href="#portal-login" className="hover:text-teal-600 transition-colors">Staff & Patient Login</a>
            <a href="#patient-guide" className="hover:text-teal-600 transition-colors">Visiting & FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#portal-login"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" />
              <span>Sign In to Portal</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Warm, Trustworthy, Human */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-teal-50/60 via-sky-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hospital Greeting & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>NABH & HIPAA Accredited Multi-Speciality Healthcare Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Advanced Healthcare with <span className="text-teal-600">Human Care</span> and Dedication
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Welcome to MedCore Hospital Portal. We provide seamless care coordination for doctors, nurses, hospital staff, and patients. Experience comprehensive inpatient care, specialist OPD clinics, advanced laboratory diagnostics, and patient digital records in one trusted system.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#portal-login"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 group"
                >
                  <Users className="h-4 w-4" />
                  <span>Choose Your Staff Role</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => onLogin('DOCTOR', selectedHospital, 'priya.sharma@medcore.hospital')}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-2"
                >
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  <span>Enter as Dr. Priya Sharma</span>
                </button>

                <button
                  onClick={() => onLogin('PATIENT', selectedHospital, 'pooja.patient@example.com')}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4 text-teal-600" />
                  <span>Enter as Patient (Pooja)</span>
                </button>
              </div>

              {/* Human Hospital Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>24/7 Emergency & Trauma Care</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>In-House Pharmacy & Lab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Cashless Mediclaim Desk</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hospital Quick Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Hospital Facility Snapshot</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeHospital.name}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-2xl font-black text-slate-900">350+</div>
                    <div className="text-[11px] text-slate-600 font-medium">Hospital Beds</div>
                    <div className="text-[10px] text-teal-600 mt-0.5">ICU, HDU & General Wards</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-2xl font-black text-teal-700">45+</div>
                    <div className="text-[11px] text-slate-600 font-medium">Senior Doctors</div>
                    <div className="text-[10px] text-teal-600 mt-0.5">Specialists & Surgeons</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-2xl font-black text-sky-700">24/7</div>
                    <div className="text-[11px] text-slate-600 font-medium">Emergency & ICU</div>
                    <div className="text-[10px] text-sky-600 mt-0.5">Critical Care On-Duty</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-2xl font-black text-emerald-700">100%</div>
                    <div className="text-[11px] text-slate-600 font-medium">Digital Care EMR</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">Electronic Health Records</div>
                  </div>
                </div>

                <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-teal-700" />
                    <div>
                      <span className="font-bold">Appointments Helpdesk:</span>
                      <p className="text-[11px] text-teal-800">+1 (800) 432-CARE</p>
                    </div>
                  </div>
                  <a
                    href="#portal-login"
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-[11px] transition-colors"
                  >
                    Quick Sign In
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hospital Staff & Patient Portal Sign In Section */}
      <section id="portal-login" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Key className="h-4 w-4" />
              <span>Hospital Staff & Patient Sign In</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Access Your Daily Hospital Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Select your role or click on any staff member below to log in directly into their active medical workspace with role-specific tools and patient queues.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300 shrink-0">
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'CREDENTIALS'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quick Role Login (Staff & Patients)
            </button>
            <button
              onClick={() => setActiveTab('DIRECT_FORM')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'DIRECT_FORM'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hospital Staff Login Form
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        {activeTab === 'CREDENTIALS' && (
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'ALL', label: 'All Roles' },
              { id: 'ADMIN', label: 'Executive & Admin (Hari, Teja)' },
              { id: 'CLINICAL', label: 'Doctors & Nursing (Dr. Priya, Kavya)' },
              { id: 'DIAGNOSTIC', label: 'Lab & Pharmacy (Rahul, Vikram)' },
              { id: 'FRONT', label: 'Reception & Billing (Ananya, Suresh)' },
              { id: 'PATIENT', label: 'Patient Portal (Pooja)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-xs scale-105'
                    : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 hover:-translate-y-0.5 hover:shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* VIEW 1: Role Credential Cards */}
        {activeTab === 'CREDENTIALS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCredentials.map((cred) => {
              const Icon = cred.icon;
              return (
                <div
                  key={cred.role}
                  onClick={() => handleQuickLogin(cred)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group shadow-xs relative overflow-hidden cursor-pointer hover:bg-gradient-to-b hover:from-white hover:to-teal-50/20"
                >
                  <div className="space-y-4 min-w-0">
                    {/* Persona Header with Avatar Initial and Safely Contained Badge */}
                    <div className="flex items-start justify-between gap-2.5 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all shadow-2xs">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-teal-900 transition-colors" title={cred.name}>
                            {cred.name}
                          </h3>
                          <p className="text-[11px] text-teal-700 font-semibold truncate" title={cred.title}>
                            {cred.title}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap self-start group-hover:border-teal-300 group-hover:bg-teal-50 group-hover:text-teal-800 transition-colors">
                        {cred.badge}
                      </span>
                    </div>

                    {/* Department & Description */}
                    <div className="text-xs min-w-0">
                      <div className="text-slate-500 font-medium truncate">{cred.department}</div>
                      <p className="text-slate-600 mt-1 leading-relaxed text-[12px] line-clamp-3">
                        {cred.description}
                      </p>
                    </div>

                    {/* Credentials Info Box */}
                    <div className="p-3 rounded-xl bg-slate-50/90 group-hover:bg-teal-50/30 border border-slate-200/90 group-hover:border-teal-200 transition-colors space-y-1.5 text-xs overflow-hidden">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-slate-500 text-[11px] shrink-0">Email:</span>
                        <div className="flex items-center gap-1 font-mono text-slate-800 text-[11px] min-w-0 flex-1 justify-end">
                          <span className="truncate" title={cred.email}>{cred.email}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(cred.email, `${cred.role}-email`, e);
                            }}
                            className="p-1 hover:text-teal-600 text-slate-400 hover:bg-white rounded transition-colors shrink-0"
                            title="Copy email"
                          >
                            {copiedKey === `${cred.role}-email` ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-slate-500 text-[11px] shrink-0">Password:</span>
                        <div className="flex items-center gap-1 font-mono text-slate-800 text-[11px] min-w-0 flex-1 justify-end">
                          <span className="font-semibold">{cred.password}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(cred.password, `${cred.role}-pwd`, e);
                            }}
                            className="p-1 hover:text-teal-600 text-slate-400 hover:bg-white rounded transition-colors shrink-0"
                            title="Copy password"
                          >
                            {copiedKey === `${cred.role}-pwd` ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200/80 group-hover:border-teal-200/80 flex items-center justify-between gap-2 text-[11px] min-w-0">
                        <span className="text-slate-500 shrink-0">Opens:</span>
                        <span className="text-teal-800 font-semibold truncate text-right flex-1" title={cred.targetDashboardName}>
                          {cred.targetDashboardName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Big Friendly Action Button */}
                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(cred);
                      }}
                      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 group-hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Sign In as {cred.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: Direct Authentication Form */}
        {activeTab === 'DIRECT_FORM' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
            <div className="text-center space-y-1 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign In to MedCore Hospital Portal</h3>
              <p className="text-xs text-slate-500">
                Enter your staff or patient credentials to access your account
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleDirectFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hospital Facility Branch
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@medcore.hospital"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-600 focus:bg-white placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate & Launch Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 mb-3">Quick autofill shortcuts:</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {ROLE_CREDENTIALS.slice(0, 6).map(c => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => {
                      setEmailInput(c.email);
                      setPasswordInput(c.password);
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium border border-slate-200 transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Hospital Medical Specialities & Services */}
      <section id="services" className="py-16 border-t border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">Comprehensive Clinical Care</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospital Departments & Specialized Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Our multidisciplinary healthcare teams offer compassionate medical care across key inpatient and outpatient clinical departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Cardiology & Heart Care',
                desc: 'Specialized cardiac care led by Dr. Priya Sharma. Advanced ECG, 2D Echocardiography, cardiac monitoring, and hypertension clinics.',
                icon: Heart,
                badge: 'Lead Dept'
              },
              {
                title: '24/7 Emergency & Trauma Care',
                desc: 'Round-the-clock emergency response with fully equipped resuscitation bays, rapid triage by Kavya RN, and immediate life support.',
                icon: Ambulance,
                badge: '24/7 Care'
              },
              {
                title: 'Inpatient Wards & Modern ICU',
                desc: 'Comfortable patient recovery wards and intensive care units with automated vitals monitoring, oxygen points, and bedside nursing rounds.',
                icon: HeartPulse,
                badge: '350 Beds'
              },
              {
                title: 'Automated Pathology Laboratory',
                desc: 'Complete blood counts (CBC), lipid profiles, blood sugar, and thyroid assays managed by Rahul Nair with barcoded specimen safety.',
                icon: FlaskConical,
                badge: 'Diagnostics'
              },
              {
                title: 'Hospital Pharmacy & Dispensary',
                desc: '24-hour dispensary overseen by Vikram Patel, PharmD, ensuring accurate dispensing, verified dosages, and genuine medicine supply.',
                icon: Pill,
                badge: 'Formulary'
              },
              {
                title: 'Outpatient Registration & Billing',
                desc: 'Friendly front-desk desk managed by Ananya Verma and Suresh Rao, offering transparent hospital bills and cashless insurance processing.',
                icon: Receipt,
                badge: 'Patient Desk'
              }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 space-y-3 group cursor-pointer overflow-hidden shadow-xs hover:bg-gradient-to-b hover:from-white hover:to-teal-50/25">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 group-hover:border-teal-300 group-hover:bg-teal-100/70 transition-colors">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-900 transition-colors">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Medical Team & Staff */}
      <section id="doctors" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">Our Dedicated Care Team</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Senior Doctors & Hospital Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Experienced medical professionals and administrators committed to delivering the highest standard of patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Dr. Priya Sharma, MD',
              role: 'Chief Cardiologist & Physician',
              dept: 'Cardiology Clinic',
              exp: '16+ Years Experience',
              actionRole: 'DOCTOR' as UserRole,
              email: 'priya.sharma@medcore.hospital'
            },
            {
              name: 'Hari Srinivas',
              role: 'Executive Medical Director & Super Admin',
              dept: 'Hospital Board',
              exp: 'Healthcare Systems Director',
              actionRole: 'SUPER_ADMIN' as UserRole,
              email: 'hari.admin@medcore.global'
            },
            {
              name: 'Teja Kumar',
              role: 'Hospital Operations Administrator',
              dept: 'Administration & Governance',
              exp: 'Healthcare Operations',
              actionRole: 'HOSPITAL_ADMIN' as UserRole,
              email: 'teja.admin@medcore.hospital'
            },
            {
              name: 'Kavya Reddy, RN',
              role: 'Lead Inpatient Charge Nurse',
              dept: 'Critical Care & Wards',
              exp: '12+ Years Nursing Care',
              actionRole: 'NURSE' as UserRole,
              email: 'kavya.nurse@medcore.hospital'
            }
          ].map((doc, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-xl hover:-translate-y-2 p-5 shadow-xs text-center space-y-3 flex flex-col justify-between transition-all duration-300 group overflow-hidden hover:bg-gradient-to-b hover:from-white hover:to-teal-50/20">
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-600/20 group-hover:scale-110 group-hover:shadow-teal-600/40 transition-all duration-300">
                  {doc.name.split(' ')[0][0]}{doc.name.split(' ')[1] ? doc.name.split(' ')[1][0] : ''}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-teal-900 transition-colors">{doc.name}</h3>
                <p className="text-xs text-teal-700 font-semibold">{doc.role}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{doc.dept} • {doc.exp}</p>
              </div>

              <button
                onClick={() => onLogin(doc.actionRole, selectedHospital, doc.email)}
                className="w-full py-2.5 px-3 bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700 font-semibold text-xs rounded-xl shadow-xs group-hover:shadow-md transition-all cursor-pointer"
              >
                Sign In as {doc.name.split(',')[0]}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Stories & Family Testimonials (Real Human Care) */}
      <section id="testimonials" className="py-16 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">Patient Trust & Recovery Stories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cared for Over 50,000 Families with Dignity & Compassion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hear directly from patients and their loved ones about their healing journeys at MedCore Multi-Speciality Hospital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Dr. Priya Sharma and the cardiology ICU nursing team under Kavya RN were extraordinary during my father's emergency angioplasty. They explained every vitals change with patience and kindness.",
                author: "Rajesh Malhotra",
                relation: "Patient Family Member",
                department: "Cardiology & Intensive Care",
                rating: 5
              },
              {
                quote: "Having my OPD consultation notes, prescription refills, and blood test reports immediately synchronized on my phone via the patient portal made post-operative follow-up completely stress-free.",
                author: "Pooja Iyer",
                relation: "Outpatient Care Member",
                department: "Outpatient Clinic & Pathology",
                rating: 5
              },
              {
                quote: "Suresh Rao at the Cashless Billing desk helped us clear our insurance approval in under 30 minutes. No hidden expenses, fully transparent invoices, and exceptionally clean recovery wards.",
                author: "Sunita & Arvind Deshmukh",
                relation: "Inpatient Surgical Recovery",
                department: "General Surgery & Billing",
                rating: 5
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xl hover:-translate-y-2 shadow-xs flex flex-col justify-between space-y-4 transition-all duration-300 group overflow-hidden">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 group-hover:scale-110 transition-transform" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{t.author}</div>
                    <div className="text-[11px] text-teal-700 font-medium">{t.relation}</div>
                  </div>
                  <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-800 transition-colors">
                    {t.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Accreditations & Quality Standards */}
      <section className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">Clinical Standards & Governance</span>
            <h3 className="text-xl font-bold text-slate-900">Recognized for Excellence in Patient Safety & Clinical Hygiene</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'NABH Accredited', subtitle: 'National Hospital Quality Council', desc: 'Highest standard in healthcare safety protocols' },
              { title: 'JCI Gold Seal', subtitle: 'Joint Commission International', desc: 'Global benchmark for infection control & clinical care' },
              { title: 'NABL Certified Lab', subtitle: 'Pathology & Bio-Chemistry', desc: 'Accredited high-precision diagnostic results' },
              { title: 'ISO 9001:2015', subtitle: 'Hospital Facility Operations', desc: 'Standardized patient admission & discharge protocols' }
            ].map((acc, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-1 hover:bg-white bg-slate-50/70 text-center space-y-1 transition-all duration-200 group cursor-default">
                <ShieldCheck className="h-6 w-6 text-teal-600 mx-auto group-hover:scale-110 group-hover:text-teal-700 transition-transform" />
                <div className="text-xs font-bold text-slate-900 pt-1 group-hover:text-teal-900 transition-colors">{acc.title}</div>
                <div className="text-[10px] text-teal-700 font-semibold">{acc.subtitle}</div>
                <div className="text-[10px] text-slate-700 leading-tight">{acc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient & Family Frequently Asked Questions */}
      <section className="py-14 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">Patient Support</span>
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-600">Common questions about outpatient visits, bed admissions, and insurance assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "How do I schedule an OPD consultation with Dr. Priya Sharma?",
                a: "You can book directly via the Patient Portal (sign in as Pooja Iyer), call our 24/7 helpline at +1 (800) 432-CARE, or visit the front desk (Ananya Verma) during OPD hours."
              },
              {
                q: "How does cashless insurance hospitalization work?",
                a: "Our dedicated Billing Desk (Suresh Rao) coordinates pre-authorization with major health insurance TPAs and government schemes within 30 minutes of emergency or planned admission."
              },
              {
                q: "Can I view my blood test reports and prescriptions online?",
                a: "Yes. Once Rahul Nair (Lab Specialist) verifies your laboratory test results, they are instantly synchronized to your secure Patient Portal and doctor review screen."
              },
              {
                q: "What should I bring for inpatient admission?",
                a: "Please bring government-issued photo ID, health insurance card/policy document, previous prescription history, and emergency contact details to the front registration desk."
              }
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md hover:-translate-y-1 shadow-xs space-y-2 transition-all duration-200 group">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5 group-hover:text-teal-700 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{faq.q}</h4>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient & Visitor Guide (Human Care Essentials) */}
      <section id="patient-guide" className="py-14 border-t border-slate-200 bg-slate-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2 p-3 rounded-xl hover:bg-teal-50/40 hover:shadow-2xs transition-all duration-200 group">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm group-hover:text-teal-800 transition-colors">
                  <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Inpatient Visiting Hours</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Morning: 10:00 AM – 12:00 PM<br />
                  Evening: 5:00 PM – 7:00 PM<br />
                  Only 1 visitor allowed per patient inside ICU areas to ensure patient safety and infection control.
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-xl hover:bg-teal-50/40 hover:shadow-2xs transition-all duration-200 group">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm group-hover:text-teal-800 transition-colors">
                  <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Cashless Insurance & TPA</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our Billing Desk (Suresh Rao) supports cashless hospitalization with all major health insurance providers and government health schemes.
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-xl hover:bg-teal-50/40 hover:shadow-2xs transition-all duration-200 group">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm group-hover:text-teal-800 transition-colors">
                  <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Helpdesk & Contacts</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Emergency Line: 108<br />
                  Front Desk: +1 (800) 432-CARE<br />
                  Email: info@medcore.hospital
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Floating Scroll-to-Top Button with Hover Elevation & Glow */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 sm:px-4 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <ChevronUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline-block pr-1">Back to Top</span>
        </button>
      )}

      {/* Human Healthcare Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-teal-600 fill-teal-600/20" />
            <span className="font-bold text-slate-900">MedCore Multi-Speciality Hospital</span>
            <span>•</span>
            <span>Compassionate Care, Advanced Medicine</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#portal-login" className="text-teal-700 hover:underline font-semibold">
              Staff & Patient Login
            </a>
            <a href="#services" className="hover:text-slate-900 transition-colors">
              Medical Services
            </a>
            <span>Emergency: 108</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
