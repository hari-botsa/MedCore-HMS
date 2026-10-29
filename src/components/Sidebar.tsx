import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  BedDouble, 
  Receipt, 
  UserCog, 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  FlaskConical, 
  Pill, 
  Bell, 
  UserCheck, 
  Workflow, 
  LogOut,
  ShieldCheck,
  BadgeCheck,
  X
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

export type NavTab = 
  | 'dashboard' 
  | 'patients' 
  | 'appointments' 
  | 'consultation' 
  | 'laboratory' 
  | 'pharmacy' 
  | 'wards' 
  | 'billing' 
  | 'notifications' 
  | 'patient-portal' 
  | 'staff' 
  | 'ai-assist' 
  | 'blueprint' 
  | 'audit-api';

export const ROLE_ALLOWED_TABS: Record<UserRole, NavTab[]> = {
  SUPER_ADMIN: ['dashboard', 'patients', 'appointments', 'wards', 'staff', 'billing', 'notifications', 'blueprint', 'audit-api'],
  HOSPITAL_ADMIN: ['dashboard', 'patients', 'appointments', 'wards', 'staff', 'billing', 'audit-api', 'notifications'],
  DOCTOR: ['consultation', 'patients', 'appointments', 'laboratory', 'pharmacy', 'ai-assist', 'notifications'],
  NURSE: ['wards', 'patients', 'appointments', 'consultation', 'notifications'],
  RECEPTIONIST: ['appointments', 'patients', 'staff', 'notifications'],
  LAB_TECHNICIAN: ['laboratory', 'patients', 'notifications'],
  PHARMACIST: ['pharmacy', 'patients', 'notifications'],
  ACCOUNTANT: ['billing', 'dashboard', 'patients', 'notifications'],
  PATIENT: ['patient-portal', 'appointments', 'billing', 'notifications']
};

export const ROLE_DEFAULT_TABS: Record<UserRole, NavTab> = {
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

interface SidebarProps {
  currentTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
  userRole: UserRole;
  currentUser?: UserProfile;
  hospitalName?: string;
  onLogout?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  counts?: {
    patients?: number;
    appointments?: number;
    inpatients?: number;
    unpaidBills?: number;
    pendingLabs?: number;
    lowStock?: number;
    unreadNotifs?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabSelect,
  userRole,
  currentUser,
  hospitalName = 'Metropolitan Medical Center',
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
  counts
}) => {
  // Generate strictly role-specific navigation list
  const getNavItemsForRole = () => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        return [
          { id: 'dashboard' as NavTab, label: 'Executive Hospital Overview', icon: LayoutDashboard, section: 'Hospital Governance' },
          { id: 'patients' as NavTab, label: 'Patients Directory & Records', icon: Users, count: counts?.patients, section: 'Hospital Governance' },
          { id: 'appointments' as NavTab, label: 'Appointments & OPD', icon: Calendar, count: counts?.appointments, section: 'Hospital Governance' },
          { id: 'wards' as NavTab, label: 'Inpatient Beds & Wards', icon: BedDouble, count: counts?.inpatients, badgeColor: 'bg-teal-950 text-teal-300 border border-teal-700', section: 'Facility Operations' },
          { id: 'staff' as NavTab, label: 'Doctors & Hospital Staff', icon: UserCog, section: 'Facility Operations' },
          { id: 'billing' as NavTab, label: 'Financial Revenue & Billing', icon: Receipt, count: counts?.unpaidBills, badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700', section: 'Facility Operations' },
          { id: 'notifications' as NavTab, label: 'Hospital Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Facility Operations' },
          { id: 'blueprint' as NavTab, label: 'System Architecture', icon: Workflow, section: 'System Administration' },
          { id: 'audit-api' as NavTab, label: 'Audit Trail & Logs', icon: ShieldAlert, section: 'System Administration' }
        ];

      case 'HOSPITAL_ADMIN':
        return [
          { id: 'dashboard' as NavTab, label: 'Facility Dashboard', icon: LayoutDashboard, section: 'Hospital Operations' },
          { id: 'patients' as NavTab, label: 'Patients Registry & EMR', icon: Users, count: counts?.patients, section: 'Hospital Operations' },
          { id: 'appointments' as NavTab, label: 'Facility Appointments', icon: Calendar, count: counts?.appointments, section: 'Hospital Operations' },
          { id: 'wards' as NavTab, label: 'Wards & Bed Census', icon: BedDouble, count: counts?.inpatients, badgeColor: 'bg-teal-950 text-teal-300 border border-teal-700', section: 'Clinical Governance' },
          { id: 'staff' as NavTab, label: 'Staff & Physician Roster', icon: UserCog, section: 'Clinical Governance' },
          { id: 'billing' as NavTab, label: 'Hospital Billing & Claims', icon: Receipt, count: counts?.unpaidBills, badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700', section: 'Finance & Audits' },
          { id: 'audit-api' as NavTab, label: 'Facility Audit Trail & API', icon: ShieldAlert, section: 'Finance & Audits' },
          { id: 'notifications' as NavTab, label: 'Operations Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Finance & Audits' }
        ];

      case 'DOCTOR':
        return [
          { id: 'consultation' as NavTab, label: 'Clinical SOAP & Rx', icon: Stethoscope, section: 'Clinical Practice' },
          { id: 'patients' as NavTab, label: 'Patients & EMR Records', icon: Users, count: counts?.patients, section: 'Clinical Practice' },
          { id: 'appointments' as NavTab, label: 'Doctor OPD Schedule', icon: Calendar, count: counts?.appointments, section: 'Clinical Practice' },
          { id: 'laboratory' as NavTab, label: 'Lab Orders & Diagnostics', icon: FlaskConical, count: counts?.pendingLabs, badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-700', section: 'Diagnostics & Pharmacy' },
          { id: 'pharmacy' as NavTab, label: 'Formulary & Prescriptions', icon: Pill, count: counts?.lowStock, badgeColor: 'bg-amber-950 text-amber-300 border border-amber-700', section: 'Diagnostics & Pharmacy' },
          { id: 'ai-assist' as NavTab, label: 'Clinical Decision Support (CDSS)', icon: Sparkles, badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-700', section: 'Decision Support' },
          { id: 'notifications' as NavTab, label: 'Clinical & Stat Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Decision Support' }
        ];

      case 'NURSE':
        return [
          { id: 'wards' as NavTab, label: 'Wards & Bed Census', icon: BedDouble, count: counts?.inpatients, badgeColor: 'bg-teal-950 text-teal-300 border border-teal-700', section: 'Inpatient Ward Care' },
          { id: 'patients' as NavTab, label: 'Patient Vitals & Nursing EMR', icon: Users, count: counts?.patients, section: 'Inpatient Ward Care' },
          { id: 'appointments' as NavTab, label: 'Triage & Daily OPD Queue', icon: Calendar, count: counts?.appointments, section: 'Triage & Orders' },
          { id: 'consultation' as NavTab, label: 'Doctor Treatment Orders', icon: Stethoscope, section: 'Triage & Orders' },
          { id: 'notifications' as NavTab, label: 'Emergency & Vitals Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Triage & Orders' }
        ];

      case 'RECEPTIONIST':
        return [
          { id: 'appointments' as NavTab, label: 'Appointments Desk & Queue', icon: Calendar, count: counts?.appointments, section: 'Front Desk Operations' },
          { id: 'patients' as NavTab, label: 'Patient Registration & Intake', icon: Users, count: counts?.patients, section: 'Front Desk Operations' },
          { id: 'staff' as NavTab, label: 'Doctor Duty Availability', icon: UserCog, section: 'Staff & Alerts' },
          { id: 'notifications' as NavTab, label: 'Front Desk Notifications', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Staff & Alerts' }
        ];

      case 'LAB_TECHNICIAN':
        return [
          { id: 'laboratory' as NavTab, label: '4-Stage Lab Diagnostics', icon: FlaskConical, count: counts?.pendingLabs, badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-700', section: 'Diagnostic Laboratory' },
          { id: 'patients' as NavTab, label: 'Patient Test Directory', icon: Users, count: counts?.patients, section: 'Diagnostic Laboratory' },
          { id: 'notifications' as NavTab, label: 'STAT & Urgent Lab Orders', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Diagnostic Laboratory' }
        ];

      case 'PHARMACIST':
        return [
          { id: 'pharmacy' as NavTab, label: 'FIFO Dispensary & Batches', icon: Pill, count: counts?.lowStock, badgeColor: 'bg-amber-950 text-amber-300 border border-amber-700', section: 'Hospital Dispensary' },
          { id: 'patients' as NavTab, label: 'Patient Medication History', icon: Users, count: counts?.patients, section: 'Hospital Dispensary' },
          { id: 'notifications' as NavTab, label: 'Low Stock & Expiry Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Hospital Dispensary' }
        ];

      case 'ACCOUNTANT':
        return [
          { id: 'billing' as NavTab, label: 'Billing, Claims & Payments', icon: Receipt, count: counts?.unpaidBills, badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700', section: 'Financial Operations' },
          { id: 'dashboard' as NavTab, label: 'Financial Revenue Analytics', icon: LayoutDashboard, section: 'Financial Operations' },
          { id: 'patients' as NavTab, label: 'Patient Accounts Directory', icon: Users, count: counts?.patients, section: 'Accounts & Alerts' },
          { id: 'notifications' as NavTab, label: 'Payment & Claims Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Accounts & Alerts' }
        ];

      case 'PATIENT':
        return [
          { id: 'patient-portal' as NavTab, label: 'My Health Portal & Records', icon: UserCheck, section: 'Patient Services' },
          { id: 'appointments' as NavTab, label: 'My Scheduled Appointments', icon: Calendar, count: counts?.appointments, section: 'Patient Services' },
          { id: 'billing' as NavTab, label: 'My Invoices & Online Pay', icon: Receipt, count: counts?.unpaidBills, badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700', section: 'Patient Services' },
          { id: 'notifications' as NavTab, label: 'My Health & Visit Alerts', icon: Bell, count: counts?.unreadNotifs, badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700', section: 'Patient Services' }
        ];

      default:
        return [
          { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, section: 'General' }
        ];
    }
  };

  const navItems = getNavItemsForRole();

  const renderSidebarInner = (isMobileDrawer = false) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hospital & User Persona Header */}
      <div className="p-3.5 border-b border-slate-800 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-800/90 border border-slate-700 flex-1 min-w-0">
            <Building2 className="h-4 w-4 text-teal-400 shrink-0" />
            <div className="overflow-hidden min-w-0">
              <h3 className="text-xs font-semibold text-white truncate">{hospitalName}</h3>
              <p className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400"></span>
                <span>{userRole.replace('_', ' ')} WORKSPACE</span>
              </p>
            </div>
          </div>
          {isMobileDrawer && onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Human Name & Role Badge */}
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-100 truncate">
              {currentUser?.name || userRole.replace('_', ' ')}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentUser?.title || userRole}
            </div>
          </div>
          <span className="text-[9px] font-mono uppercase bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded shrink-0">
            {navItems.length} Tabs
          </span>
        </div>
      </div>

      {/* Strictly Role-Scoped Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const prevItem = navItems[index - 1];
          const showSection = !prevItem || prevItem.section !== item.section;

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className="pt-2.5 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>{item.section}</span>
                </div>
              )}
              <button
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onTabSelect(item.id);
                  if (isMobileDrawer) onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {typeof item.count === 'number' && item.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.badgeColor || (isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-800 text-slate-300')
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}

        {onLogout && (
          <div className="pt-3 mt-2 border-t border-slate-800">
            <button
              id="sidebar-signout-btn"
              onClick={() => {
                if (isMobileDrawer) onCloseMobile?.();
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out to Portal</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] text-slate-400 font-medium">PHI Protected • v2.4</span>
        </div>
        <span className="font-mono text-[10px] text-teal-400 font-semibold">{userRole}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (Visible on small screens when isOpenMobile is true) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Slide-out Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl border-r border-slate-800 z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarInner(true)}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar (Hidden on mobile/tablet screens < lg, visible on lg and above) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 h-full border-r border-slate-800 select-none overflow-hidden">
        {renderSidebarInner(false)}
      </aside>
    </>
  );
};
