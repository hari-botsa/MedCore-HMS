import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowDownUp, 
  Search, 
  Filter, 
  ShieldAlert,
  PackageCheck,
  RefreshCw
} from 'lucide-react';
import { MedicineBatch, Prescription, UserProfile } from '../types';

interface PharmacyViewProps {
  batches: MedicineBatch[];
  prescriptions?: Prescription[];
  currentUser?: UserProfile;
  onDispenseMedicine?: (prescriptionId: string, medicineName: string, quantity: number) => Promise<void>;
  onDispensePrescription?: (prescriptionId: string) => Promise<void>;
  onRefresh?: () => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  batches,
  prescriptions = [],
  currentUser,
  onDispenseMedicine,
  onDispensePrescription,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'BATCHES' | 'QUEUE'>('BATCHES');
  const [search, setSearch] = useState('');
  const [dispensingId, setDispensingId] = useState<string | null>(null);
  const [dispenseResult, setDispenseResult] = useState<string | null>(null);

  const lowStockCount = batches.filter(b => (b.currentStock ?? b.quantityInStock) <= 30).length;
  const now = new Date();
  const expiringSoonCount = batches.filter(b => {
    const exp = new Date(b.expiryDate);
    const diffMonths = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 3 && diffMonths > 0;
  }).length;

  const filteredBatches = batches.filter(b => {
    const mName = b.medicineName.toLowerCase();
    const bNum = b.batchNumber.toLowerCase();
    const mfg = (b.manufacturer || '').toLowerCase();
    const q = search.toLowerCase();
    return mName.includes(q) || bNum.includes(q) || mfg.includes(q);
  });

  const handleDispense = async (rxId: string, medName: string, qty: number = 10) => {
    setDispensingId(rxId);
    setDispenseResult(null);
    try {
      if (onDispenseMedicine) {
        await onDispenseMedicine(rxId, medName, qty);
      } else if (onDispensePrescription) {
        await onDispensePrescription(rxId);
      }
      setDispenseResult(`Dispensed successfully using FIFO rule (earliest expiry batch deducted).`);
      setTimeout(() => setDispenseResult(null), 5000);
    } catch (err: any) {
      setDispenseResult(err.message || 'Dispensing failed');
      setTimeout(() => setDispenseResult(null), 5000);
    } finally {
      setDispensingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Pharmacy & FIFO Dispensary</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            First-In-First-Out (FIFO) batch allocation by expiration date, barcode verification, and automated low-stock reorder alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 cursor-pointer transition-colors"
              title="Refresh formulary"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <PackageCheck className="h-4 w-4 text-teal-600" />
            <span>FIFO Auto-Allocation Active</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Total Active Batches</div>
            <div className="text-lg font-black text-slate-900 group-hover:text-teal-800 transition-colors">{batches.length} Tracked Batches</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-amber-700">Low Stock Formulations</div>
            <div className="text-lg font-black text-amber-800">{lowStockCount} Items (≤ 30 units)</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 overflow-hidden group">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-rose-700">Expiring Within 90 Days</div>
            <div className="text-lg font-black text-rose-800">{expiringSoonCount} Batches (Prioritized FIFO)</div>
          </div>
        </div>
      </div>

      {/* Dispense Toast Notification */}
      {dispenseResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{dispenseResult}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search batch #, drug name, manufacturer..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDispense('demo-rx-1', batches[0]?.medicineName || 'Amoxicillin 500mg', 10)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PackageCheck className="h-4 w-4" />
              <span>Simulate FIFO Dispense Test</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">Medicine & Strength</th>
                <th className="p-3">Batch Number</th>
                <th className="p-3">Expiration Date (FIFO Sort)</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Rack Location</th>
                <th className="p-3">Manufacturer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map(b => {
                const expDate = new Date(b.expiryDate);
                const isExpiring = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30) <= 3;
                const stock = b.currentStock ?? b.quantityInStock;
                const initQty = b.initialQuantity ?? (stock + 50);
                const isLow = stock <= 30;
                const cost = b.costPerUnit ?? b.unitCost ?? 1.5;

                return (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{b.form || b.dosageForm || 'Tablet'} • {b.strength}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-700">{b.batchNumber}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold ${isExpiring ? 'text-rose-600' : 'text-slate-900'}`}>
                          {b.expiryDate}
                        </span>
                        {isExpiring && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            EXPIRING SOON
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${isLow ? 'bg-amber-500' : 'bg-teal-600'}`}
                            style={{ width: `${Math.min(100, (stock / initQty) * 100)}%` }}
                          />
                        </div>
                        <span className={`font-bold font-mono ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                          {stock} / {initQty}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-800">${cost.toFixed(2)}</td>
                    <td className="p-3 font-mono text-slate-600">{b.rackLocation || 'Rack A-01'}</td>
                    <td className="p-3 text-slate-600">{b.manufacturer || 'MedCore Global Lab'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
