'use client';

import { useState } from 'react';
import { Quadrant } from '@/types';
import { X } from 'lucide-react';

interface TaskInputProps {
  onAdd: (title: string, quadrant: Quadrant) => void;
  onCancel: () => void;
}

export default function TaskInput({ onAdd, onCancel }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const quadrant: Quadrant = urgent
        ? important
          ? 'urgent-important'
          : 'urgent-not-important'
        : important
        ? 'not-urgent-important'
        : 'not-urgent-not-important';

      onAdd(title, quadrant);
      setTitle('');
      setUrgent(false);
      setImportant(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-slate-300 p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Add New Task</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task description..."
        className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        autoFocus
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Urgent
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Important
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
