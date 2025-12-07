import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Book, Timer, Moon, CheckSquare, ChevronRight, GraduationCap } from 'lucide-react';
import { Dashboard } from './features/Dashboard';
import { Planner } from './features/Planner';
import { Pomodoro } from './features/Pomodoro';
import { SalatTracker } from './features/Salat';
import { TasksManager } from './features/Tasks';
import { AdBanner } from './components/AdBanner';
import { StudentTrack, DailyStats, SalatRecord, Task, Exam } from './types';

// ==========================================
// 🔧 ADSENSE CONFIGURATION - EDIT THIS SECTION
// ==========================================
const AD_CONFIG = {
  // 1. Your Publisher ID
  publisherId: "ca-pub-8032698155400861", 
  
  // 2. Your Ad Slot IDs (Create these in AdSense Dashboard > Ads > By ad unit)
  slots: {
    sidebar: "0000000000",      // REPLACE THIS with your Sidebar Ad Unit ID
    leaderboard: "1234567890"   // REPLACE THIS with your Main Banner Ad Unit ID
  },

  // 3. Set this to FALSE when you deploy to Vercel to see real ads
  isTestMode: false 
};
// ==========================================

// Simple Hook for LocalStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const todayStr = new Date().toISOString().split('T')[0];

const defaultSalat: SalatRecord = {
  date: todayStr,
  fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false
};

const defaultStats: DailyStats = {
  date: todayStr,
  pomodoros: 0,
  studyBlocksCompleted: 0
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App State
  const [track, setTrack] = useLocalStorage<StudentTrack>('aimers_track', null);
  const [salat, setSalat] = useLocalStorage<SalatRecord>('aimers_salat', defaultSalat);
  const [stats, setStats] = useLocalStorage<DailyStats>('aimers_stats', defaultStats);
  const [tasks, setTasks] = useLocalStorage<Task[]>('aimers_tasks', []);
  const [exams, setExams] = useLocalStorage<Exam[]>('aimers_exams', []);

  // Check for day change to reset daily trackers
  useEffect(() => {
    if (salat.date !== todayStr) {
      setSalat({ ...defaultSalat, date: todayStr });
    }
    if (stats.date !== todayStr) {
      setStats({ ...defaultStats, date: todayStr });
    }
  }, [salat.date, stats.date, setSalat, setStats]);

  const toggleSalat = (key: keyof SalatRecord) => {
    setSalat({ ...salat, [key]: !salat[key] });
  };

  const incrementPomodoro = () => {
    setStats({ ...stats, pomodoros: stats.pomodoros + 1 });
  };

  const handlePlanGenerated = (blocks: number) => {
      // Just visually update stats if needed, or store projected blocks
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard track={track} setTrack={setTrack} salat={salat} stats={stats} />;
      case 'planner': return <Planner track={track} onPlanGenerated={handlePlanGenerated} />;
      case 'pomodoro': return <Pomodoro onComplete={incrementPomodoro} />;
      case 'salat': return <SalatTracker salat={salat} toggleSalat={toggleSalat} />;
      case 'tasks': return <TasksManager tasks={tasks} setTasks={setTasks} exams={exams} setExams={setExams} />;
      default: return <Dashboard track={track} setTrack={setTrack} salat={salat} stats={stats} />;
    }
  };

  const NavButton = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center w-full py-3 gap-1 transition-all duration-200 relative ${activeTab === id ? 'text-brand-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {activeTab === id && (
        <span className="absolute -top-0.5 w-8 h-1 bg-brand-600 rounded-b-lg shadow-sm shadow-brand-200"></span>
      )}
      {icon}
      <span className="text-[10px] font-medium tracking-tight">{label}</span>
    </button>
  );

  const SidebarItem = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        activeTab === id 
        ? 'bg-brand-50 text-brand-700 font-medium shadow-sm border border-brand-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-colors ${activeTab === id ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
      {activeTab === id && <ChevronRight size={16} className="text-brand-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 z-40">
        <div className="p-6 pb-2">
            <div className="flex items-center gap-3 px-2 mb-8">
               <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                 <GraduationCap size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">Aimers</h1>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Study Companion</p>
               </div>
            </div>
            
            <nav className="space-y-1.5">
                <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <SidebarItem id="planner" icon={<Book size={20} />} label="Study Planner" />
                <SidebarItem id="pomodoro" icon={<Timer size={20} />} label="Focus Timer" />
                <SidebarItem id="salat" icon={<Moon size={20} />} label="Salat Tracker" />
                <SidebarItem id="tasks" icon={<CheckSquare size={20} />} label="Tasks & Exams" />
            </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
            {/* Sidebar Ad Slot - Small Rectangle */}
             <div className="mb-4">
              <AdBanner 
                dataAdClient={AD_CONFIG.publisherId} 
                dataAdSlot={AD_CONFIG.slots.sidebar}
                format="rectangle"
                className="my-0"
                isTestMode={AD_CONFIG.isTestMode}
              />
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-xl shadow-slate-200">
               <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Daily Goal</p>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">{stats.pomodoros}</span>
                  <span className="text-sm text-slate-400">/ 8 Pomodoros</span>
               </div>
               <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-400 w-[10%]" style={{ width: `${Math.min((stats.pomodoros / 8) * 100, 100)}%` }}></div>
               </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50/50">
        <main className="flex-1 overflow-y-auto p-4 pb-32 md:p-10 md:pb-10 no-scrollbar scroll-smooth">
            <div className="max-w-4xl mx-auto w-full">
                 {/* Top Banner Ad - Leaderboard */}
                 <AdBanner 
                    dataAdClient={AD_CONFIG.publisherId}
                    dataAdSlot={AD_CONFIG.slots.leaderboard}
                    className="mb-8"
                    isTestMode={AD_CONFIG.isTestMode}
                 />
                 
                 {renderContent()}
            </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-5 h-20 items-center px-2 pb-2">
            <NavButton id="dashboard" icon={<LayoutDashboard size={22} />} label="Home" />
            <NavButton id="planner" icon={<Book size={22} />} label="Plan" />
            <NavButton id="pomodoro" icon={<Timer size={22} />} label="Focus" />
            <NavButton id="salat" icon={<Moon size={22} />} label="Salat" />
            <NavButton id="tasks" icon={<CheckSquare size={22} />} label="Tasks" />
          </div>
        </nav>
      </div>
    </div>
  );
}