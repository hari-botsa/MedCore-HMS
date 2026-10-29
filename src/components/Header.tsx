import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  RotateCcw, 
  AlertTriangle, 
  UserCheck, 
  Layers,
  Building2,
  Bell,
  ChevronDown,
  Check,
  ShieldAlert,
  ExternalLink,
  Pill,
  FlaskConical,
  LogOut,
  Menu
} from 'lucide-react';
import { UserProfile, UserRole, Hospital, Notification } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  userRole?: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeHospitalId?: string;
  hospitals?: Hospital[];
  onSwitchHospital?: (hospId: string) => void;
  bedOccupancyRate?: number;
  emergencyCount?: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onResetDemo?: () => void;
  notifications?: Notification[];
  notificationsCount?: number;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  userRole,
  onRoleChange,
  activeHospitalId,
  hospitals = [],
  onSwitchHospital,
  bedOccupancyRate = 0,
  emergencyCount = 0,
  searchQuery = '',
  onSearchChange = () => {},
  onResetDemo = () => {},
  notifications = [],
  notificationsCount,
  onOpenNotifications,
  onLogout,
  isMobileNavOpen,
  onToggleMobileNav,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);

  const activeHosp = hospitals.find(h => h.id === activeHospitalId) || hospitals[0] || {
    id: 'hosp-1',
    name: 'Metropolitan Medical Center',
    code: 'MMC',
    type: 'TERTIARY_CARE'
  };

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (Hari)', desc: 'Hari Srinivas • Multi-tenant management & platform architecture' },
    { role: 'HOSPITAL_ADMIN', label: 'Hospital Admin (Teja)', desc: 'Teja Kumar • Facility governance & department bed censuses' },
    { role: 'DOCTOR', label: 'Doctor (Dr. Priya)', desc: 'Dr. Priya Sharma, MD • Clinical EMR, SOAP notes & prescriptions' },
    { role: 'NURSE', label: 'Nurse (Kavya)', desc: 'Kavya Reddy, RN • Vitals intake, bed triage & patient monitoring' },
    { role: 'RECEPTIONIST', label: 'Receptionist (Ananya)', desc: 'Ananya Verma • Patient check-in & conflict-free scheduling' },
    { role: 'LAB_TECHNICIAN', label: 'Lab Technician (Rahul)', desc: 'Rahul Nair • Diagnostics & specimen approval workflows' },
    { role: 'PHARMACIST', label: 'Pharmacist (Vikram)', desc: 'Vikram Patel, PharmD • FIFO batch inventory & dispensary' },
    { role: 'ACCOUNTANT', label: 'Accountant (Suresh)', desc: 'Suresh Rao • Billing, Claims & Stripe reconciliation' },
    { role: 'PATIENT', label: 'Patient Portal (Pooja)', desc: 'Pooja Iyer • Medical records, telehealth & self-service' }
  ];

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-3 sm:px-6 h-16 gap-2">
        
        {/* Left: Brand Identity, Mobile Toggle & Tenant Hospital Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Navigation Hamburger (Visible on < lg screens) */}
          {onToggleMobileNav && (
            <button
              id="mobile-nav-toggle-btn"
              onClick={onToggleMobileNav}
              className="p-2 -ml-1 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
              title="Toggle Hospital Navigation"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">MedCore</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                HMS 1.0
              </span>
            </div>
            
            {/* Multi-Tenant Hospital Dropdown */}
            <div className="relative">
              <button 
                id="tenant-switcher-btn"
                onClick={() => {
                  setShowTenantMenu(!showTenantMenu);
                  setShowRoleMenu(false);
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-teal-700 transition-colors"
              >
                <Building2 className="h-3 w-3 text-teal-600" />
                <span className="font-semibold text-slate-800 max-w-[120px] sm:max-w-[200px] truncate">
                  {activeHosp.name}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showTenantMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Multi-Tenant SaaS Facilities
                  </div>
                  {hospitals.map(h => (
                    <button
                      key={h.id}
                      onClick={() => {
                        onSwitchHospital?.(h.id);
                        setShowTenantMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        h.id === activeHospitalId ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{h.name}</div>
                        <div className="text-[10px] text-slate-500">{h.city}, {h.state} • {h.capacityBeds} Beds</div>
                      </div>
                      {h.id === activeHospitalId && <Check className="h-4 w-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Search & Realtime Hospital Status Ticker */}
        <div className="hidden md:flex items-center gap-3 max-w-md w-full mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="global-hospital-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patients, MRN (e.g. MC-2026), doctors, drugs..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
            />
          </div>

          {/* Realtime Bed & ER indicators */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700" title="Hospital Bed Capacity">
              <Layers className="h-3.5 w-3.5 text-teal-600" />
              <span className="hidden lg:inline">Beds:</span>
              <span className={`font-bold ${bedOccupancyRate > 85 ? 'text-amber-600' : 'text-slate-900'}`}>
                {bedOccupancyRate}%
              </span>
            </div>

            {emergencyCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span>ER:{emergencyCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications, 9-Role Switcher & Reset */}
        <div className="flex items-center gap-2">
          
          {/* Notification Bell with Badge */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Hospital Notifications Center (In-App, Email, SMS)"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* 9 User Roles Dropdown */}
          <div className="relative">
            <button
              id="role-switcher-dropdown"
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowTenantMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold hover:bg-teal-100 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 text-teal-700" />
              <span className="max-w-[120px] truncate">{currentUser.role.replace('_', ' ')}</span>
              <ChevronDown className="h-3 w-3 text-teal-700" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 max-h-[460px] overflow-y-auto">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Hospital Staff Directory & Roles
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Active: {currentUser.name}
                  </div>
                </div>

                <div className="space-y-1">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      id={`role-opt-${r.role.toLowerCase()}`}
                      onClick={() => {
                        onRoleChange(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === r.role
                          ? 'bg-teal-600 text-white font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${currentUser.role === r.role ? 'text-white' : 'text-slate-900'}`}>
                          {r.label}
                        </div>
                        <div className={`text-[10px] ${currentUser.role === r.role ? 'text-teal-100' : 'text-slate-400'}`}>
                          {r.desc}
                        </div>
                      </div>
                      {currentUser.role === r.role && <Check className="h-4 w-4 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Data Cache */}
          <button
            id="refresh-data-button"
            onClick={onResetDemo}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Synchronize & Refresh Hospital Data"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Logout / Exit to Landing Page */}
          {onLogout && (
            <button
              id="logout-button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              title="Exit to Landing Page & Switch Login"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
