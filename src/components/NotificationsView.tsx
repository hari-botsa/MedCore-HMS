import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  CheckCheck, 
  Filter, 
  Calendar, 
  FlaskConical, 
  Receipt, 
  Pill, 
  CreditCard,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Notification, NotificationChannel, NotificationEventType, UserProfile } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  currentUser?: UserProfile;
  onMarkRead?: (id: string) => Promise<void>;
  onMarkAsRead?: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  currentUser,
  onMarkRead,
  onMarkAsRead,
  onRefresh
}) => {
  const markHandler = onMarkRead || onMarkAsRead || (async () => {});
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = notifications.filter(n => {
    const matchesChannel = selectedChannel === 'ALL' || n.channel === selectedChannel;
    const matchesUnread = !unreadOnly || !n.isRead;
    const matchesSearch = 
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.recipientName.toLowerCase().includes(search.toLowerCase());
    return matchesChannel && matchesUnread && matchesSearch;
  });

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4 text-emerald-600" />;
      case 'IN_APP':
        return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };

  const getEventIcon = (event: NotificationEventType | string) => {
    switch (event) {
      case 'APPOINTMENT_CONFIRMED':
      case 'APPOINTMENT_REMINDER':
        return <Calendar className="h-4 w-4 text-teal-600" />;
      case 'LAB_APPROVED':
        return <FlaskConical className="h-4 w-4 text-indigo-600" />;
      case 'INVOICE_GENERATED':
        return <Receipt className="h-4 w-4 text-amber-600" />;
      case 'PAYMENT_RECEIVED':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case 'LOW_STOCK':
      case 'EMERGENCY_ALERT':
        return <Pill className="h-4 w-4 text-pink-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900">Hospital Notification Dispatch Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Event-driven multi-channel alert delivery (One Event → Handlers for In-App UI, Transactional Email, and SMS Gateways)
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
        >
          Refresh Feed
        </button>
      </div>

      {/* Multi-Channel Distribution Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between overflow-hidden group">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Dispatched</div>
            <div className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{notifications.length}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between overflow-hidden group">
          <div>
            <div className="text-[10px] uppercase font-bold text-purple-700">In-App Alerts</div>
            <div className="text-lg font-bold text-slate-900">
              {notifications.filter(n => n.channel === 'IN_APP').length}
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Bell className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between overflow-hidden group">
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-700">Email Dispatches</div>
            <div className="text-lg font-bold text-slate-900">
              {notifications.filter(n => n.channel === 'EMAIL').length}
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Mail className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between overflow-hidden group">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-700">SMS Gateways</div>
            <div className="text-lg font-bold text-slate-900">
              {notifications.filter(n => n.channel === 'SMS').length}
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Smartphone className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Channel Filter:</span>
          {['ALL', 'IN_APP', 'EMAIL', 'SMS'].map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedChannel === ch
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={e => setUnreadOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Unread Only</span>
          </label>

          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter messages..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Notification Stream */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No notifications matching current filters.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isRead ? 'bg-white border-slate-200' : 'bg-teal-50/40 border-teal-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getEventIcon(item.eventType)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {getChannelIcon(item.channel)}
                      <span>{item.channel}</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      To: {item.recipientRole} ({item.recipientName})
                    </span>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-teal-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{item.message}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Event: {item.eventType} • {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => markHandler(item.id)}
                  className="self-end sm:self-center px-3 py-1 rounded-lg text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors flex items-center gap-1 shrink-0"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
