import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  BedDouble, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Stethoscope,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { HospitalStats, Appointment, Patient, Bed, Doctor } from '../types';

interface DashboardViewProps {
  stats: HospitalStats | null;
  appointments: Appointment[];
  patients: Patient[];
  beds: Bed[];
  doctors: Doctor[];
  onNavigate: (tab: any) => void;
  onSelectPatient: (patientId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  appointments,
  patients,
  beds,
  doctors,
  onNavigate,
  onSelectPatient,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'REVENUE' | 'DEPARTMENTS'>('REVENUE');

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED');
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE');
  const cleaningBeds = beds.filter(b => b.status === 'CLEANING');

  const upcomingApts = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS' || a.status === 'IN_CONSULTATION').slice(0, 5);
  const emergencyPatients = patients.filter(p => p.status === 'EMERGENCY');

  const monthlyRevenueData = [
    { month: 'Apr', revenue: 195000, target: 180000, collections: 188000 },
    { month: 'May', revenue: 210000, target: 200000, collections: 202000 },
    { month: 'Jun', revenue: 235000, target: 220000, collections: 226000 },
    { month: 'Jul', revenue: 228000, target: 230000, collections: 221000 },
    { month: 'Aug', revenue: 254000, target: 240000, collections: 247000 },
    { month: 'Sep', revenue: 268000, target: 250000, collections: 259000 },
  ];

  const departmentPerformanceData = [
    { department: 'Cardiology', patients: 38, revenue: 48200 },
    { department: 'Emergency', patients: 52, revenue: 64100 },
    { department: 'Internal Med', patients: 44, revenue: 31900 },
    { department: 'Pediatrics', patients: 29, revenue: 22400 },
    { department: 'Diagnostic Lab', patients: 65, revenue: 19800 },
    { department: 'Inpatient Rx', patients: 71, revenue: 27500 },
    { department: 'Orthopedics', patients: 21, revenue: 36200 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Executive Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time clinical throughput, bed census, and patient appointment tracking</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="dash-admit-btn"
            onClick={() => onNavigate('wards')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <BedDouble className="h-3.5 w-3.5" />
            <span>Admit / Manage Beds</span>
          </button>
          <button
            id="dash-new-apt-btn"
            onClick={() => onNavigate('appointments')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book Appointment</span>
          </button>
          <button
            id="dash-ai-btn"
            onClick={() => onNavigate('ai-assist')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-lg border border-cyan-200 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
            <span>Clinical Decision Support (CDSS)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Bed Census */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Bed Occupancy Rate</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.bedOccupancyRate ?? 25}%</span>
            <span className="text-xs text-slate-600 font-medium">
              ({stats?.occupiedBeds ?? occupiedBeds.length} of {stats?.totalBeds ?? beds.length} beds)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div 
              className="bg-teal-600 h-full transition-all" 
              style={{ width: `${stats?.bedOccupancyRate ?? 25}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-700">
            <span>{availableBeds.length} Available</span>
            <span>{cleaningBeds.length} Sanitizing</span>
          </div>
        </div>

        {/* Metric 2: Active Patients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Patient Census</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.totalPatients ?? patients.length}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> Inpatients: {stats?.activeInpatients ?? 3}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Active under EMR monitoring with complete histories
          </p>
        </div>

        {/* Metric 3: Today's Appointments */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Consultations Today</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats?.todayAppointmentsCount ?? appointments.length}</span>
            <span className="text-xs font-medium text-slate-600">scheduled</span>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            {appointments.filter(a => a.status === 'COMPLETED').length} completed, {appointments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'IN_CONSULTATION').length} in-progress
          </p>
        </div>

        {/* Metric 4: Revenue & Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Billing & Receivables</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">${(stats?.todayRevenue ?? 4850).toLocaleString()}</span>
            <span className="text-xs font-medium text-slate-600">cleared today</span>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            {stats?.pendingClaimsCount ?? 2} pending claims filed to insurers
          </p>
        </div>
      </div>

      {/* Emergency Triage Alert Banner if any */}
      {emergencyPatients.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Emergency Department Active Triage</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                {emergencyPatients.length} patient(s) currently admitted to Emergency Bay triage. Immediate clinician review active.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {emergencyPatients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className="px-2.5 py-1 rounded bg-white text-xs font-semibold text-rose-800 border border-rose-300 shadow-2xs hover:bg-rose-100"
                  >
                    {p.firstName} {p.lastName} ({p.mrn}) - Bed: {p.assignedBed || 'Triage'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('patients')}
            className="text-xs font-bold text-rose-800 hover:underline shrink-0"
          >
            View ER Registry &rarr;
          </button>
        </div>
      )}

      {/* Recharts Analytics Section: Financial Trends & Departmental Throughput */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Hospital Operational & Financial Performance</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis of monthly billing realizations and clinical throughput across departments
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab('REVENUE')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeChartTab === 'REVENUE'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Realization
            </button>
            <button
              onClick={() => setActiveChartTab('DEPARTMENTS')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeChartTab === 'DEPARTMENTS'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Department Encounters
            </button>
          </div>
        </div>

        {activeChartTab === 'REVENUE' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600"></span>
                  <span className="font-semibold">Gross Billed</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold">Cash/Ins. Collected</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  <span>Operational Target</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Current Run Rate: </span>
                <span className="font-bold text-slate-900">$268,000 / mo</span>
                <span className="text-emerald-600 font-bold ml-1.5">(+12.4% vs Target)</span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tickFormatter={(v) => `$${v / 1000}k`} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `$${Number(value).toLocaleString()}`, 
                      name === 'revenue' ? 'Billed Revenue' : name === 'collections' ? 'Collections' : 'Target'
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="collections" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCollections)" />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Active patient registrations & encounters recorded this billing cycle</span>
              <span className="font-semibold text-slate-700">Highest Volume: Pharmacy (71) & Diagnostic Lab (65)</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value} Patients`, 
                      'Patient Encounters'
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="patients" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Dual Section: Ward Status Breakdown & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Realtime Ward Capacities */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inpatient Ward Bed Distribution</h3>
              <p className="text-xs text-slate-500">Live occupancy categorized by clinical department</p>
            </div>
            <button
              onClick={() => onNavigate('wards')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Floor Plan &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Intensive Care Unit (ICU)', wardKey: 'ICU', total: 5, occupied: beds.filter(b => b.ward === 'ICU' && b.status === 'OCCUPIED').length, color: 'bg-rose-500' },
              { name: 'Emergency Triage Bays', wardKey: 'EMERGENCY', total: 4, occupied: beds.filter(b => b.ward === 'EMERGENCY' && b.status === 'OCCUPIED').length, color: 'bg-amber-500' },
              { name: 'General Inpatient Ward A & B', wardKey: 'GENERAL_WARD_A', total: 6, occupied: beds.filter(b => (b.ward === 'GENERAL_WARD_A' || b.ward === 'GENERAL_WARD_B') && b.status === 'OCCUPIED').length, color: 'bg-teal-500' },
              { name: 'Surgical Recovery', wardKey: 'SURGICAL_RECOVERY', total: 2, occupied: beds.filter(b => b.ward === 'SURGICAL_RECOVERY' && b.status === 'OCCUPIED').length, color: 'bg-indigo-500' },
              { name: 'Pediatrics Wing', wardKey: 'PEDIATRICS', total: 2, occupied: beds.filter(b => b.ward === 'PEDIATRICS' && b.status === 'OCCUPIED').length, color: 'bg-emerald-500' },
            ].map(w => {
              const pct = Math.round((w.occupied / w.total) * 100);
              return (
                <div key={w.name} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                    <span className="text-slate-800 font-semibold">{w.name}</span>
                    <span className="text-slate-600 font-mono">{w.occupied} / {w.total} Beds ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className={`${w.color} h-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-600"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span> Sanitizing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span> Maintenance
            </span>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Consultations */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Today's Appointment Desk</h3>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                All &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingApts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No appointments scheduled</p>
              ) : (
                upcomingApts.map(apt => (
                  <div 
                    key={apt.id}
                    onClick={() => onSelectPatient(apt.patientId)}
                    className="p-3 rounded-lg border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/20 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        (apt.status === 'IN_PROGRESS' || apt.status === 'IN_CONSULTATION') ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{apt.reason}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>{apt.doctorName.split(',')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('consultation')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Stethoscope className="h-3.5 w-3.5 text-teal-400" />
              <span>Open Doctor Consultation Desk</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
