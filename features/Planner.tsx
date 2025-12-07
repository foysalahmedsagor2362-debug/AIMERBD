import React, { useState } from 'react';
import { Card, Button, Select, Badge } from '../components/ui';
import { StudentTrack, StudyBlock, SubjectDifficulty } from '../types';
import { HSC_SUBJECTS, TRACK_SUBJECTS } from '../constants';
import { BookOpen, Clock, Coffee, Sparkles } from 'lucide-react';

interface PlannerProps {
  track: StudentTrack;
  onPlanGenerated: (count: number) => void;
}

export const Planner: React.FC<PlannerProps> = ({ track, onPlanGenerated }) => {
  const [subjects, setSubjects] = useState<{name: string, difficulty: SubjectDifficulty}[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [generatedRoutine, setGeneratedRoutine] = useState<StudyBlock[]>([]);

  // Initialize subjects based on track
  React.useEffect(() => {
    let baseSubjects: string[] = [];
    if (track === 'HSC-11' || track === 'HSC-12') {
      baseSubjects = HSC_SUBJECTS;
    } else if (track && TRACK_SUBJECTS[track as keyof typeof TRACK_SUBJECTS]) {
      baseSubjects = TRACK_SUBJECTS[track as keyof typeof TRACK_SUBJECTS];
    }
    
    setSubjects(baseSubjects.map(s => ({ name: s, difficulty: 'Medium' })));
  }, [track]);

  const updateDifficulty = (index: number, diff: SubjectDifficulty) => {
    const newSubs = [...subjects];
    newSubs[index].difficulty = diff;
    setSubjects(newSubs);
  };

  const generateRoutine = () => {
    const routine: StudyBlock[] = [];
    const startTime = 8 * 60; // 8:00 AM in minutes
    let currentTime = startTime;
    const totalMinutes = hoursPerDay * 60;
    
    // Sort subjects: Hard first
    const weightedSubjects = [];
    subjects.forEach(s => {
      weightedSubjects.push(s);
      if (s.difficulty === 'Hard') weightedSubjects.push(s); // Add hard twice to increase frequency/likelihood
    });

    let minutesAllocated = 0;
    let subIndex = 0;

    // Round robin shuffle for variety
    const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);

    while (minutesAllocated < totalMinutes) {
      const blockDuration = 45; // 45 min study
      const subject = shuffledSubjects[subIndex % shuffledSubjects.length];
      
      // Study Block
      routine.push({
        id: `study-${minutesAllocated}`,
        startTime: formatMinutes(currentTime),
        endTime: formatMinutes(currentTime + blockDuration),
        subject: subject.name,
        type: 'Study'
      });

      currentTime += blockDuration;
      minutesAllocated += blockDuration;
      subIndex++;

      // Break (10 mins)
      if (minutesAllocated < totalMinutes) {
        routine.push({
          id: `break-${minutesAllocated}`,
          startTime: formatMinutes(currentTime),
          endTime: formatMinutes(currentTime + 15),
          subject: "Refresh & Relax",
          type: 'Break'
        });
        currentTime += 15;
      }
    }

    setGeneratedRoutine(routine);
    onPlanGenerated(routine.filter(r => r.type === 'Study').length);
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {!track ? (
         <div className="text-center p-8 text-slate-500">Please select a track in the Dashboard first.</div>
      ) : (
        <>
          <Card title="Planner Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Daily Study Hours</label>
                <Select value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))}>
                  {[2, 4, 6, 8, 10, 12].map(h => <option key={h} value={h}>{h} Hours</option>)}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Subject Difficulty</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-sm font-medium">{sub.name}</span>
                      <select 
                        className="text-xs border rounded p-1"
                        value={sub.difficulty}
                        onChange={(e) => updateDifficulty(idx, e.target.value as SubjectDifficulty)}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generateRoutine} className="w-full flex justify-center items-center gap-2">
                <Sparkles size={18} /> Generate Routine
              </Button>
            </div>
          </Card>

          {generatedRoutine.length > 0 && (
            <div className="space-y-3 pb-8">
              <h3 className="font-bold text-slate-800 text-lg">Your Daily Plan</h3>
              {generatedRoutine.map((block) => (
                <div key={block.id} className={`flex gap-4 p-4 rounded-xl border ${block.type === 'Break' ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-col items-center justify-center w-16 text-xs text-slate-500 font-medium">
                    <span>{block.startTime}</span>
                    <div className="h-8 w-0.5 bg-slate-200 my-1"></div>
                    <span>{block.endTime}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${block.type === 'Break' ? 'bg-amber-200 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>
                       {block.type === 'Break' ? <Coffee size={20} /> : <BookOpen size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{block.subject}</h4>
                      <p className="text-sm text-slate-500">{block.type === 'Break' ? 'Take a rest, stretch, drink water.' : 'Focus deeply. No distractions.'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
