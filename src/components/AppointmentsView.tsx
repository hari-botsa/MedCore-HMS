import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CalendarDays,
  Clock, 
  Plus, 
  User, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Stethoscope, 
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  ShieldAlert,
  Bell,
  RotateCcw,
  Printer,
  CalendarRange,
  LayoutGrid,
  ListFilter,
  UserCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Check,
  Info
} from 'lucide-react';
import { Appointment, Doctor, Patient, AppointmentStatus } from '../types';
import { checkAppointmentConflict } from '../api';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onBookAppointment: (data: Partial<Appointment>) => Promise<void>;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onStartConsultation: (patient: Patient) => void;
}

type DatePreset = 'ALL' | 'TODAY' | 'TOMORROW' | 'NEXT_7_DAYS' | 'NEXT_30_DAYS' | 'PAST_30_DAYS' | 'CUSTOM';
type ViewMode = 'LIST' | 'CALENDAR' | 'BOARD';

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  patients,
  onBookAppointment,
  onUpdateStatus,
  onStartConsultation,
}) => {
  // General filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDoctor, setFilterDoctor] = useState<string>('ALL');
  const [doctorSearch, setDoctorSearch] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  
  // Date range filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [datePreset, setDatePreset] = useState<DatePreset>('ALL');

  // View presentation mode (List, Calendar, Board)
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');

  // Calendar View navigation state
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    if (appointments.length > 0) {
      const firstAptDate = new Date(appointments[0].dateTime);
      if (!isNaN(firstAptDate.getTime())) {
        return new Date(firstAptDate.getFullYear(), firstAptDate.getMonth(), 1);
      }
    }
    return new Date();
  });

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(() => {
    if (appointments.length > 0) {
      return appointments[0].dateTime.slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  });

  // Modal and submission state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [allowConflictOverride, setAllowConflictOverride] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // New appointment form state
  const [newApt, setNewApt] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    durationMinutes: 30,
    reason: '',
    type: 'IN_PERSON' as any,
    priority: 'NORMAL' as any,
    notes: ''
  });

  // Ensure default patient and doctor are selected if available
  useEffect(() => {
    if (!newApt.patientId && patients.length > 0) {
      setNewApt(prev => ({ ...prev, patientId: patients[0].id }));
    }
    if (!newApt.doctorId && doctors.length > 0) {
      setNewApt(prev => ({ ...prev, doctorId: doctors[0].id }));
    }
  }, [patients, doctors]);

  // Keyboard shortcut: Escape to dismiss booking modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setFormError(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  // Run conflict check whenever doctor, patient, dateTime or duration changes
  useEffect(() => {
    if (!showModal || !newApt.doctorId || !newApt.patientId || !newApt.dateTime) return;
    
    let isMounted = true;
    checkAppointmentConflict({
      doctorId: newApt.doctorId,
      patientId: newApt.patientId,
      dateTime: newApt.dateTime,
      durationMinutes: newApt.durationMinutes
    }).then(res => {
      if (isMounted) {
        setConflictWarning(res.hasConflict ? (res.reason || 'Double-booking conflict detected for this physician or patient slot') : null);
        if (!res.hasConflict) {
          setAllowConflictOverride(false);
        }
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [newApt.doctorId, newApt.patientId, newApt.dateTime, newApt.durationMinutes, showModal]);

  // Date preset helper
  const applyDatePreset = (preset: DatePreset) => {
    setDatePreset(preset);
    const now = new Date();
    
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'TODAY') {
      const str = formatDate(now);
      setStartDate(str);
      setEndDate(str);
    } else if (preset === 'TOMORROW') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const str = formatDate(tomorrow);
      setStartDate(str);
      setEndDate(str);
    } else if (preset === 'NEXT_7_DAYS') {
      const start = formatDate(now);
      const endD = new Date(now);
      endD.setDate(endD.getDate() + 7);
      setStartDate(start);
      setEndDate(formatDate(endD));
    } else if (preset === 'NEXT_30_DAYS') {
      const start = formatDate(now);
      const endD = new Date(now);
      endD.setDate(endD.getDate() + 30);
      setStartDate(start);
      setEndDate(formatDate(endD));
    } else if (preset === 'PAST_30_DAYS') {
      const startD = new Date(now);
      startD.setDate(startD.getDate() - 30);
      setStartDate(formatDate(startD));
      setEndDate(formatDate(now));
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setFilterStatus('ALL');
    setFilterDoctor('ALL');
    setDoctorSearch('');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setDatePreset('ALL');
  };

  // Check if any filter is active
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterStatus !== 'ALL') count++;
    if (filterDoctor !== 'ALL') count++;
    if (doctorSearch.trim()) count++;
    if (search.trim()) count++;
    if (startDate || endDate) count++;
    return count;
  }, [filterStatus, filterDoctor, doctorSearch, search, startDate, endDate]);

  // Filtered appointments computation
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      // 1. Status Filter
      if (filterStatus !== 'ALL' && a.status !== filterStatus) {
        return false;
      }

      // 2. Doctor Dropdown Filter
      if (filterDoctor !== 'ALL' && a.doctorId !== filterDoctor) {
        return false;
      }

      // 3. Doctor Name / Specialty Search Filter
      if (doctorSearch.trim()) {
        const docQ = doctorSearch.trim().toLowerCase();
        const matchesDocName = a.doctorName.toLowerCase().includes(docQ);
        const matchesDocDept = a.department.toLowerCase().includes(docQ);
        if (!matchesDocName && !matchesDocDept) {
          return false;
        }
      }

      // 4. General Search Filter (Patient name, MRN, complaint, room)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesPatient = a.patientName.toLowerCase().includes(q);
        const matchesDoctor = a.doctorName.toLowerCase().includes(q);
        const matchesMrn = a.patientMrn.toLowerCase().includes(q);
        const matchesReason = a.reason.toLowerCase().includes(q);
        const matchesRoom = a.room ? a.room.toLowerCase().includes(q) : false;
        if (!matchesPatient && !matchesDoctor && !matchesMrn && !matchesReason && !matchesRoom) {
          return false;
        }
      }

      // 5. Date Range Filter
      if (startDate || endDate) {
        const aptDate = new Date(a.dateTime);
        if (!isNaN(aptDate.getTime())) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (aptDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (aptDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [appointments, filterStatus, filterDoctor, doctorSearch, search, startDate, endDate]);

  // Receptionist schedule metrics based on current filtered view
  const metrics = useMemo(() => {
    const total = filtered.length;
    const confirmed = filtered.filter(a => a.status === 'CONFIRMED').length;
    const inProgress = filtered.filter(a => a.status === 'IN_PROGRESS' || a.status === 'IN_CONSULTATION').length;
    const scheduled = filtered.filter(a => a.status === 'SCHEDULED' || a.status === 'PENDING').length;
    const completed = filtered.filter(a => a.status === 'COMPLETED').length;
    
    // Unique doctors on schedule in current filter
    const activeDoctorIds = new Set(filtered.map(a => a.doctorId));
    const activeDoctorsCount = activeDoctorIds.size;

    return { total, confirmed, inProgress, scheduled, completed, activeDoctorsCount };
  }, [filtered]);

  // Calendar month grid generator
  const calendarGrid = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth(); // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().slice(0, 10);
    const cells = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      const prevMonthIndex = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayApts = filtered.filter(a => a.dateTime.startsWith(dateStr));
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: selectedCalendarDate === dateStr,
        appointments: dayApts
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayApts = filtered.filter(a => a.dateTime.startsWith(dateStr));
      cells.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: selectedCalendarDate === dateStr,
        appointments: dayApts
      });
    }

    // Trailing days from next month to complete standard 35 or 42 grid cells
    const targetLength = cells.length > 35 ? 42 : 35;
    const remaining = targetLength - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonthIndex = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayApts = filtered.filter(a => a.dateTime.startsWith(dateStr));
      cells.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: selectedCalendarDate === dateStr,
        appointments: dayApts
      });
    }

    return cells;
  }, [calendarMonth, filtered, selectedCalendarDate]);

  // Appointments for the currently selected calendar date
  const selectedDateAppointments = useMemo(() => {
    return filtered.filter(a => a.dateTime.startsWith(selectedCalendarDate));
  }, [filtered, selectedCalendarDate]);

  // Calendar month navigation handlers
  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedCalendarDate(now.toISOString().slice(0, 10));
  };

  // Jump to month with active appointments if currently viewed month is empty
  const handleJumpToActiveMonth = () => {
    if (filtered.length > 0) {
      const targetApt = new Date(filtered[0].dateTime);
      if (!isNaN(targetApt.getTime())) {
        setCalendarMonth(new Date(targetApt.getFullYear(), targetApt.getMonth(), 1));
        setSelectedCalendarDate(filtered[0].dateTime.slice(0, 10));
      }
    }
  };

  // Handle appointment creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newApt.patientId || !newApt.doctorId || !newApt.reason.trim()) {
      setFormError('Please select patient, attending physician, and enter a chief complaint.');
      return;
    }

    if (conflictWarning && !allowConflictOverride) {
      setFormError('A scheduling conflict exists. Please resolve the time overlap or enable the override option.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onBookAppointment(newApt);
      setShowModal(false);
      setActionSuccessNotice('Appointment booked successfully! Automatic patient notification queued.');
      setTimeout(() => setActionSuccessNotice(null), 4000);
      
      // Reset form
      setNewApt({
        patientId: patients[0]?.id || '',
        doctorId: doctors[0]?.id || '',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
        durationMinutes: 30,
        reason: '',
        type: 'IN_PERSON',
        priority: 'NORMAL',
        notes: ''
      });
      setConflictWarning(null);
      setAllowConflictOverride(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick check-in action
  const handleQuickCheckIn = async (aptId: string) => {
    try {
      await onUpdateStatus(aptId, 'CONFIRMED');
      setActionSuccessNotice('Patient checked in and marked as Confirmed. Clinical team notified.');
      setTimeout(() => setActionSuccessNotice(null), 3500);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Status badge renderer
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'SCHEDULED':
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Scheduled</span>;
      case 'CONFIRMED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">Checked In</span>;
      case 'IN_PROGRESS':
      case 'IN_CONSULTATION':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 animate-pulse">In Consultation</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
      case 'NO_SHOW':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">No Show</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Scheduled</span>;
    }
  };

  // Small status pill color helper for Calendar month cells
  const getCalendarStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-teal-500 text-white';
      case 'IN_PROGRESS':
      case 'IN_CONSULTATION':
        return 'bg-purple-600 text-white';
      case 'SCHEDULED':
      case 'PENDING':
        return 'bg-blue-600 text-white';
      case 'COMPLETED':
        return 'bg-emerald-600 text-white';
      case 'CANCELLED':
        return 'bg-slate-400 text-white';
      default:
        return 'bg-teal-600 text-white';
    }
  };

  // Helper for responsive compact dots on mobile calendar cells
  const getCalendarStatusDotColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-teal-500';
      case 'IN_PROGRESS':
      case 'IN_CONSULTATION':
        return 'bg-purple-600';
      case 'SCHEDULED':
      case 'PENDING':
        return 'bg-blue-600';
      case 'COMPLETED':
        return 'bg-emerald-600';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'bg-rose-500';
      default:
        return 'bg-teal-600';
    }
  };

  // Group appointments by doctor for Physician Board view
  const groupedByDoctor = useMemo(() => {
    const map = new Map<string, { doctor: Doctor | undefined; appointments: Appointment[] }>();
    
    // Initialize with filtered doctors or all doctors matching doctor search
    doctors.forEach(doc => {
      if (filterDoctor !== 'ALL' && doc.id !== filterDoctor) return;
      if (doctorSearch.trim()) {
        const q = doctorSearch.toLowerCase();
        if (!doc.name.toLowerCase().includes(q) && !doc.department.toLowerCase().includes(q)) {
          return;
        }
      }
      map.set(doc.id, { doctor: doc, appointments: [] });
    });

    // Populate with filtered appointments
    filtered.forEach(apt => {
      const entry = map.get(apt.doctorId);
      if (entry) {
        entry.appointments.push(apt);
      } else {
        const foundDoc = doctors.find(d => d.id === apt.doctorId);
        map.set(apt.doctorId, { doctor: foundDoc, appointments: [apt] });
      }
    });

    // Sort appointments in each doctor card chronologically
    map.forEach(entry => {
      entry.appointments.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    });

    return Array.from(map.values());
  }, [doctors, filtered, filterDoctor, doctorSearch]);

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Outpatient Scheduling & Reception Desk</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
              Receptionist Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual calendar scheduling, multi-physician timelines, live conflict checks, and rapid patient intake
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Primary View Mode Switcher Toggle Button */}
          <div className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/90 text-xs shadow-2xs">
            <button
              type="button"
              id="btn-toggle-list-view"
              onClick={() => setViewMode('LIST')}
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer min-h-[38px] sm:min-h-0 ${
                viewMode === 'LIST'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5 shrink-0" />
              <span>List View</span>
            </button>

            <button
              type="button"
              id="btn-toggle-calendar-view"
              onClick={() => setViewMode('CALENDAR')}
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer min-h-[38px] sm:min-h-0 ${
                viewMode === 'CALENDAR'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Calendar View</span>
            </button>

            <button
              type="button"
              id="btn-toggle-board-view"
              onClick={() => setViewMode('BOARD')}
              className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer min-h-[38px] sm:min-h-0 ${
                viewMode === 'BOARD'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
              <span>Physician Board</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print or export current schedule sheet"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 hover:shadow-xs text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all cursor-pointer min-h-[40px] sm:min-h-0"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              id="btn-schedule-apt"
              onClick={() => {
                setFormError(null);
                setShowModal(true);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 hover:shadow-md hover:-translate-y-0.5 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer min-h-[40px] sm:min-h-0"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Receptionist Schedule Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total in Scope</div>
          <div className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-0.5">
            {metrics.total}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Filtered consultations</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-teal-700">Checked-In / Ready</div>
          <div className="text-xl font-bold text-teal-800 mt-0.5">
            {metrics.confirmed}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Arrived at clinic</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-purple-700">In Consultation</div>
          <div className="text-xl font-bold text-purple-800 mt-0.5">
            {metrics.inProgress}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">With physician now</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-blue-700">Upcoming Slots</div>
          <div className="text-xl font-bold text-blue-800 mt-0.5">
            {metrics.scheduled}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Scheduled arrivals</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Completed Visits</div>
          <div className="text-xl font-bold text-emerald-800 mt-0.5">
            {metrics.completed}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Discharged / Billed</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="text-[10px] uppercase font-bold text-slate-600">Active Doctors</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">
            {metrics.activeDoctorsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">With rostered slots</div>
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-xs space-y-3.5">
        
        {/* Row 1: Doctor Filter & Search + Patient Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Doctor Name / Specialty Search Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                <span>Search by Doctor Name</span>
              </span>
              {doctorSearch && (
                <button
                  onClick={() => setDoctorSearch('')}
                  className="text-[10px] text-teal-700 hover:underline cursor-pointer"
                >
                  Clear doctor search
                </button>
              )}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="e.g. Dr. Priya, Cardiology, Reed..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-800 placeholder-slate-400 transition-all"
              />
              {doctorSearch && (
                <button
                  onClick={() => setDoctorSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Attending Physician Dropdown Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Select Physician Roster</span>
            </label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
            >
              <option value="ALL">All Attending Physicians ({doctors.length} On Roster)</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} ({d.department})
                </option>
              ))}
            </select>
          </div>

          {/* General Patient & MRN Search */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Search Patient / MRN / Complaint</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Patient name, MRN, complaint, room..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-800 placeholder-slate-400 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Date Range Filter & Receptionist Presets */}
        <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 overflow-hidden w-full lg:w-auto">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
              <CalendarRange className="h-3.5 w-3.5 text-teal-600" />
              <span>Date:</span>
            </span>

            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs overflow-x-auto no-scrollbar scroll-smooth max-w-full">
              <button
                type="button"
                onClick={() => applyDatePreset('ALL')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'ALL' && !startDate && !endDate
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Dates
              </button>

              <button
                type="button"
                onClick={() => applyDatePreset('TODAY')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'TODAY'
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => applyDatePreset('TOMORROW')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'TOMORROW'
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomorrow
              </button>

              <button
                type="button"
                onClick={() => applyDatePreset('NEXT_7_DAYS')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'NEXT_7_DAYS'
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Next 7 Days
              </button>

              <button
                type="button"
                onClick={() => applyDatePreset('NEXT_30_DAYS')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'NEXT_30_DAYS'
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Next 30 Days
              </button>

              <button
                type="button"
                onClick={() => applyDatePreset('PAST_30_DAYS')}
                className={`shrink-0 px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  datePreset === 'PAST_30_DAYS'
                    ? 'bg-white text-teal-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past 30 Days
              </button>
            </div>
          </div>

          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setDatePreset('ALL');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Clear date range"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Status Selector & Scope Indicator */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Checked In (Confirmed)</option>
                <option value="IN_PROGRESS">In Consultation</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>

            {/* Active Filters Clear Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>

          {/* Scope Indicator Summary */}
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Showing <strong className="text-slate-900 font-semibold">{filtered.length}</strong> of {appointments.length} appointments</span>
          </div>
        </div>

        {/* Filter Summary Breadcrumb */}
        {(filterDoctor !== 'ALL' || doctorSearch || startDate || endDate || filterStatus !== 'ALL') && (
          <div className="pt-2 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">Active Criteria:</span>
            {doctorSearch && (
              <span className="text-slate-600">Doctor query: <strong className="text-slate-900">"{doctorSearch}"</strong></span>
            )}
            {filterDoctor !== 'ALL' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">Physician: <strong className="text-slate-900">{doctors.find(d => d.id === filterDoctor)?.name || filterDoctor}</strong></span>
              </>
            )}
            {(startDate || endDate) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">Date Range: <strong className="text-slate-900">{startDate || 'Any'} → {endDate || 'Any'}</strong></span>
              </>
            )}
            {filterStatus !== 'ALL' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">Status: <strong className="text-slate-900">{filterStatus}</strong></span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="text-teal-700 font-semibold">{filtered.length} appointment{filtered.length === 1 ? '' : 's'} matched</span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. LIST VIEW                                              */}
      {/* ========================================================= */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Patient & MRN</th>
                  <th className="py-3 px-4">Attending Physician</th>
                  <th className="py-3 px-4">Appointment Date & Time</th>
                  <th className="py-3 px-4">Chief Complaint / Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notification Reminders</th>
                  <th className="py-3 px-4 text-right">Reception Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                        <Calendar className="h-8 w-8 text-slate-300" />
                        <div className="font-bold text-slate-700">No appointments found matching your filters</div>
                        <p className="text-xs text-slate-500">
                          Try searching for a different doctor name, expanding your date range, or switching to Calendar View.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-colors"
                          >
                            Reset All Filters
                          </button>
                          <button
                            onClick={() => setViewMode('CALENDAR')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                          >
                            Switch to Calendar View
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((apt) => {
                    const patientObj = patients.find(p => p.id === apt.patientId);
                    const aptDate = new Date(apt.dateTime);
                    const isToday = new Date().toDateString() === aptDate.toDateString();

                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Patient & MRN */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{apt.patientName}</div>
                          <div className="text-[11px] font-mono text-teal-700 font-semibold">{apt.patientMrn}</div>
                          {patientObj && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {patientObj.gender} · {patientObj.bloodGroup} · {patientObj.phone}
                            </div>
                          )}
                        </td>

                        {/* Attending Physician */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <Stethoscope className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{apt.doctorName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {apt.department}
                            {apt.room && (
                              <span className="ml-1 text-slate-400">· {apt.room}</span>
                            )}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{aptDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            {isToday && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-teal-100 text-teal-800">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({apt.durationMinutes} min)</span>
                          </div>
                        </td>

                        {/* Chief Complaint */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-medium text-slate-800 line-clamp-2" title={apt.reason}>
                            {apt.reason}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                            {apt.type.toLowerCase().replace('_', ' ')} · {apt.priority.toLowerCase()} priority
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(apt.status)}
                        </td>

                        {/* Reminders */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Bell className="h-3 w-3 text-teal-600" />
                            <span>24h: {apt.reminderSent24h ? '✓ Sent' : 'Queued'}</span>
                            <span>•</span>
                            <span>1h: {apt.reminderSent1h ? '✓ Sent' : 'Pending'}</span>
                          </div>
                        </td>

                        {/* Reception Actions */}
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {(apt.status === 'SCHEDULED' || apt.status === 'PENDING') && (
                            <button
                              onClick={() => handleQuickCheckIn(apt.id)}
                              className="px-2.5 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-md font-semibold text-xs border border-teal-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <UserCheck className="h-3 w-3 text-teal-600" />
                              <span>Check-In</span>
                            </button>
                          )}

                          {['CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'].includes(apt.status) && patientObj && (
                            <button
                              onClick={() => {
                                onUpdateStatus(apt.id, 'IN_PROGRESS');
                                onStartConsultation(patientObj);
                              }}
                              className="px-2.5 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded-md font-bold text-xs shadow-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Stethoscope className="h-3 w-3" />
                              <span>Open Desk</span>
                            </button>
                          )}

                          {apt.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                              className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md font-bold text-xs transition-colors cursor-pointer"
                            >
                              Finalize Visit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CALENDAR VIEW (Interactive Visual Scheduling)          */}
      {/* ========================================================= */}
      {viewMode === 'CALENDAR' && (
        <div className="space-y-4">
          {/* Calendar Month Navigation & Helper Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Month & Year Title with Previous/Next Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-white text-slate-700 rounded-md transition-all cursor-pointer hover:shadow-xs"
                  title="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-white text-slate-700 rounded-md transition-all cursor-pointer hover:shadow-xs"
                  title="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {calendarMonth.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                </h2>
                <div className="text-[11px] text-slate-500">
                  {filtered.length} appointment{filtered.length === 1 ? '' : 's'} in current filter scope
                </div>
              </div>
            </div>

            {/* Quick Navigation Helpers */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                Today
              </button>

              {filtered.length > 0 && (
                <button
                  type="button"
                  onClick={handleJumpToActiveMonth}
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 transition-all cursor-pointer flex items-center gap-1"
                >
                  <CalendarDays className="h-3 w-3 text-teal-600" />
                  <span>Jump to Active Schedule</span>
                </button>
              )}

              {/* Status Color Legend */}
              <div className="hidden xl:flex items-center gap-2.5 text-[10px] text-slate-500 border-l border-slate-200 pl-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-teal-500"></span> Checked In
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-600"></span> In Consultation
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span> Scheduled
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-600"></span> Completed
                </span>
              </div>
            </div>
          </div>

          {/* Main Visual Calendar Grid & Day Inspector Side Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* 7-Column Month Grid (8 columns on lg) */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 bg-slate-50/90 border-b border-slate-200 text-center py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day}>
                    <span className="sm:hidden">{day[0]}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </div>
                ))}
              </div>

              {/* Month Day Cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 border-b border-slate-200 bg-white">
                {calendarGrid.map((cell) => {
                  const hasApts = cell.appointments.length > 0;

                  return (
                    <div
                      key={cell.dateStr}
                      onClick={() => setSelectedCalendarDate(cell.dateStr)}
                      className={`min-h-[58px] sm:min-h-[88px] lg:min-h-[96px] p-1 sm:p-1.5 flex flex-col justify-between transition-all cursor-pointer select-none ${
                        cell.isSelected
                          ? 'bg-teal-50/60 ring-2 ring-teal-600 ring-inset z-10'
                          : cell.isCurrentMonth
                          ? 'bg-white hover:bg-slate-50/80'
                          : 'bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] sm:text-xs font-bold inline-flex items-center justify-center h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full ${
                            cell.isToday
                              ? 'bg-teal-600 text-white'
                              : cell.isCurrentMonth
                              ? 'text-slate-800'
                              : 'text-slate-300'
                          }`}
                        >
                          {cell.dayNumber}
                        </span>

                        {hasApts && (
                          <span className="text-[9px] sm:text-[10px] font-extrabold text-teal-800 bg-teal-100/80 px-1 rounded">
                            {cell.appointments.length}
                          </span>
                        )}
                      </div>

                      {/* Responsive Indicators: Compact colored dots on mobile (<sm) */}
                      {hasApts && (
                        <div className="flex sm:hidden items-center justify-center gap-1 my-1">
                          {cell.appointments.slice(0, 3).map((apt) => (
                            <span
                              key={apt.id}
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${getCalendarStatusDotColor(apt.status)}`}
                              title={`${apt.patientName} (${apt.status})`}
                            />
                          ))}
                          {cell.appointments.length > 3 && (
                            <span className="text-[8px] font-bold text-slate-500">
                              +{cell.appointments.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rich Appointment Chips on Tablet & Desktop (>=sm) */}
                      <div className="hidden sm:block space-y-1 my-1 overflow-hidden">
                        {cell.appointments.slice(0, 2).map((apt) => {
                          const timeStr = new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div
                              key={apt.id}
                              title={`${timeStr} - ${apt.patientName} with ${apt.doctorName} (${apt.status})`}
                              className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate flex items-center gap-1 shadow-2xs ${getCalendarStatusColor(apt.status)}`}
                            >
                              <span className="shrink-0 font-mono text-[8px] opacity-90">{timeStr}</span>
                              <span className="truncate">{apt.patientName.split(' ')[0]}</span>
                            </div>
                          );
                        })}

                        {cell.appointments.length > 2 && (
                          <div className="text-[9px] font-bold text-slate-500 pl-0.5">
                            +{cell.appointments.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Bottom indicator if selected */}
                      <div className="h-0.5 sm:h-1 w-full rounded-full">
                        {cell.isSelected && <div className="h-0.5 sm:h-1 bg-teal-600 rounded-full w-full"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Inspector & Booking Quick Panel (4 columns on lg) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs p-4.5 flex flex-col justify-between space-y-4">
              <div>
                {/* Day Inspector Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Day Schedule</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedDateAppointments.length} slot{selectedDateAppointments.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Day Appointments Roster */}
                <div className="mt-3 space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {selectedDateAppointments.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-4">
                      <CalendarDays className="h-8 w-8 mx-auto text-slate-300 mb-1.5" />
                      <div className="text-xs font-bold text-slate-700">No Appointments Booked</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Clinic slots are open and available for patient scheduling or walk-in intake on this date.
                      </p>
                      <button
                        onClick={() => {
                          setNewApt(prev => ({
                            ...prev,
                            dateTime: `${selectedCalendarDate}T09:00`
                          }));
                          setFormError(null);
                          setShowModal(true);
                        }}
                        className="mt-3 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Schedule on this Date</span>
                      </button>
                    </div>
                  ) : (
                    selectedDateAppointments.map(apt => {
                      const aptDate = new Date(apt.dateTime);
                      const patientObj = patients.find(p => p.id === apt.patientId);

                      return (
                        <div 
                          key={apt.id}
                          className="p-3 bg-slate-50/90 hover:bg-teal-50/40 rounded-xl border border-slate-200/80 transition-colors text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                              <Clock className="h-3.5 w-3.5 text-teal-600" />
                              <span>{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-slate-400 font-normal">({apt.durationMinutes}m)</span>
                            </span>
                            {getStatusBadge(apt.status)}
                          </div>

                          <div>
                            <div className="font-bold text-slate-900 flex items-center justify-between">
                              <span>{apt.patientName}</span>
                              <span className="font-mono text-[10px] text-teal-700">{apt.patientMrn}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Stethoscope className="h-3 w-3 text-slate-400" />
                              <span>{apt.doctorName} · {apt.department}</span>
                            </div>
                            {apt.room && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Room: {apt.room}
                              </div>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                            "{apt.reason}"
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span className="text-[10px] text-slate-400 capitalize">
                              {apt.type.toLowerCase().replace('_', ' ')}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {(apt.status === 'SCHEDULED' || apt.status === 'PENDING') && (
                                <button
                                  onClick={() => handleQuickCheckIn(apt.id)}
                                  className="px-2 py-0.5 bg-white hover:bg-teal-50 text-teal-800 text-[10px] font-bold rounded border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer"
                                >
                                  Check-in
                                </button>
                              )}

                              {['CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'].includes(apt.status) && patientObj && (
                                <button
                                  onClick={() => {
                                    onUpdateStatus(apt.id, 'IN_PROGRESS');
                                    onStartConsultation(patientObj);
                                  }}
                                  className="px-2 py-0.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded shadow-2xs transition-colors cursor-pointer"
                                >
                                  Open Desk
                                </button>
                              )}

                              {apt.status === 'IN_PROGRESS' && (
                                <button
                                  onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded transition-colors cursor-pointer"
                                >
                                  Finalize
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Day Inspector Footer: Direct Slot Booking for selected date */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setNewApt(prev => ({
                      ...prev,
                      dateTime: `${selectedCalendarDate}T09:00`
                    }));
                    setFormError(null);
                    setShowModal(true);
                  }}
                  className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Book Slot for {selectedCalendarDate}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PHYSICIAN BOARD VIEW                                   */}
      {/* ========================================================= */}
      {viewMode === 'BOARD' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Physician Timelines & Slot Availability ({groupedByDoctor.length} Roster Group{groupedByDoctor.length === 1 ? '' : 's'})
            </h2>
            <span className="text-xs text-slate-500">
              Chronologically ordered consultation roster for filtered date window
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByDoctor.map(({ doctor, appointments: docApts }) => {
              if (!doctor) return null;
              return (
                <div 
                  key={doctor.id} 
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Doctor Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{doctor.name}</div>
                        <div className="text-xs text-teal-700 font-semibold">{doctor.specialization}</div>
                        <div className="text-[11px] text-slate-500">{doctor.department}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        doctor.currentStatus === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        doctor.currentStatus === 'IN_CONSULTATION' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                        doctor.currentStatus === 'IN_SURGERY' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {doctor.currentStatus?.replace('_', ' ') || 'ON DUTY'}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Shift: {doctor.workingHours?.start || '09:00'} – {doctor.workingHours?.end || '17:00'}</span>
                      <span>Consultation: ${doctor.consultationFee || 250}</span>
                    </div>
                  </div>

                  {/* Doctor Appointment List */}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Appointments ({docApts.length})
                      </span>
                      {docApts.length > 0 && (
                        <span className="text-[10px] text-slate-500">
                          {docApts.filter(a => a.status === 'CONFIRMED').length} checked in
                        </span>
                      )}
                    </div>

                    {docApts.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 bg-slate-50/60 rounded-lg border border-dashed border-slate-200">
                        <Calendar className="h-5 w-5 mx-auto text-slate-300 mb-1" />
                        <div className="text-xs font-semibold text-slate-600">No scheduled appointments</div>
                        <div className="text-[10px] text-slate-400">Slots fully available for walk-ins</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {docApts.map(apt => {
                          const aptDate = new Date(apt.dateTime);
                          const patientObj = patients.find(p => p.id === apt.patientId);

                          return (
                            <div 
                              key={apt.id}
                              className="p-2.5 bg-slate-50 hover:bg-teal-50/40 rounded-lg border border-slate-200/80 transition-colors text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  <span>{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </span>
                                {getStatusBadge(apt.status)}
                              </div>

                              <div className="mt-1 font-semibold text-slate-800">
                                {apt.patientName} <span className="font-normal font-mono text-[10px] text-slate-500">({apt.patientMrn})</span>
                              </div>

                              <div className="text-[11px] text-slate-500 truncate mt-0.5" title={apt.reason}>
                                {apt.reason}
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                  {aptDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} · {apt.room || 'General OPD'}
                                </span>

                                <div className="flex items-center gap-1">
                                  {(apt.status === 'SCHEDULED' || apt.status === 'PENDING') && (
                                    <button
                                      onClick={() => handleQuickCheckIn(apt.id)}
                                      className="px-2 py-0.5 bg-white hover:bg-teal-50 text-teal-800 text-[10px] font-bold rounded border border-slate-200 hover:border-teal-300"
                                    >
                                      Check-in
                                    </button>
                                  )}

                                  {patientObj && (
                                    <button
                                      onClick={() => {
                                        onUpdateStatus(apt.id, 'IN_PROGRESS');
                                        onStartConsultation(patientObj);
                                      }}
                                      className="px-2 py-0.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded"
                                    >
                                      Consult
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Quick Booking for this physician */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setNewApt(prev => ({ ...prev, doctorId: doctor.id }));
                        setFormError(null);
                        setShowModal(true);
                      }}
                      className="w-full py-1.5 px-3 bg-white hover:bg-teal-50 text-teal-700 hover:text-teal-800 text-xs font-semibold rounded-lg border border-slate-200 hover:border-teal-300 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Book Slot with {doctor.name.split(',')[0]}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal with Realtime Conflict Detection */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Schedule Medical Consultation</h2>
                <p className="text-xs text-slate-500">Live Double-Booking Validation Active (Doctor & Patient Roster)</p>
              </div>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                }} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{formError}</div>
              </div>
            )}

            {/* Conflict Banner */}
            {conflictWarning ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Scheduling Conflict Detected!</div>
                    <div className="text-rose-700 mt-0.5">{conflictWarning}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200/60 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="conflict-override"
                    checked={allowConflictOverride}
                    onChange={(e) => setAllowConflictOverride(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="conflict-override" className="text-[11px] font-semibold text-rose-900 cursor-pointer">
                    Reception Override: Authorize double-booking consultation
                  </label>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Selected time slot is currently available with zero calendar conflicts.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={newApt.patientId}
                  onChange={e => setNewApt({ ...newApt, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600/30"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (MRN: {p.mrn}) - {p.gender}, {p.dob}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Physician *</label>
                <select
                  required
                  value={newApt.doctorId}
                  onChange={e => setNewApt({ ...newApt, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600/30"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newApt.dateTime}
                    onChange={e => setNewApt({ ...newApt, dateTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <select
                    value={newApt.durationMinutes}
                    onChange={e => setNewApt({ ...newApt, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 text-xs"
                  >
                    <option value={15}>15 minutes (Follow-up)</option>
                    <option value={30}>30 minutes (Standard)</option>
                    <option value={45}>45 minutes (Comprehensive)</option>
                    <option value={60}>60 minutes (Specialist)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visit Type</label>
                  <select
                    value={newApt.type}
                    onChange={e => setNewApt({ ...newApt, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs"
                  >
                    <option value="IN_PERSON">In-Person Clinic</option>
                    <option value="TELEHEALTH">Telehealth Video</option>
                    <option value="FOLLOW_UP">Post-Op / Follow-up</option>
                    <option value="EMERGENCY">Emergency Triage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Priority</label>
                  <select
                    value={newApt.priority}
                    onChange={e => setNewApt({ ...newApt, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Complaint *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest discomfort, post-op wound check, prescription review"
                  value={newApt.reason}
                  onChange={e => setNewApt({ ...newApt, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30 text-xs"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormError(null);
                  }}
                  className="px-4 py-2.5 sm:py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer text-center"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
