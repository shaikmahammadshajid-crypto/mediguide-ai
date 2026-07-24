import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  X, 
  Pill, 
  Droplet, 
  Activity, 
  Stethoscope,
  BellRing
} from 'lucide-react';
import { Reminder, Appointment, UserProfile } from '../types';

interface RemindersManagerProps {
  reminders: Reminder[];
  appointments: Appointment[];
  onSaveReminder: (rem: Reminder) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  userProfile: UserProfile;
}

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  reminders,
  appointments,
  onSaveReminder,
  onDeleteReminder,
  userProfile
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('Medicine');
  const [time, setTime] = useState('08:00 AM');
  const [frequency, setFrequency] = useState<Reminder['frequency']>('Daily');
  const [dosageDetails, setDosageDetails] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRem: Reminder = {
      id: 'rem_' + Date.now(),
      userId: userProfile.uid,
      title,
      type,
      time,
      frequency,
      active: true,
      dosageDetails
    };

    await onSaveReminder(newRem);
    setIsAddModalOpen(false);
    setTitle('');
    setDosageDetails('');
  };

  const handleToggleActive = async (rem: Reminder) => {
    await onSaveReminder({ ...rem, active: !rem.active });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Health Schedule & Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Medication & Wellness Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Set custom alert timers for prescriptions, hydration goals, exercise, and doctor appointments.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Reminder</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Reminders List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BellRing className="w-4 h-4 text-teal-500" /> Active Daily Schedules ({reminders.length})
          </h3>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                  rem.active 
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
                    {rem.type === 'Medicine' ? '💊' : rem.type === 'Water' ? '💧' : rem.type === 'Exercise' ? '🏃' : '👨‍⚕️'}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                      {rem.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ⏰ {rem.time} • {rem.frequency} {rem.dosageDetails && `• ${rem.dosageDetails}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(rem)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      rem.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {rem.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Appointments List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-500" /> Upcoming Doctor Consultations ({appointments.length})
          </h3>

          <div className="space-y-3">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                      {app.doctorName}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">
                      {app.specialty} • {app.mode}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {app.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                  <span>📅 {app.date} at {app.time}</span>
                  <span className="truncate max-w-[160px]">{app.locationOrLink}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Schedule Reminder</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Take Metformin 500mg"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                  >
                    <option value="Medicine">Medicine</option>
                    <option value="Water">Water</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Appointment">Appointment</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Instructions / Dosage</label>
                <input
                  type="text"
                  value={dosageDetails}
                  onChange={(e) => setDosageDetails(e.target.value)}
                  placeholder="1 Tablet with water after breakfast"
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl">Save Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
