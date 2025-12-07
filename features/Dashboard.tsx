import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { StudentTrack, DailyStats, SalatRecord } from '../types';
import { ISLAMIC_QUOTES } from '../constants';
import { Quote, User, Activity, CheckCircle, Zap } from 'lucide-react';

interface DashboardProps {
  track: StudentTrack;
  setTrack: (t: StudentTrack) => void;
  salat: SalatRecord;
  stats: DailyStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ track, setTrack, salat, stats }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Random quote on mount
    setQuoteIndex(Math.floor(Math.random() * ISLAMIC_QUOTES.length));
    
    // Set greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const salatCount = Object.values(salat).filter(v => v === true).length - 1; // -1 because date is a property

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrack(e.target.value as StudentTrack);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wide">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{greeting}, Student</h1>
          <p className="text-slate-500 mt-1">Let's make today productive and blessed.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 pl-4 pr-2 rounded-xl shadow-sm border border-slate-200">
          <User size={18} className="text-brand-600" />
          <div className="flex flex-col">
             <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Current Track</span>
             <select 
                value={track || ''} 
                onChange={handleTrackChange}
                className="bg-transparent font-semibold text-sm text-slate-800 outline-none cursor-pointer hover:text-brand-600 transition-colors"
              >
                <option value="" disabled>Select Track</option>
                <option value="HSC-11">HSC Class 11</option>
                <option value="HSC-12">HSC Class 12</option>
                <option value="Medical">Medical Admission</option>
                <option value="Engineering">Engineering Admission</option>
                <option value="University">University Admission</option>
              </select>
          </div>
        </div>
      </header>

      {/* Islamic Reminder Hero */}
      <Card className="bg-gradient-to-br from-brand-600 to-emerald-800 text-white border-none shadow-lg shadow-brand-900/20">
        <div className="flex flex-col md:flex-row items-center gap-6 py-2">
           <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Quote size={32} className="text-brand-100" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-white/95">"{ISLAMIC_QUOTES[quoteIndex].text}"</p>
              <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
                 <span className="px-2 py-1 rounded bg-white/20 text-xs font-medium text-brand-50 backdrop-blur-md border border-white/10">
                    {ISLAMIC_QUOTES[quoteIndex].type}
                 </span>
                 <span className="text-sm text-brand-100 font-medium">
                    — {ISLAMIC_QUOTES[quoteIndex].source}
                 </span>
              </div>
           </div>
           <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 hover:text-white shrink-0"
            onClick={() => setQuoteIndex((prev) => (prev + 1) % ISLAMIC_QUOTES.length)}
          >
            New Quote
          </Button>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-emerald-200 group cursor-default">
          <div className="flex items-start justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500 mb-1">Salat Streak</p>
               <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{salatCount}/5</h3>
             </div>
             <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
               <Activity size={24} />
             </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(salatCount/5)*100}%` }}></div>
          </div>
        </Card>

        <Card className="hover:border-amber-200 group cursor-default">
          <div className="flex items-start justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500 mb-1">Focus Time</p>
               <h3 className="text-2xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{stats.pomodoros} <span className="text-sm font-normal text-slate-400">sessions</span></h3>
             </div>
             <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform duration-300">
               <Zap size={24} />
             </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Keep your focus sharp!</p>
        </Card>

        <Card className="hover:border-blue-200 group cursor-default">
          <div className="flex items-start justify-between">
             <div>
               <p className="text-sm font-medium text-slate-500 mb-1">Study Blocks</p>
               <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{stats.studyBlocksCompleted} <span className="text-sm font-normal text-slate-400">completed</span></h3>
             </div>
             <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
               <CheckCircle size={24} />
             </div>
          </div>
           <p className="text-xs text-slate-400 mt-4">Consistency is key.</p>
        </Card>
      </div>

    </div>
  );
};
