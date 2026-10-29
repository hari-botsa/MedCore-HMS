import React, { useState } from 'react';
import { 
  UserCheck, 
  Stethoscope, 
  Phone, 
  Mail, 
  Clock, 
  Building, 
  Calendar, 
  Award,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Doctor } from '../types';

interface StaffViewProps {
  doctors: Doctor[];
  onBookWithDoctor: (doctorId: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  doctors,
  onBookWithDoctor,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const departments = ['ALL', 'Cardiology', 'Emergency Medicine', 'Neurology', 'Orthopedics', 'Pediatrics', 'Internal Medicine', 'Surgery'];

  const filteredDoctors = doctors.filter(d => {
    const matchesDept = selectedDept === 'ALL' || d.department === selectedDept;
    const q = search.toLowerCase();
    const matchesSearch = 
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      (d.licenseNumber ? d.licenseNumber.toLowerCase().includes(q) : false);

    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Physician Credentialing & Medical Staff Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Board-certified clinicians, attending physicians, shift schedules, and department rosters</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{doctors.filter(d => d.availability === 'ON_DUTY').length} Physicians Active On-Duty</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search physician name, specialization, license..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:-translate-y-0.5'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map(doc => {
          const isOnDuty = doc.availability === 'ON_DUTY';
          const isOnCall = doc.availability === 'ON_CALL';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 p-5 flex flex-col justify-between transition-all duration-200 overflow-hidden group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                      <p className="text-xs text-teal-700 font-medium">{doc.specialization}</p>
                      <span className="font-mono text-[10px] text-slate-400">Lic: #{doc.licenseNumber}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isOnDuty ? 'bg-emerald-100 text-emerald-800' :
                    isOnCall ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {(doc.availability || doc.currentStatus || 'ACTIVE').replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>Department of {doc.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Standard Consult:</span>
                  <span className="font-mono font-bold text-slate-900">${doc.consultationFee}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onBookWithDoctor(doc.id)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5 text-teal-400" />
                  <span>Schedule Consultation</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
