'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { GripVertical, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-slate-200 group hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm lg:text-base text-slate-800 break-words ${
              task.completed ? 'line-through text-slate-500' : ''
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="mt-1 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
