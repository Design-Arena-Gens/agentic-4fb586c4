'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskItem from './TaskItem';
import { Task, Quadrant } from '@/types';

interface MatrixQuadrantProps {
  quadrant: Quadrant;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  textColor: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MatrixQuadrant({
  quadrant,
  title,
  subtitle,
  color,
  borderColor,
  textColor,
  tasks,
  onToggle,
  onDelete,
}: MatrixQuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: quadrant,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${color} ${borderColor} border-2 rounded-lg p-4 lg:p-6 min-h-[400px] transition-all ${
        isOver ? 'ring-4 ring-blue-500 ring-opacity-50 scale-[1.02]' : ''
      }`}
    >
      <div className="mb-4">
        <h3 className={`text-lg lg:text-xl font-bold ${textColor} mb-1`}>{title}</h3>
        <p className={`text-sm font-medium ${textColor} opacity-75`}>{subtitle}</p>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs mt-1">Drag tasks here or add new ones</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
