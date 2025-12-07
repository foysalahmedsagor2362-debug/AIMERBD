import React from 'react';
import { Card } from '../components/ui';
import { SalatRecord } from '../types';
import { Check, Moon, Sun, Sunrise, Sunset } from 'lucide-react';

interface SalatTrackerProps {
  salat: SalatRecord;
  toggleSalat: (key: keyof SalatRecord) => void;
}

export const SalatTracker: React.FC<SalatTrackerProps> = ({ salat, toggleSalat }) => {
  const prayers: { key: keyof SalatRecord; label: string; icon: React.ReactNode; time: string }[] = [
    { key: 'fajr', label: 'Fajr', icon: <Sunrise size={20} className="text-orange-400" />, time: "Before Sunrise" },
    { key: 'dhuhr', label: 'Dhuhr', icon: <Sun size={20} className="text-yellow-500" />, time: "Noon" },
    { key: 'asr', label: 'Asr', icon: <Sun size={20} className="text-orange-500" />, time: "Afternoon" },
    { key: 'maghrib', label: 'Maghrib', icon: <Sunset size={20} className="text-indigo-400" />, time: "After Sunset" },
    { key: 'isha', label: 'Isha', icon: <Moon size={20} className="text-slate-600" />, time: "Night" },
  ];

  const completedCount = prayers.filter(p => salat[p.key]).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Daily Salat</h2>
        <p className="text-slate-500">Prayer is better than sleep.</p>
        <div className="mt-4 inline-block bg-brand-100 text-brand-800 px-4 py-1 rounded-full font-medium text-sm">
          Today: {completedCount} / 5 Prayed
        </div>
      </div>

      <div className="grid gap-3">
        {prayers.map((prayer) => {
          const isDone = salat[prayer.key] as boolean;
          return (
            <div 
              key={prayer.key}
              onClick={() => toggleSalat(prayer.key)}
              className={`
                relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${isDone 
                  ? 'bg-brand-50 border-brand-200 shadow-inner' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isDone ? 'bg-white' : 'bg-slate-50'}`}>
                  {prayer.icon}
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${isDone ? 'text-brand-900' : 'text-slate-700'}`}>
                    {prayer.label}
                  </h3>
                  <p className="text-xs text-slate-400">{prayer.time}</p>
                </div>
              </div>

              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                ${isDone 
                  ? 'bg-brand-500 border-brand-500 text-white' 
                  : 'border-slate-300 text-transparent'
                }
              `}>
                <Check size={16} strokeWidth={4} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
