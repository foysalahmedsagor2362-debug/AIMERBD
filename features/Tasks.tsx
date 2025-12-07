import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { Task, Exam } from '../types';
import { Trash2, CheckSquare, Square, Calendar } from 'lucide-react';

interface TasksManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  exams: Exam[];
  setExams: (exams: Exam[]) => void;
}

export const TasksManager: React.FC<TasksManagerProps> = ({ tasks, setTasks, exams, setExams }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'exams'>('tasks');
  
  // Task Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({ status: 'Todo', category: 'Homework' });
  const [newExam, setNewExam] = useState<Partial<Exam>>({});

  const addTask = () => {
    if (!newTask.title || !newTask.subject) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      subject: newTask.subject,
      category: newTask.category as any,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      status: 'Todo'
    };
    setTasks([...tasks, task]);
    setNewTask({ status: 'Todo', category: 'Homework', title: '', subject: '', dueDate: '' });
  };

  const addExam = () => {
    if (!newExam.name || !newExam.date) return;
    const exam: Exam = {
      id: Date.now().toString(),
      name: newExam.name,
      date: newExam.date
    };
    setExams([...exams, exam]);
    setNewExam({ name: '', date: '' });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Done' ? 'Todo' : 'Done' } : t));
  };

  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const deleteExam = (id: string) => setExams(exams.filter(e => e.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'tasks' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('tasks')}
          className="flex-1"
        >
          Tasks
        </Button>
        <Button 
          variant={activeTab === 'exams' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('exams')}
          className="flex-1"
        >
          Exams
        </Button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-6">
          <Card title="Add New Task">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Task Title" 
                value={newTask.title || ''} 
                onChange={e => setNewTask({...newTask, title: e.target.value})} 
              />
              <Input 
                placeholder="Subject" 
                value={newTask.subject || ''} 
                onChange={e => setNewTask({...newTask, subject: e.target.value})} 
              />
              <Select 
                value={newTask.category} 
                onChange={e => setNewTask({...newTask, category: e.target.value as any})}
              >
                <option value="Homework">Homework</option>
                <option value="MCQ">MCQ Practice</option>
                <option value="Revision">Revision</option>
                <option value="Reading">Reading</option>
              </Select>
              <Input 
                type="date" 
                value={newTask.dueDate || ''} 
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})} 
              />
            </div>
            <Button onClick={addTask} className="mt-4 w-full">Add Task</Button>
          </Card>

          <div className="space-y-3">
            {tasks.length === 0 && <p className="text-center text-slate-400 py-8">No tasks added yet.</p>}
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border ${task.status === 'Done' ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTaskStatus(task.id)} className="text-slate-400 hover:text-brand-500">
                    {task.status === 'Done' ? <CheckSquare className="text-brand-500" /> : <Square />}
                  </button>
                  <div>
                    <h4 className={`font-medium ${task.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</h4>
                    <div className="flex gap-2 text-xs mt-1">
                      <Badge>{task.subject}</Badge>
                      <Badge color="blue">{task.category}</Badge>
                      {task.dueDate && <span className="text-slate-400 flex items-center gap-1"><Calendar size={12}/> {task.dueDate}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card title="Add Upcoming Exam">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Exam Name (e.g. Biology Term 1)" 
                value={newExam.name || ''} 
                onChange={e => setNewExam({...newExam, name: e.target.value})} 
              />
              <Input 
                type="date" 
                value={newExam.date || ''} 
                onChange={e => setNewExam({...newExam, date: e.target.value})} 
              />
            </div>
            <Button onClick={addExam} className="mt-4 w-full">Add Exam</Button>
          </Card>
          
          <div className="space-y-3">
            {exams.length === 0 && <p className="text-center text-slate-400 py-8">No exams scheduled.</p>}
            {exams.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => {
               const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
               return (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl border bg-white border-slate-200">
                  <div>
                    <h4 className="font-semibold text-slate-800">{exam.name}</h4>
                    <p className="text-sm text-slate-500">{exam.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge color={daysLeft < 3 ? 'red' : daysLeft < 7 ? 'yellow' : 'green'}>
                      {daysLeft} days left
                    </Badge>
                    <button onClick={() => deleteExam(exam.id)} className="block ml-auto mt-2 text-slate-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
