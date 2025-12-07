import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer } from 'lucide-react';

interface PomodoroProps {
  onComplete: () => void;
}

export const Pomodoro: React.FC<PomodoroProps> = ({ onComplete }) => {
  // Configurable focus duration state
  const [focusDuration, setFocusDuration] = useState(120 * 60); // Default to 120m
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [taskName, setTaskName] = useState('');

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusDuration : 5 * 60);
  }, [mode, focusDuration]);

  // Update timer if duration changes while paused in focus mode
  useEffect(() => {
    if (mode === 'focus' && !isActive) {
      setTimeLeft(focusDuration);
    }
  }, [focusDuration, mode, isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        onComplete(); // Increment global stats
        setMode('break');
        setTimeLeft(5 * 60);
        // Simple notification sound or alert could go here
      } else {
        setMode('focus');
        setTimeLeft(focusDuration);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onComplete, focusDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (minutes: number) => {
    setFocusDuration(minutes * 60);
    if (mode === 'focus') {
      setIsActive(false);
      setTimeLeft(minutes * 60);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="text-center py-8">
        
        {/* Duration Selector */}
        <div className="flex justify-center gap-2 mb-6">
           {[25, 60, 120].map((mins) => (
             <button
               key={mins}
               onClick={() => handleDurationChange(mins)}
               className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
                 focusDuration === mins * 60 && mode === 'focus'
                   ? 'bg-brand-100 text-brand-700 border-brand-200'
                   : 'bg-white text-slate-500 border-slate-200 hover:border-brand-200'
               }`}
             >
               {mins}m
             </button>
           ))}
        </div>

        <div className="mb-6 flex justify-center">
            {mode === 'focus' ? (
                <div className="flex items-center gap-2 text-brand-600 bg-brand-50 px-4 py-1.5 rounded-full transition-colors">
                    <Brain size={18} /> <span className="font-medium">Focus Time ({focusDuration / 60}m)</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full transition-colors">
                    <Coffee size={18} /> <span className="font-medium">Take a Break</span>
                </div>
            )}
        </div>

        <div className="text-7xl font-bold text-slate-800 tracking-tight font-mono mb-8 tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={toggleTimer} 
            className={`w-32 h-12 flex items-center justify-center gap-2 text-lg shadow-md ${isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-200'}`}
          >
            {isActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
          </Button>
          <Button variant="outline" onClick={resetTimer} className="h-12 w-12 flex items-center justify-center rounded-full p-0 border-2">
            <RotateCcw size={20} />
          </Button>
        </div>

        <div className="px-6 text-left">
          <label className="block text-sm font-medium text-slate-500 mb-2">Current Focus Task</label>
          <Input 
            placeholder="What are you studying?" 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
          />
        </div>
      </Card>

      <div className="text-center text-sm text-slate-400">
        "Every minute of learning with good intention earns reward."
      </div>
    </div>
  );
};
